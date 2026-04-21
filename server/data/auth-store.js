const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const VALID_ROLES = new Set(["Member", "Treasurer", "Advisor", "Admin"]);

function getUsersFile() {
  return process.env.USERS_DATA_FILE || path.join(__dirname, "users.json");
}

async function readUsers() {
  const raw = await fs.readFile(getUsersFile(), "utf8");
  return JSON.parse(raw);
}

async function writeUsers(users) {
  await fs.writeFile(getUsersFile(), JSON.stringify(users, null, 2));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateSignupInput(input) {
  const name = String(input.name || "").trim();
  const email = normalizeEmail(input.email);
  const password = String(input.password || "");

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  return {
    name,
    email,
    password
  };
}

async function createUser(input) {
  const users = await readUsers();
  const normalizedUser = validateSignupInput(input);

  const existingUser = users.find((user) => user.email === normalizedUser.email);
  if (existingUser) {
    throw new Error("An account with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(normalizedUser.password, 10);
  const user = {
    id: crypto.randomUUID(),
    name: normalizedUser.name,
    email: normalizedUser.email,
    role: "Member",
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeUsers(users);

  return sanitizeUser(user);
}

async function authenticateUser(email, password) {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);
  const user = users.find((entry) => entry.email === normalizedEmail);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(String(password || ""), user.passwordHash);
  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  return sanitizeUser(user);
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

module.exports = {
  authenticateUser,
  createUser,
  findUserByEmail,
  findUserById
};
