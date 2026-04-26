const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { getFirestore } = require("./firebase");

const ACCOUNT_ID_PATTERN = /^K00\d{6}$/;

function getUsersCollectionName() {
  return process.env.FIREBASE_USERS_COLLECTION || "users";
}

function getUsersFile() {
  return process.env.USERS_DATA_FILE || path.join(__dirname, "users.json");
}

function getAdminAccountIds() {
  return new Set(
    String(process.env.ADMIN_ACCOUNT_IDS || "")
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean)
  );
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeAccountId(accountId) {
  return String(accountId || "").trim().toUpperCase();
}

function normalizeIdentifier(identifier) {
  const raw = String(identifier || "").trim();
  return raw.toUpperCase().startsWith("K00") ? raw.toUpperCase() : raw.toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isValidAccountId(accountId) {
  return ACCOUNT_ID_PATTERN.test(normalizeAccountId(accountId));
}

function isAccountId(identifier) {
  return isValidAccountId(identifier);
}

function resolveRole(user) {
  if (getAdminAccountIds().has(normalizeAccountId(user.accountId))) {
    return "Admin";
  }

  return user.role || "Member";
}

function sanitizeUser(user) {
  return {
    id: user.id,
    accountId: user.accountId,
    name: user.name,
    email: user.email,
    role: resolveRole(user),
    createdAt: user.createdAt
  };
}

function toStoredUser(input) {
  return {
    id: input.id,
    accountId: normalizeAccountId(input.accountId),
    name: input.name,
    email: normalizeEmail(input.email),
    role: input.role || "Member",
    passwordHash: input.passwordHash,
    createdAt: input.createdAt
  };
}

async function readUsers() {
  const firestore = getFirestore();

  if (firestore) {
    const snapshot = await firestore.collection(getUsersCollectionName()).get();
    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));
  }

  const raw = await fs.readFile(getUsersFile(), "utf8");
  return JSON.parse(raw);
}

async function writeUsers(users) {
  const firestore = getFirestore();

  if (firestore) {
    const batch = firestore.batch();
    const collection = firestore.collection(getUsersCollectionName());
    const existing = await collection.get();

    existing.docs.forEach((document) => {
      batch.delete(document.ref);
    });

    users.forEach((user) => {
      batch.set(collection.doc(user.id), user);
    });

    await batch.commit();
    return;
  }

  await fs.writeFile(getUsersFile(), JSON.stringify(users, null, 2));
}

async function createFirestoreUser(user) {
  const firestore = getFirestore();

  if (!firestore) {
    return null;
  }

  await firestore.collection(getUsersCollectionName()).doc(user.id).set(user);
  return user;
}

function validateSignupInput(input) {
  const name = String(input.name || "").trim();
  const email = normalizeEmail(input.email);
  const accountId = normalizeAccountId(input.accountId);
  const password = String(input.password || "");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Please enter a valid email address.");
  }

  if (!isValidAccountId(accountId)) {
    throw new Error("Account ID must be between K00000000 and K00999999.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  return {
    name,
    email,
    accountId,
    password
  };
}

async function findUserById(userId) {
  const users = await readUsers();
  const user = users.find((entry) => entry.id === userId);
  return user ? sanitizeUser(user) : null;
}

async function findUserByEmail(email) {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);
  const user = users.find((entry) => entry.email === normalizedEmail);
  return user ? sanitizeUser(user) : null;
}

async function findUserByAccountId(accountId) {
  const users = await readUsers();
  const normalizedAccountId = normalizeAccountId(accountId);
  const user = users.find((entry) => entry.accountId === normalizedAccountId);
  return user ? sanitizeUser(user) : null;
}

async function findUserByIdentifier(identifier) {
  return isAccountId(identifier)
    ? findUserByAccountId(identifier)
    : findUserByEmail(identifier);
}

async function createUser(input) {
  const firestore = getFirestore();
  const normalizedUser = validateSignupInput(input);
  const existingUser = await findUserByEmail(normalizedUser.email);
  const existingAccountId = await findUserByAccountId(normalizedUser.accountId);

  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  if (existingAccountId) {
    throw new Error("That K-number is already in the system.");
  }

  const passwordHash = await bcrypt.hash(normalizedUser.password, 10);
  const user = toStoredUser({
    id: crypto.randomUUID(),
    accountId: normalizedUser.accountId,
    name: normalizedUser.name,
    email: normalizedUser.email,
    role: getAdminAccountIds().has(normalizedUser.accountId) ? "Admin" : "Member",
    passwordHash,
    createdAt: new Date().toISOString()
  });

  if (firestore) {
    await createFirestoreUser(user);
  } else {
    const users = await readUsers();
    users.push(user);
    await writeUsers(users);
  }

  return sanitizeUser(user);
}

async function authenticateUser(identifier, password) {
  const users = await readUsers();
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const user = users.find((entry) => {
    if (isAccountId(normalizedIdentifier)) {
      return entry.accountId === normalizedIdentifier;
    }

    return entry.email === normalizedIdentifier;
  });

  if (!user) {
    throw new Error("Invalid account ID/email or password.");
  }

  const passwordMatches = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!passwordMatches) {
    throw new Error("Invalid account ID/email or password.");
  }

  return sanitizeUser(user);
}

module.exports = {
  authenticateUser,
  createUser,
  findUserByAccountId,
  findUserByEmail,
  findUserByIdentifier,
  findUserById,
  isValidAccountId
};
