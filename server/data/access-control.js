const { getFirestore } = require("./firebase");

function getAccessRolesCollectionName() {
  return process.env.FIREBASE_ACCESS_ROLES_COLLECTION || "access_roles";
}

function getAccessAssignmentsCollectionName() {
  return process.env.FIREBASE_ACCESS_ASSIGNMENTS_COLLECTION || "access_assignments";
}

function buildDefaultRoleTemplates() {
  return [
    {
      id: "member",
      label: "Member",
      description: "Regular members can see balances, announcements, messages, and who is currently active in the organization.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "messages.view",
        "messages.reply",
        "announcements.view",
        "announcements.reply",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "home"
    },
    {
      id: "officer",
      label: "Officer",
      description:
        "Officers can submit funding or withdrawal requests, which remain pending until approved by leadership.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "transactions.view",
        "transactions.create",
        "messages.view",
        "messages.reply",
        "announcements.view",
        "announcements.reply",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "history"
    },
    {
      id: "sponsor",
      label: "Sponsor",
      description: "Sponsors have full oversight and approval access across the organization.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "transactions.view",
        "transactions.create",
        "transactions.approve",
        "announcements.view",
        "announcements.reply",
        "announcements.publish",
        "messages.view",
        "messages.reply",
        "accounts.view",
        "accounts.manage_roles",
        "settings.view",
        "settings.manage",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "home"
    },
    {
      id: "treasurer",
      label: "Treasurer",
      description: "Treasurers have full finance and management access.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "transactions.view",
        "transactions.create",
        "transactions.approve",
        "announcements.view",
        "announcements.reply",
        "announcements.publish",
        "messages.view",
        "messages.reply",
        "accounts.view",
        "accounts.manage_roles",
        "settings.view",
        "settings.manage",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "home"
    },
    {
      id: "president",
      label: "President",
      description: "Presidents have full access to oversight, approvals, and member management.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "transactions.view",
        "transactions.create",
        "transactions.approve",
        "announcements.view",
        "announcements.reply",
        "announcements.publish",
        "messages.view",
        "messages.reply",
        "accounts.view",
        "accounts.manage_roles",
        "settings.view",
        "settings.manage",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "home"
    },
    {
      id: "admin",
      label: "Admin",
      description: "Administrative access for account roles, announcements, and organization-wide controls.",
      permissions: [
        "dashboard.view",
        "organizations.view",
        "balance.view",
        "members.view",
        "transactions.view",
        "transactions.create",
        "transactions.approve",
        "messages.view",
        "messages.reply",
        "announcements.view",
        "announcements.reply",
        "announcements.publish",
        "accounts.view",
        "accounts.manage_roles",
        "settings.view",
        "settings.manage",
        "help.view",
        "profile.view"
      ],
      defaultLandingPage: "home"
    }
  ];
}

