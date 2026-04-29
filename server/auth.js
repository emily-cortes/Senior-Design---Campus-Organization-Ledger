const jwt = require("jsonwebtoken");
const { findUserById } = require("./data/auth-store");
const { hasPermission, resolveUserAccess } = require("./data/access-control");

function getJwtSecret() {
  return process.env.JWT_SECRET || "campus-ledger-prototype-secret";
}

function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    getJwtSecret(),
    { expiresIn: "12h" }
  );
}

async function buildAuthenticatedUser(user) {
  const accessProfile = await resolveUserAccess(user);

  return {
    ...user,
    ...accessProfile
  };
}

function getBearerToken(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length);
}

async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: "Authentication is required." });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const user = await findUserById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: "Your session is no longer valid." });
    }

    req.user = await buildAuthenticatedUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication is required." });
  }
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({ error: "You do not have permission to perform this action." });
    }

    return next();
  };
}

module.exports = {
  buildAuthenticatedUser,
  createAuthToken,
  requireAuth,
  requirePermission
};
