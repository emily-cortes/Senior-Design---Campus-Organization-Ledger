require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  authenticateUser,
  createUser,
  findUserByIdentifier
} = require("./data/auth-store");
const { createAuthToken, requireAuth } = require("./auth");
const {
  addTransaction,
  getOrganizationById,
  getOrganizationsWithSummaries,
  getTransactionsForOrganization
} = require("./data/store");

const app = express();
const publicDirectory = path.join(__dirname, "public");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(publicDirectory));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "campus-organization-ledger",
    checkedAt: new Date().toISOString()
  });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const user = await createUser(req.body);
    const token = createAuthToken(user);

    return res.status(201).json({
      token,
      user
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await authenticateUser(req.body.identifier || req.body.email, req.body.password);
    const token = createAuthToken(user);

    return res.json({
      token,
      user
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

app.post("/api/auth/check-account", async (req, res) => {
  const user = await findUserByIdentifier(
    req.body.identifier || req.body.email || req.body.accountId
  );

  return res.json({
    exists: Boolean(user),
    user
  });
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

app.get("/api/organizations", requireAuth, async (req, res) => {
  const organizations = await getOrganizationsWithSummaries();
  res.json(organizations);
});

app.get("/api/organizations/:organizationId", requireAuth, async (req, res) => {
  const organization = await getOrganizationById(req.params.organizationId);

  if (!organization) {
    return res.status(404).json({ error: "Organization not found." });
  }

  return res.json(organization);
});

app.get("/api/organizations/:organizationId/transactions", requireAuth, async (req, res) => {
  const organization = await getOrganizationById(req.params.organizationId);

  if (!organization) {
    return res.status(404).json({ error: "Organization not found." });
  }

  const transactions = await getTransactionsForOrganization(req.params.organizationId);
  return res.json(transactions);
});

app.post("/api/organizations/:organizationId/transactions", requireAuth, async (req, res) => {
  try {
    await addTransaction(req.params.organizationId, req.body);
    const organization = await getOrganizationById(req.params.organizationId);
    const transactions = await getTransactionsForOrganization(req.params.organizationId);

    return res.status(201).json({
      organization,
      transactions
    });
  } catch (error) {
    const statusCode = error.message === "Organization not found." ? 404 : 400;
    return res.status(statusCode).json({ error: error.message });
  }
});

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(publicDirectory, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