function buildSeedAssignments() {
  const adminIds = String(process.env.ADMIN_ACCOUNT_IDS || "")
    .split(",")
    .map((value) => value.trim().toUpperCase())
    .filter(Boolean);

  return adminIds.map((accountId) => ({
    accountId,
    roleIds: ["admin"],
    scope: {
      level: "global",
      organizationIds: []
    },
    notes: "Seeded from ADMIN_ACCOUNT_IDS. Update this document in Firestore as your admin list changes.",
    grantedPermissions: [],
    deniedPermissions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
}

function normalizeRoleId(roleId) {
  return String(roleId || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function normalizePermissionList(permissions) {
  return Array.isArray(permissions)
    ? permissions.map((permission) => String(permission).trim()).filter(Boolean)
    : [];
}

function getDefaultScope() {
  return {
    level: "global",
    organizationIds: []
  };
}

function normalizeScope(scope) {
  const scopeLevel = scope?.level === "organization" ? "organization" : "global";

  return {
    level: scopeLevel,
    organizationIds:
      scopeLevel === "organization" && Array.isArray(scope?.organizationIds)
        ? scope.organizationIds.map((organizationId) => String(organizationId).trim()).filter(Boolean)
        : []
  };
}

function buildRoleTemplateMap(roleTemplates) {
  return new Map(
    roleTemplates.map((roleTemplate) => [
      normalizeRoleId(roleTemplate.id),
      {
        ...roleTemplate,
        id: normalizeRoleId(roleTemplate.id),
        permissions: normalizePermissionList(roleTemplate.permissions)
      }
    ])
  );
}

async function readRoleTemplates() {
  const firestore = getFirestore();

  if (!firestore) {
    return buildDefaultRoleTemplates();
  }

  const snapshot = await firestore.collection(getAccessRolesCollectionName()).get();

  if (snapshot.empty) {
    return buildDefaultRoleTemplates();
  }

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data()
  }));
}

async function readAccessAssignment(accountId) {
  const firestore = getFirestore();

  if (!firestore || !accountId) {
    return null;
  }

  const document = await firestore
    .collection(getAccessAssignmentsCollectionName())
    .doc(String(accountId).trim().toUpperCase())
    .get();

  if (!document.exists) {
    return null;
  }

  return {
    accountId: document.id,
    ...document.data()
  };
}

async function readAllAccessAssignments() {
  const firestore = getFirestore();

  if (!firestore) {
    return [];
  }

  const snapshot = await firestore.collection(getAccessAssignmentsCollectionName()).get();

  return snapshot.docs.map((document) => ({
    accountId: document.id,
    ...document.data()
  }));
}

function getFallbackRoleId(user, roleTemplateMap) {
  const explicitRoleId = normalizeRoleId(user.role);

  if (roleTemplateMap.has(explicitRoleId)) {
    return explicitRoleId;
  }

  return roleTemplateMap.has("member") ? "member" : roleTemplateMap.keys().next().value;
}

async function resolveUserAccess(user) {
  const roleTemplates = await readRoleTemplates();
  const roleTemplateMap = buildRoleTemplateMap(roleTemplates);
  const fallbackRoleId = getFallbackRoleId(user, roleTemplateMap);
  const assignment = await readAccessAssignment(user.accountId);
  const assignedRoleIds = Array.isArray(assignment?.roleIds)
    ? assignment.roleIds.map(normalizeRoleId).filter(Boolean)
    : [];
  const roleIds = assignedRoleIds.length ? assignedRoleIds : [fallbackRoleId];
  const grantedPermissions = normalizePermissionList(assignment?.grantedPermissions);
  const deniedPermissions = new Set(normalizePermissionList(assignment?.deniedPermissions));
  const mergedPermissions = new Set();

  roleIds.forEach((roleId) => {
    const roleTemplate = roleTemplateMap.get(roleId);

    if (!roleTemplate) {
      return;
    }

    roleTemplate.permissions.forEach((permission) => {
      if (!deniedPermissions.has(permission)) {
        mergedPermissions.add(permission);
      }
    });
  });

  grantedPermissions.forEach((permission) => {
    if (!deniedPermissions.has(permission)) {
      mergedPermissions.add(permission);
    }
  });

  const primaryRoleTemplate = roleTemplateMap.get(roleIds[0]) || roleTemplateMap.get(fallbackRoleId);
  const scope = normalizeScope(assignment?.scope || getDefaultScope());

  return {
    role: primaryRoleTemplate?.label || user.role || "Member",
    roleIds,
    permissions: Array.from(mergedPermissions).sort(),
    scope,
    defaultLandingPage: primaryRoleTemplate?.defaultLandingPage || "home"
  };
}

function hasPermission(user, permission) {
  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
}

function canAccessOrganization(user, organizationId) {
  const scope = user?.scope || getDefaultScope();

  if (scope.level !== "organization") {
    return true;
  }

  return scope.organizationIds.includes(organizationId);
}

function filterOrganizationsForUser(organizations, user) {
  return organizations.filter((organization) => canAccessOrganization(user, organization.id));
}

async function saveAccessAssignment(accountId, input) {
  const firestore = getFirestore();

  if (!firestore) {
    throw new Error("Firebase must be configured before managing access assignments.");
  }

  const normalizedAccountId = String(accountId || "").trim().toUpperCase();
  const roleIds = Array.isArray(input?.roleIds)
    ? input.roleIds.map(normalizeRoleId).filter(Boolean)
    : [];

  if (!normalizedAccountId) {
    throw new Error("Account ID is required.");
  }

  if (!roleIds.length) {
    throw new Error("At least one role must be assigned.");
  }

  const roleTemplateMap = buildRoleTemplateMap(await readRoleTemplates());

  roleIds.forEach((roleId) => {
    if (!roleTemplateMap.has(roleId)) {
      throw new Error(`Unknown role: ${roleId}`);
    }
  });

  const assignment = {
    accountId: normalizedAccountId,
    roleIds,
    scope: normalizeScope(input?.scope),
    notes: String(input?.notes || "").trim(),
    grantedPermissions: normalizePermissionList(input?.grantedPermissions),
    deniedPermissions: normalizePermissionList(input?.deniedPermissions),
    createdAt: input?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await firestore
    .collection(getAccessAssignmentsCollectionName())
    .doc(normalizedAccountId)
    .set(assignment, { merge: true });

  return assignment;
}

async function seedAccessControl() {
  const firestore = getFirestore();

  if (!firestore) {
    throw new Error("Firebase must be configured before seeding access control.");
  }

  const roleTemplates = buildDefaultRoleTemplates();
  const assignments = buildSeedAssignments();
  const roleCollection = firestore.collection(getAccessRolesCollectionName());
  const assignmentCollection = firestore.collection(getAccessAssignmentsCollectionName());
  const batch = firestore.batch();
  const existingRoles = await roleCollection.get();

  existingRoles.docs.forEach((document) => {
    if (!roleTemplates.find((role) => role.id === document.id)) {
      batch.delete(document.ref);
    }
  });

  roleTemplates.forEach((role) => {
    batch.set(roleCollection.doc(role.id), role, { merge: true });
  });

  assignments.forEach((assignment) => {
    batch.set(assignmentCollection.doc(assignment.accountId), assignment, { merge: true });
  });

  batch.set(
    firestore.collection("system").doc("access_control"),
    {
      description:
        "Role templates live in access_roles. K-number assignment documents live in access_assignments and are keyed by accountId.",
      editableFields: [
        "roleIds",
        "scope.level",
        "scope.organizationIds",
        "grantedPermissions",
        "deniedPermissions",
        "notes"
      ],
      examples: {
        accountId: "K00123456",
        roleIds: ["admin"],
        scope: {
          level: "organization",
          organizationIds: ["cs-club"]
        },
        grantedPermissions: ["reports.export"],
        deniedPermissions: ["transactions.approve"]
      },
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  await batch.commit();

  return {
    roleCount: roleTemplates.length,
    assignmentCount: assignments.length
  };
}

module.exports = {
  buildDefaultRoleTemplates,
  buildSeedAssignments,
  canAccessOrganization,
  filterOrganizationsForUser,
  getAccessAssignmentsCollectionName,
  getAccessRolesCollectionName,
  hasPermission,
  readAllAccessAssignments,
  readAccessAssignment,
  readRoleTemplates,
  resolveUserAccess,
  saveAccessAssignment,
  seedAccessControl
};
