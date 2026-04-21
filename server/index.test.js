const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");

let server;
let usersFile;

test.before(async () => {
  process.env.PORT = "3101";
  process.env.JWT_SECRET = "test-secret";
  usersFile = path.join(os.tmpdir(), `campus-ledger-users-${Date.now()}.json`);
  process.env.USERS_DATA_FILE = usersFile;
  await fs.writeFile(usersFile, "[]");
  server = require("./index");
  await new Promise((resolve) => server.on("listening", resolve));
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await fs.rm(usersFile, { force: true });
});

test("health endpoint returns service status", async () => {
  const response = await fetch("http://127.0.0.1:3101/api/health");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "campus-organization-ledger");
});

test("protected organizations endpoint rejects unauthenticated requests", async () => {
  const response = await fetch("http://127.0.0.1:3101/api/organizations");
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, "Authentication is required.");
});

test("signup creates an account and returns an auth token", async () => {
  const response = await fetch("http://127.0.0.1:3101/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Alex Johnson",
      email: "alex@school.edu",
      password: "prototype123"
    })
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(typeof body.token, "string");
  assert.equal(body.user.email, "alex@school.edu");
  assert.equal(body.user.role, "Member");
});

test("check-account detects when an email is already registered", async () => {
  const response = await fetch("http://127.0.0.1:3101/api/auth/check-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "alex@school.edu"
    })
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.exists, true);
  assert.equal(body.user.email, "alex@school.edu");
});

test("login returns a token that can access protected organization data", async () => {
  const loginResponse = await fetch("http://127.0.0.1:3101/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "alex@school.edu",
      password: "prototype123"
    })
  });
  const loginBody = await loginResponse.json();

  assert.equal(loginResponse.status, 200);
  assert.equal(loginBody.user.name, "Alex Johnson");

  const organizationsResponse = await fetch("http://127.0.0.1:3101/api/organizations", {
    headers: {
      Authorization: `Bearer ${loginBody.token}`
    }
  });
  const organizationsBody = await organizationsResponse.json();

  assert.equal(organizationsResponse.status, 200);
  assert.ok(Array.isArray(organizationsBody));
  assert.ok(organizationsBody.length >= 3);
  assert.equal(organizationsBody[0].summary.organizationId, organizationsBody[0].id);
  assert.equal(typeof organizationsBody[0].summary.currentBalance, "number");
});
