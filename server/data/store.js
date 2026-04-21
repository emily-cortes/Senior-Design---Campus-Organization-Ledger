const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const dataFile = path.join(__dirname, "ledger.json");

const VALID_TYPES = new Set(["income", "expense"]);
const VALID_STATUSES = new Set(["approved", "pending"]);

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

async function readLedger() {
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeLedger(ledger) {
  await fs.writeFile(dataFile, JSON.stringify(ledger, null, 2));
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
    submittedBy: (input.submittedBy || "Treasurer").trim()
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

module.exports = {
  addTransaction,
  getOrganizationById,
  getOrganizationsWithSummaries,
  getTransactionsForOrganization
};
