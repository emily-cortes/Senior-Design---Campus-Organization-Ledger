const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { getFirestore } = require("./firebase");

const VALID_TYPES = new Set(["income", "expense"]);
const VALID_STATUSES = new Set(["approved", "pending"]);

function getLedgerFile() {
  return process.env.LEDGER_DATA_FILE || path.join(__dirname, "ledger.json");
}

function getOrganizationsCollectionName() {
  return process.env.FIREBASE_ORGANIZATIONS_COLLECTION || "organizations";
}

function getTransactionsCollectionName() {
  return process.env.FIREBASE_TRANSACTIONS_COLLECTION || "transactions";
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

async function readLocalLedger() {
  const raw = await fs.readFile(getLedgerFile(), "utf8");
  return JSON.parse(raw);
}

async function writeLocalLedger(ledger) {
  await fs.writeFile(getLedgerFile(), JSON.stringify(ledger, null, 2));
}

async function seedFirestoreLedger(firestore, ledger) {
  const batch = firestore.batch();
  const organizationsCollection = firestore.collection(getOrganizationsCollectionName());
  const transactionsCollection = firestore.collection(getTransactionsCollectionName());

  ledger.organizations.forEach((organization) => {
    batch.set(organizationsCollection.doc(organization.id), organization);
  });

  ledger.transactions.forEach((transaction) => {
    batch.set(transactionsCollection.doc(transaction.id), transaction);
  });

  await batch.commit();
}

async function readFirestoreLedger(firestore) {
  const organizationsCollection = firestore.collection(getOrganizationsCollectionName());
  const transactionsCollection = firestore.collection(getTransactionsCollectionName());
  const [organizationSnapshot, transactionSnapshot] = await Promise.all([
    organizationsCollection.get(),
    transactionsCollection.get()
  ]);

  if (organizationSnapshot.empty && transactionSnapshot.empty) {
    const seedLedger = await readLocalLedger();
    await seedFirestoreLedger(firestore, seedLedger);
    return seedLedger;
  }

  return {
    organizations: organizationSnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    })),
    transactions: transactionSnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }))
  };
}

async function readLedger() {
  const firestore = getFirestore();

  if (firestore) {
    return readFirestoreLedger(firestore);
  }

  return readLocalLedger();
}

async function writeLedger(ledger) {
  const firestore = getFirestore();

  if (firestore) {
    const organizationsCollection = firestore.collection(getOrganizationsCollectionName());
    const transactionsCollection = firestore.collection(getTransactionsCollectionName());
    const [existingOrganizations, existingTransactions] = await Promise.all([
      organizationsCollection.get(),
      transactionsCollection.get()
    ]);
    const batch = firestore.batch();

    existingOrganizations.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    existingTransactions.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    ledger.organizations.forEach((organization) => {
      batch.set(organizationsCollection.doc(organization.id), organization);
    });

    ledger.transactions.forEach((transaction) => {
      batch.set(transactionsCollection.doc(transaction.id), transaction);
    });

    await batch.commit();
    return;
  }

  await writeLocalLedger(ledger);
}

function buildSummary(organization, transactions) {
  const organizationTransactions = transactions
    .filter((transaction) => transaction.organizationId === organization.id)
    .sort((left, right) => right.date.localeCompare(left.date));

  const approvedIncome = organizationTransactions
    .filter((transaction) => transaction.status === "approved" && transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const approvedExpenses = organizationTransactions
    .filter((transaction) => transaction.status === "approved" && transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const pendingExpenses = organizationTransactions
    .filter((transaction) => transaction.status === "pending" && transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const currentBalance = roundCurrency(
    organization.initialBalance + approvedIncome - approvedExpenses
  );

  return {
    organizationId: organization.id,
    initialBalance: roundCurrency(organization.initialBalance),
    approvedIncome: roundCurrency(approvedIncome),
    approvedExpenses: roundCurrency(approvedExpenses),
    pendingExpenses: roundCurrency(pendingExpenses),
    currentBalance,
    projectedBalance: roundCurrency(currentBalance - pendingExpenses),
    transactionCount: organizationTransactions.length,
    recentTransactions: organizationTransactions.slice(0, 5)
  };
}

async function getOrganizationsWithSummaries() {
  const ledger = await readLedger();

  return ledger.organizations.map((organization) => ({
    ...organization,
    summary: buildSummary(organization, ledger.transactions)
  }));
}

async function getOrganizationById(organizationId) {
  const organizations = await getOrganizationsWithSummaries();
  return organizations.find((organization) => organization.id === organizationId) || null;
}

async function getTransactionsForOrganization(organizationId) {
  const ledger = await readLedger();

  return ledger.transactions
    .filter((transaction) => transaction.organizationId === organizationId)
    .sort((left, right) => right.date.localeCompare(left.date));
}

function normalizeTransactionInput(input) {
  const amount = Number(input.amount);

  if (!input.date) {
    throw new Error("Transaction date is required.");
  }

  if (!input.description || !input.description.trim()) {
    throw new Error("Transaction description is required.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Transaction amount must be greater than zero.");
  }

  if (!VALID_TYPES.has(input.type)) {
    throw new Error("Transaction type must be income or expense.");
  }

  if (!VALID_STATUSES.has(input.status)) {
    throw new Error("Transaction status must be approved or pending.");
  }

  return {
    id: crypto.randomUUID(),
    date: input.date,
    description: input.description.trim(),
    category: (input.category || "General").trim(),
    fund: (input.fund || "Operating").trim(),
    amount: roundCurrency(amount),
    type: input.type,
    status: input.status,
    submittedBy: (input.submittedBy || "Treasurer").trim(),
    approvedBy: input.approvedBy ? String(input.approvedBy).trim() : "",
    approvedAt: input.approvedAt ? String(input.approvedAt).trim() : ""
  };
}

async function addTransaction(organizationId, input) {
  const ledger = await readLedger();
  const organization = ledger.organizations.find((entry) => entry.id === organizationId);

  if (!organization) {
    throw new Error("Organization not found.");
  }

  const transaction = normalizeTransactionInput(input);

  ledger.transactions.push({
    ...transaction,
    organizationId
  });

  organization.updatedAt = new Date().toISOString();

  await writeLedger(ledger);

  return transaction;
}

async function updateTransactionStatus(organizationId, transactionId, statusUpdate) {
  const ledger = await readLedger();
  const organization = ledger.organizations.find((entry) => entry.id === organizationId);

  if (!organization) {
    throw new Error("Organization not found.");
  }

  if (!VALID_STATUSES.has(statusUpdate.status)) {
    throw new Error("Transaction status must be approved or pending.");
  }

  const transaction = ledger.transactions.find(
    (entry) => entry.organizationId === organizationId && entry.id === transactionId
  );

  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  transaction.status = statusUpdate.status;
  transaction.approvedBy =
    statusUpdate.status === "approved" ? String(statusUpdate.approvedBy || "").trim() : "";
  transaction.approvedAt = statusUpdate.status === "approved" ? new Date().toISOString() : "";
  organization.updatedAt = new Date().toISOString();

  await writeLedger(ledger);

  return transaction;
}

module.exports = {
  addTransaction,
  getOrganizationById,
  getOrganizationsWithSummaries,
  getTransactionsForOrganization,
  updateTransactionStatus
};
