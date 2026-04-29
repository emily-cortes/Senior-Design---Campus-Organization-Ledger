require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const {
  authenticateUser,
  createUser,
  findUserByIdentifier,
  listUsers
} = require("./data/auth-store");
const { buildAuthenticatedUser, createAuthToken, requireAuth, requirePermission } = require("./auth");
const {
  canAccessOrganization,
  filterOrganizationsForUser,
  readAllAccessAssignments,
  readRoleTemplates,
  resolveUserAccess,
  saveAccessAssignment
} = require("./data/access-control");
const {
  addTransaction,
  getOrganizationById,
  getOrganizationsWithSummaries,
  getTransactionsForOrganization,
  updateTransactionStatus
} = require("./data/store");

const app = express();
const publicDirectory = path.join(__dirname, "public");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(
  express.static(publicDirectory, {
    setHeaders: (res, filePath) => {
      if (/\.(html|css|js)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    }
  })
);

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
    const authenticatedUser = await buildAuthenticatedUser(user);
    const token = createAuthToken(authenticatedUser);

    return res.status(201).json({
      token,
      user: authenticatedUser
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const user = await authenticateUser(req.body.identifier || req.body.email, req.body.password);
    const authenticatedUser = await buildAuthenticatedUser(user);
    const token = createAuthToken(authenticatedUser);

    return res.json({
      token,
      user: authenticatedUser
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

app.get("/api/access/roles", requireAuth, requirePermission("accounts.view"), async (req, res) => {
  const roles = await readRoleTemplates();
  return res.json(roles);
});

app.get("/api/access/users", requireAuth, requirePermission("accounts.view"), async (req, res) => {
  const [users, assignments] = await Promise.all([listUsers(), readAllAccessAssignments()]);
  const assignmentMap = new Map(assignments.map((assignment) => [assignment.accountId, assignment]));
  const usersWithAccess = await Promise.all(
    users.map(async (user) => ({
      ...user,
      assignment: assignmentMap.get(user.accountId) || null,
      access: await resolveUserAccess(user)
    }))
  );

  return res.json(usersWithAccess);
});

app.put(
  "/api/access/users/:accountId/assignment",
  requireAuth,
  requirePermission("accounts.manage_roles"),
  async (req, res) => {
    try {
      const assignment = await saveAccessAssignment(req.params.accountId, req.body);
      const user = await findUserByIdentifier(req.params.accountId);

      return res.json({
        assignment,
        user: user ? await buildAuthenticatedUser(user) : null
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

app.get("/api/organizations", requireAuth, requirePermission("organizations.view"), async (req, res) => {
  const organizations = await getOrganizationsWithSummaries();
  res.json(filterOrganizationsForUser(organizations, req.user));
});

app.get(
  "/api/organizations/:organizationId",
  requireAuth,
  requirePermission("organizations.view"),
  async (req, res) => {
  const organization = await getOrganizationById(req.params.organizationId);

  if (!organization) {
    return res.status(404).json({ error: "Organization not found." });
  }

    if (!canAccessOrganization(req.user, organization.id)) {
      return res.status(403).json({ error: "You do not have access to that organization." });
    }

    return res.json(organization);
  }
);

app.get(
  "/api/organizations/:organizationId/transactions",
  requireAuth,
  requirePermission("transactions.view"),
  async (req, res) => {
  const organization = await getOrganizationById(req.params.organizationId);

  if (!organization) {
    return res.status(404).json({ error: "Organization not found." });
  }

    if (!canAccessOrganization(req.user, organization.id)) {
      return res.status(403).json({ error: "You do not have access to that organization." });
    }

    const transactions = await getTransactionsForOrganization(req.params.organizationId);
    return res.json(transactions);
  }
);

app.post(
  "/api/organizations/:organizationId/transactions",
  requireAuth,
  requirePermission("transactions.create"),
  async (req, res) => {
    try {
      const organization = await getOrganizationById(req.params.organizationId);

      if (!organization) {
        return res.status(404).json({ error: "Organization not found." });
      }

      if (!canAccessOrganization(req.user, organization.id)) {
        return res.status(403).json({ error: "You do not have access to that organization." });
      }

      const requestedStatus = req.body.status === "approved" ? "approved" : "pending";
      const shouldForcePending = !req.user.permissions.includes("transactions.approve");
      const transactionPayload = {
        ...req.body,
        status: shouldForcePending ? "pending" : requestedStatus,
        submittedBy: shouldForcePending ? req.user.name : req.body.submittedBy || req.user.name,
        approvedBy: shouldForcePending || requestedStatus !== "approved" ? "" : req.user.name,
        approvedAt:
          shouldForcePending || requestedStatus !== "approved" ? "" : new Date().toISOString()
      };

      await addTransaction(req.params.organizationId, transactionPayload);
      const updatedOrganization = await getOrganizationById(req.params.organizationId);
      const transactions = await getTransactionsForOrganization(req.params.organizationId);

      return res.status(201).json({
        organization: updatedOrganization,
        transactions
      });
    } catch (error) {
      const statusCode = error.message === "Organization not found." ? 404 : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }
);

app.patch(
  "/api/organizations/:organizationId/transactions/:transactionId/status",
  requireAuth,
  requirePermission("transactions.approve"),
  async (req, res) => {
    try {
      const organization = await getOrganizationById(req.params.organizationId);

      if (!organization) {
        return res.status(404).json({ error: "Organization not found." });
      }

      if (!canAccessOrganization(req.user, organization.id)) {
        return res.status(403).json({ error: "You do not have access to that organization." });
      }

      await updateTransactionStatus(req.params.organizationId, req.params.transactionId, {
        status: req.body.status,
        approvedBy: req.user.name
      });

      const updatedOrganization = await getOrganizationById(req.params.organizationId);
      const transactions = await getTransactionsForOrganization(req.params.organizationId);

      return res.json({
        organization: updatedOrganization,
        transactions
      });
    } catch (error) {
      const statusCode =
        error.message === "Organization not found." || error.message === "Transaction not found."
          ? 404
          : 400;
      return res.status(statusCode).json({ error: error.message });
    }
  }
);

app.get("/{*path}", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(publicDirectory, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
