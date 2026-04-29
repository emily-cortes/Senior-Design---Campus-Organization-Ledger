const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const TOKEN_KEY = "campus-ledger-token";
const ACCOUNT_ID_PATTERN = /^K00\d{6}$/;
const TRANSACTIONS_PAGE_SIZE = 10;
const PAGE_PERMISSIONS = {
  home: "dashboard.view",
  transactions: "transactions.view",
  members: "transactions.approve",
  messages: "messages.view",
  announcements: "announcements.view",
  access: "accounts.view"
};

const dashboardExtras = {
  "cs-club": {
    members: [
      { id: "cs-1", name: "Example Name 1", status: "Online", role: "Treasurer" },
      { id: "cs-2", name: "Example Name 2", status: "Online", role: "President" },
      { id: "cs-3", name: "Example Name 3", status: "Offline", role: "Secretary" },
      { id: "cs-4", name: "Example Name 4", status: "Offline", role: "Event Lead" }
    ],
    announcements: [
      {
        id: "cs-ann-1",
        author: "Dean Rochelle Price",
        date: "2026-04-19",
        message: "End-of-semester funding requests should be submitted by Friday for advisor review.",
        replies: []
      },
      {
        id: "cs-ann-2",
        author: "Campus Finance Office",
        date: "2026-04-14",
        message: "Please attach receipts for all travel-related reimbursements before final approval.",
        replies: []
      }
    ],
    messageThreads: [
      {
        id: "cs-thread-1",
        subject: "Hack night budget follow-up",
        status: "Unread",
        sender: "Advisor",
        updatedAt: "2026-04-20T10:15:00.000Z",
        preview: "Can you confirm the final food expense before we close out the event?",
        messages: [
          {
            id: "cs-thread-1-msg-1",
            author: "Dr. Alicia Gomez",
            role: "Advisor",
            sentAt: "2026-04-20T09:50:00.000Z",
            text: "Can you confirm the final food expense before we close out the event?",
            reactions: { like: 1, support: 0, celebrate: 0 }
          },
          {
            id: "cs-thread-1-msg-2",
            author: "Nina Patel",
            role: "Treasurer",
            sentAt: "2026-04-20T10:03:00.000Z",
            text: "Yes, I uploaded the receipt and the total came out to $240.",
            reactions: { like: 2, support: 1, celebrate: 0 }
          }
        ]
      },
      {
        id: "cs-thread-2",
        subject: "Receipt upload reminder",
        status: "Unread",
        sender: "Finance Office",
        updatedAt: "2026-04-18T14:00:00.000Z",
        preview: "Please upload sponsorship documentation for the cloud credits entry.",
        messages: [
          {
            id: "cs-thread-2-msg-1",
            author: "Finance Office",
            role: "Admin",
            sentAt: "2026-04-18T14:00:00.000Z",
            text: "Please upload sponsorship documentation for the cloud credits entry.",
            reactions: { like: 0, support: 1, celebrate: 0 }
          }
        ]
      },
      {
        id: "cs-thread-3",
        subject: "Meeting notes posted",
        status: "Read",
        sender: "Secretary",
        updatedAt: "2026-04-17T18:40:00.000Z",
        preview: "The full notes from this week’s planning meeting are now available.",
        messages: [
          {
            id: "cs-thread-3-msg-1",
            author: "Maya Chen",
            role: "Secretary",
            sentAt: "2026-04-17T18:40:00.000Z",
            text: "The full notes from this week’s planning meeting are now available.",
            reactions: { like: 3, support: 0, celebrate: 1 }
          }
        ]
      }
    ]
  },
  "robotics-team": {
    members: [
      { id: "robo-1", name: "Example Name 5", status: "Online", role: "Treasurer" },
      { id: "robo-2", name: "Example Name 6", status: "Online", role: "Build Lead" },
      { id: "robo-3", name: "Example Name 7", status: "Offline", role: "Programming Lead" },
      { id: "robo-4", name: "Example Name 8", status: "Offline", role: "Driver" }
    ],
    announcements: [
      {
        id: "robo-ann-1",
        author: "Competition Coordinator",
        date: "2026-04-18",
        message: "Travel reimbursements for the regional trip should be filed within five business days.",
        replies: []
      },
      {
        id: "robo-ann-2",
        author: "Campus Finance Office",
        date: "2026-04-09",
        message: "Equipment purchases over $500 should include a short justification note in the ledger.",
        replies: []
      }
    ],
    messageThreads: [
      {
        id: "robo-thread-1",
        subject: "Regional travel invoice",
        status: "Unread",
        sender: "Advisor",
        updatedAt: "2026-04-19T12:00:00.000Z",
        preview: "The hotel invoice needs one more confirmation before reimbursement.",
        messages: [
          {
            id: "robo-thread-1-msg-1",
            author: "Prof. Marcus Hill",
            role: "Advisor",
            sentAt: "2026-04-19T12:00:00.000Z",
            text: "The hotel invoice needs one more confirmation before reimbursement.",
            reactions: { like: 1, support: 0, celebrate: 0 }
          }
        ]
      },
      {
        id: "robo-thread-2",
        subject: "Parts reimbursement question",
        status: "Unread",
        sender: "Member",
        updatedAt: "2026-04-17T16:30:00.000Z",
        preview: "Should the replacement sensor package come from competition or equipment funds?",
        messages: [
          {
            id: "robo-thread-2-msg-1",
            author: "Amari Scott",
            role: "Build Lead",
            sentAt: "2026-04-17T16:30:00.000Z",
            text: "Should the replacement sensor package come from competition or equipment funds?",
            reactions: { like: 0, support: 2, celebrate: 0 }
          }
        ]
      }
    ]
  },
  "student-senate": {
    members: [
      { id: "sen-1", name: "Example Name 9", status: "Online", role: "Treasurer" },
      { id: "sen-2", name: "Example Name 10", status: "Online", role: "President" },
      { id: "sen-3", name: "Example Name 11", status: "Offline", role: "Committee Chair" },
      { id: "sen-4", name: "Example Name 12", status: "Offline", role: "Secretary" }
    ],
    announcements: [
      {
        id: "sen-ann-1",
        author: "Dean Rochelle Price",
        date: "2026-04-20",
        message: "Leadership retreat requests will need a final participant count before approval.",
        replies: []
      },
      {
        id: "sen-ann-2",
        author: "Student Affairs",
        date: "2026-04-12",
        message: "Please keep town hall and programming spending categorized separately for reporting.",
        replies: []
      }
    ],
    messageThreads: [
      {
        id: "sen-thread-1",
        subject: "Town hall expenses review",
        status: "Unread",
        sender: "Advisor",
        updatedAt: "2026-04-20T08:50:00.000Z",
        preview: "Please confirm the signage total before we finalize reimbursement.",
        messages: [
          {
            id: "sen-thread-1-msg-1",
            author: "Dean Rochelle Price",
            role: "Advisor",
            sentAt: "2026-04-20T08:50:00.000Z",
            text: "Please confirm the signage total before we finalize reimbursement.",
            reactions: { like: 0, support: 1, celebrate: 0 }
          }
        ]
      },
      {
        id: "sen-thread-2",
        subject: "Budget presentation reminder",
        status: "Read",
        sender: "President",
        updatedAt: "2026-04-16T15:20:00.000Z",
        preview: "We should review the semester allocation before next week’s meeting.",
        messages: [
          {
            id: "sen-thread-2-msg-1",
            author: "Liam Harris",
            role: "President",
            sentAt: "2026-04-16T15:20:00.000Z",
            text: "We should review the semester allocation before next week’s meeting.",
            reactions: { like: 2, support: 0, celebrate: 0 }
          }
        ]
      }
    ]
  }
};

const state = {
  organizations: [],
  currentTransactions: [],
  accessRoles: [],
  accessUsers: [],
  selectedOrganizationId: null,
  activeUser: null,
  authToken: null,
  sidebarOpen: false,
  activeSidebarPanel: "announcements",
  membersExpanded: true,
  messagesExpanded: true,
  currentDashboardPage: "home",
  selectedThreadId: null,
  currentTransactionsPage: 1,
  expandedTransactionIds: []
};

const elements = {
  homeView: document.querySelector("#home-view"),
  authView: document.querySelector("#auth-view"),
  dashboardView: document.querySelector("#dashboard-view"),
  homeReadyButton: document.querySelector("#home-ready-button"),
  backHomeButton: document.querySelector("#back-home-button"),
  showSigninButton: document.querySelector("#show-signin-button"),
  showSignupButton: document.querySelector("#show-signup-button"),
  signinPanel: document.querySelector("#signin-panel"),
  signupPanel: document.querySelector("#signup-panel"),
  loginForm: document.querySelector("#login-form"),
  signupForm: document.querySelector("#signup-form"),
  loginIdentifier: document.querySelector("#login-identifier"),
  signupEmail: document.querySelector("#signup-email"),
  signupAccountId: document.querySelector("#signup-account-id"),
  loginMessage: document.querySelector("#login-message"),
  signupMessage: document.querySelector("#signup-message"),
  sidebarOverlay: document.querySelector("#sidebar-overlay"),
  dashboardSidebar: document.querySelector("#dashboard-sidebar"),
  sidebarToggleButton: document.querySelector("#sidebar-toggle-button"),
  sidebarCloseButton: document.querySelector("#sidebar-close-button"),
  sidebarLinks: Array.from(document.querySelectorAll(".sidebar-link")),
  sidebarUserName: document.querySelector("#sidebar-user-name"),
  sidebarUserRole: document.querySelector("#sidebar-user-role"),
  accountName: document.querySelector("#account-name"),
  accountEmail: document.querySelector("#account-email"),
  accountId: document.querySelector("#account-id"),
  accountRole: document.querySelector("#account-role"),
  sidebarAnnouncementsList: document.querySelector("#sidebar-announcements-list"),
  logoutButton: document.querySelector("#logout-button"),
  organizationName: document.querySelector("#organization-name"),
  organizationMeta: document.querySelector("#organization-meta"),
  organizationSelectField: document.querySelector(".organization-select-field"),
  organizationSelect: document.querySelector("#organization-select"),
  currentBalance: document.querySelector("#current-balance"),
  approvedIncome: document.querySelector("#approved-income"),
  approvedExpenses: document.querySelector("#approved-expenses"),
  pendingExpenses: document.querySelector("#pending-expenses"),
  projectedBalance: document.querySelector("#projected-balance"),
  balanceCard: document.querySelector("#balance-card"),
  transactionsBody: document.querySelector("#transactions-body"),
  historyPageBody: document.querySelector("#history-page-body"),
  transactionsPageCount: document.querySelector("#transactions-page-count"),
  transactionsPagePrev: document.querySelector("#transactions-page-prev"),
  transactionsPageNext: document.querySelector("#transactions-page-next"),
  announcementsFeed: document.querySelector("#announcements-feed"),
  announcementsPageFeed: document.querySelector("#announcements-page-feed"),
  membersList: document.querySelector("#members-list"),
  membersPageList: document.querySelector("#members-page-list"),
  membersPageMessage: document.querySelector("#members-page-message"),
  messagesList: document.querySelector("#messages-list"),
  messagesPageList: document.querySelector("#messages-page-list"),
  membersToggle: document.querySelector("#members-toggle"),
  messagesToggle: document.querySelector("#messages-toggle"),
  membersContent: document.querySelector("#members-content"),
  messagesContent: document.querySelector("#messages-content"),
  membersChevron: document.querySelector("#members-chevron"),
  messagesChevron: document.querySelector("#messages-chevron"),
  navPills: Array.from(document.querySelectorAll(".nav-pill")),
  historyNavLabel: document.querySelector("#history-nav-label"),
  dashboardPages: Array.from(document.querySelectorAll(".dashboard-page")),
  membersCard: document.querySelector("#members-card"),
  messagesCard: document.querySelector("#messages-card"),
  announcementsCard: document.querySelector("#announcements-card"),
  entryCard: document.querySelector("#entry-card"),
  historyCard: document.querySelector("#history-card"),
  historyCardTitle: document.querySelector("#history-card-title"),
  historyPageTitle: document.querySelector("#history-page-title"),
  historyPageSubtitle: document.querySelector("#history-page-subtitle"),
  openHistoryPageButton: document.querySelector("#open-history-page-button"),
  messageThreadSubject: document.querySelector("#message-thread-subject"),
  messageThreadMeta: document.querySelector("#message-thread-meta"),
  messageThreadBody: document.querySelector("#message-thread-body"),
  messageReplyForm: document.querySelector("#message-reply-form"),
  messageReplyInput: document.querySelector("#message-reply-input"),
  messageReplySubmitButton: document.querySelector("#message-reply-form button[type='submit']"),
  messageThreadFeedback: document.querySelector("#message-thread-feedback"),
  transactionForm: document.querySelector("#transaction-form"),
  transactionPermissionNote: document.querySelector("#transaction-permission-note"),
  formMessage: document.querySelector("#form-message"),
  accessRolesList: document.querySelector("#access-roles-list"),
  accessUsersList: document.querySelector("#access-users-list"),
  accessMessage: document.querySelector("#access-message")
};

function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function hasPermission(permission) {
  return Array.isArray(state.activeUser?.permissions) && state.activeUser.permissions.includes(permission);
}

function normalizeDashboardPageName(pageName) {
  return pageName === "history" ? "transactions" : pageName;
}

function getPrimaryRoleId() {
  return state.activeUser?.roleIds?.[0] || String(state.activeUser?.role || "").toLowerCase();
}

function isLeadershipRole() {
  return ["sponsor", "treasurer", "president", "admin"].includes(getPrimaryRoleId());
}

function isOfficerRole() {
  return getPrimaryRoleId() === "officer";
}

function isMemberRole() {
  return getPrimaryRoleId() === "member";
}

function canAccessDashboardPage(pageName) {
  const normalizedPageName = normalizeDashboardPageName(pageName);

  if (isLeadershipRole()) {
    return true;
  }

  if (isOfficerRole()) {
    return ["home", "transactions", "messages", "announcements"].includes(normalizedPageName);
  }

  if (isMemberRole()) {
    return ["home", "messages", "announcements"].includes(normalizedPageName);
  }

  const requiredPermission = PAGE_PERMISSIONS[normalizedPageName];
  return !requiredPermission || hasPermission(requiredPermission);
}

function getAvailableDashboardPages() {
  return elements.navPills
    .map((pill) => normalizeDashboardPageName(pill.dataset.dashboardPage))
    .filter((pageName) => canAccessDashboardPage(pageName));
}

function getPreferredDashboardPage() {
  const preferredPage = normalizeDashboardPageName(state.activeUser?.defaultLandingPage || "home");

  if (canAccessDashboardPage(preferredPage)) {
    return preferredPage;
  }

  return getAvailableDashboardPages()[0] || "home";
}

function applyOrganizationScope(organizations) {
  const scope = state.activeUser?.scope;

  if (!scope || scope.level !== "organization") {
    return organizations;
  }

  return organizations.filter((organization) => scope.organizationIds.includes(organization.id));
}

function isValidAccountId(accountId) {
  return ACCOUNT_ID_PATTERN.test(String(accountId || "").trim().toUpperCase());
}

function normalizeAccountId(accountId) {
  return String(accountId || "").trim().toUpperCase();
}

function formatDisplayDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString();
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString();
}

function getSelectedOrganization() {
  return state.organizations.find(
    (organization) => organization.id === state.selectedOrganizationId
  );
}

function getDashboardExtras() {
  return (
    dashboardExtras[state.selectedOrganizationId] || {
      members: [],
      announcements: [],
      messageThreads: []
    }
  );
}

function getSelectedThread() {
  return getDashboardExtras().messageThreads.find(
    (thread) => thread.id === state.selectedThreadId
  );
}

function getVisibleTransactions() {
  if (!hasPermission("transactions.view")) {
    return [];
  }

  if (hasPermission("transactions.approve")) {
    return state.currentTransactions;
  }

  return state.currentTransactions.filter(
    (transaction) => transaction.submittedBy === state.activeUser?.name
  );
}

function isTransactionExpanded(transactionId) {
  return state.expandedTransactionIds.includes(transactionId);
}

function toggleTransactionExpanded(transactionId) {
  if (isTransactionExpanded(transactionId)) {
    state.expandedTransactionIds = state.expandedTransactionIds.filter((id) => id !== transactionId);
    return;
  }

  state.expandedTransactionIds = [...state.expandedTransactionIds, transactionId];
}

function resetTransactionsPageState() {
  state.currentTransactionsPage = 1;
  state.expandedTransactionIds = [];
}

function syncTransactionsPageState(transactions) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / TRANSACTIONS_PAGE_SIZE));
  state.currentTransactionsPage = Math.min(Math.max(state.currentTransactionsPage, 1), totalPages);
  state.expandedTransactionIds = state.expandedTransactionIds.filter((transactionId) =>
    transactions.some((transaction) => transaction.id === transactionId)
  );
}

function getTransactionAmountMarkup(transaction) {
  const amountClass = transaction.type === "income" ? "amount-income" : "amount-expense";
  return `<span class="${amountClass}">${formatCurrency(transaction.amount)}</span>`;
}

function getTransactionTypeLabel(transaction) {
  return transaction.type === "income" ? "Deposit" : "Withdrawal";
}

function ensureThreadInteractionState(threads) {
  threads.forEach((thread) => {
    thread.messages.forEach((message) => {
      const reactions = message.reactions || {};

      message.reactions = {
        up: reactions.up ?? reactions.like ?? 0,
        down: reactions.down ?? 0
      };
      message.userReaction = message.userReaction || null;
    });
  });
}

function ensureAnnouncementReplyState(announcements) {
  announcements.forEach((announcement) => {
    announcement.replies = Array.isArray(announcement.replies) ? announcement.replies : [];
    const reactions = announcement.reactions || {};

    announcement.reactions = {
      up: reactions.up ?? reactions.like ?? 0,
      down: reactions.down ?? 0
    };
    announcement.userReaction = announcement.userReaction || null;
  });
}

function setAuthToken(token) {
  state.authToken = token;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function clearAuthState() {
  state.activeUser = null;
  state.organizations = [];
  state.currentTransactions = [];
  state.selectedOrganizationId = null;
  state.selectedThreadId = null;
  resetTransactionsPageState();
  setAuthToken(null);
  closeSidebar();
}

function showView(viewName) {
  elements.homeView.classList.toggle("hidden", viewName !== "home");
  elements.authView.classList.toggle("hidden", viewName !== "auth");
  elements.dashboardView.classList.toggle("hidden", viewName !== "dashboard");
}

function showAuthMode(mode) {
  const showingSignin = mode === "signin";
  elements.signinPanel.classList.toggle("hidden", !showingSignin);
  elements.signupPanel.classList.toggle("hidden", showingSignin);
  elements.showSigninButton.classList.toggle("active", showingSignin);
  elements.showSignupButton.classList.toggle("active", !showingSignin);
}

function setMessage(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle("error", isError);
}

function moveToSigninWithIdentifier(identifier, message) {
  showView("auth");
  showAuthMode("signin");
  elements.loginForm.elements.identifier.value = identifier;
  setMessage(elements.loginMessage, message, true);
}

async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});

  if (state.authToken) {
    headers.set("Authorization", `Bearer ${state.authToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearAuthState();
    showView("auth");
    showAuthMode("signin");
    throw new Error("Your session expired. Please sign in again.");
  }

  return response;
}

async function checkAccountStatus(identifier) {
  const response = await fetch("/api/auth/check-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ identifier })
  });

  return response.json();
}

function renderActiveUser() {
  if (!state.activeUser) {
    return;
  }

  const roleLine = `${state.activeUser.role} • ${state.activeUser.email}`;

  elements.sidebarUserName.textContent = state.activeUser.name;
  elements.sidebarUserRole.textContent = roleLine;
  elements.accountName.textContent = state.activeUser.name;
  elements.accountEmail.textContent = state.activeUser.email;
  elements.accountId.textContent = state.activeUser.accountId;
  elements.accountRole.textContent = state.activeUser.role;
}

function buildMetaLine(organization) {
  return [
    organization.category,
    `Advisor: ${organization.advisor}`,
    `Treasurer: ${organization.treasurer}`,
    `Updated: ${new Date(organization.updatedAt).toLocaleString()}`
  ].join(" • ");
}

function renderOrganizations() {
  if (!state.organizations.length) {
    elements.organizationSelect.innerHTML = "";
    elements.organizationSelect.disabled = true;
    return;
  }

  elements.organizationSelect.innerHTML = state.organizations
    .map(
      (organization) =>
        `<option value="${organization.id}">${organization.name}</option>`
    )
    .join("");

  elements.organizationSelect.value = state.selectedOrganizationId;
  elements.organizationSelect.disabled = state.organizations.length <= 1;
}

function renderCompactHistory(transactions) {
  const recentTransactions = transactions.slice(0, 5);

  if (!recentTransactions.length) {
    elements.transactionsBody.innerHTML =
      '<tr><td colspan="4">No transactions have been recorded yet.</td></tr>';
    return;
  }

  elements.transactionsBody.innerHTML = recentTransactions
    .map((transaction) => {
      const deposit =
        transaction.type === "income"
          ? `<span class="amount-income">${formatCurrency(transaction.amount)}</span>`
          : "";
      const withdrawal =
        transaction.type === "expense"
          ? `<span class="amount-expense">${formatCurrency(transaction.amount)}</span>`
          : "";

      return `
        <tr>
          <td>${formatDisplayDate(transaction.date)}</td>
          <td>
            <strong>${transaction.description}</strong><br />
            <span class="subtle">${transaction.category} • ${transaction.status}</span>
          </td>
          <td>${deposit}</td>
          <td>${withdrawal}</td>
        </tr>
      `;
    })
    .join("");
}

function renderFullHistory(transactions) {
  syncTransactionsPageState(transactions);

  if (!transactions.length) {
    elements.transactionsPageCount.textContent = "Showing 0-0 of 0 transactions";
    elements.transactionsPagePrev.disabled = true;
    elements.transactionsPageNext.disabled = true;
    elements.historyPageBody.innerHTML =
      '<tr><td colspan="7">No transactions have been recorded yet.</td></tr>';
    return;
  }

  const startIndex = (state.currentTransactionsPage - 1) * TRANSACTIONS_PAGE_SIZE;
  const visibleTransactions = transactions.slice(
    startIndex,
    startIndex + TRANSACTIONS_PAGE_SIZE
  );
  const endIndex = startIndex + visibleTransactions.length;
  const totalPages = Math.max(1, Math.ceil(transactions.length / TRANSACTIONS_PAGE_SIZE));

  elements.transactionsPageCount.textContent = `Showing ${startIndex + 1}-${endIndex} of ${transactions.length} transactions`;
  elements.transactionsPagePrev.disabled = state.currentTransactionsPage === 1;
  elements.transactionsPageNext.disabled = state.currentTransactionsPage === totalPages;

  elements.historyPageBody.innerHTML = visibleTransactions
    .map((transaction) => {
      const showApproveAction =
        hasPermission("transactions.approve") && transaction.status === "pending";
      const expanded = isTransactionExpanded(transaction.id);
      const actionMarkup = showApproveAction
        ? `
          <button
            type="button"
            class="table-action-button"
            data-approve-transaction="true"
            data-transaction-id="${transaction.id}"
          >
            Approve
          </button>
        `
        : '<span class="subtle">-</span>';
      const detailLines = [
        `<strong>Category:</strong> ${transaction.category || "Not provided"}`,
        `<strong>Fund:</strong> ${transaction.fund || "Not provided"}`,
        `<strong>Submitted by:</strong> ${transaction.submittedBy || "Not provided"}`,
        `<strong>Approved by:</strong> ${transaction.approvedBy || "Pending approval"}`,
        `<strong>Recorded as:</strong> ${getTransactionTypeLabel(transaction)}`
      ];

      return `
        <tr>
          <td>
            <button
              type="button"
              class="table-expand-button"
              data-toggle-transaction-row="true"
              data-transaction-id="${transaction.id}"
              aria-label="${expanded ? "Collapse" : "Expand"} transaction details"
            >
              ${expanded ? "⌃" : "⌄"}
            </button>
          </td>
          <td>${formatDisplayDate(transaction.date)}</td>
          <td>
            <strong>${transaction.description}</strong><br />
            <span class="subtle">${transaction.category || "General"} • ${transaction.submittedBy || "No submitter listed"}</span>
          </td>
          <td>${getTransactionTypeLabel(transaction)}</td>
          <td>${transaction.status}</td>
          <td>${getTransactionAmountMarkup(transaction)}</td>
          <td class="table-action-cell">${actionMarkup}</td>
        </tr>
        ${
          expanded
            ? `
              <tr class="table-detail-row">
                <td colspan="7">
                  <div class="table-detail-card">
                    ${detailLines.map((line) => `<p>${line}</p>`).join("")}
                  </div>
                </td>
              </tr>
            `
            : ""
        }
      `;
    })
    .join("");
}

function buildAnnouncementCards(announcements) {
  ensureAnnouncementReplyState(announcements);

  return announcements
    .map(
      (announcement) => `
        <article class="announcement-card">
          <div class="announcement-title-row">
            <span class="announcement-author">${announcement.author}</span>
            <span class="announcement-date">${formatDisplayDate(announcement.date)}</span>
          </div>
          <p>${announcement.message}</p>
          <div class="reaction-row">
            <button
              type="button"
              class="reaction-button ${announcement.userReaction === "up" ? "reaction-button-active" : ""}"
              data-announcement-id="${announcement.id}"
              data-announcement-reaction="up"
            >
              👍 ${announcement.reactions.up || 0}
            </button>
            <button
              type="button"
              class="reaction-button ${announcement.userReaction === "down" ? "reaction-button-active reaction-button-negative" : "reaction-button-negative"}"
              data-announcement-id="${announcement.id}"
              data-announcement-reaction="down"
            >
              👎 ${announcement.reactions.down || 0}
            </button>
          </div>
          <div class="announcement-replies">
            ${
              announcement.replies.length
                ? announcement.replies
                    .map(
                      (reply) => `
                        <div class="announcement-reply">
                          <strong>${reply.author}</strong>
                          <span class="stack-item-meta">${formatDateTime(reply.sentAt)}</span>
                          <p>${reply.text}</p>
                        </div>
                      `
                    )
                    .join("")
                : '<p class="subtle">No replies yet.</p>'
            }
          </div>
          ${
            hasPermission("announcements.reply")
              ? `
                <form class="announcement-reply-form" data-announcement-form="true" data-announcement-id="${announcement.id}">
                  <label class="field">
                    <span>Reply to announcement</span>
                    <textarea name="replyText" rows="2" placeholder="Add an update or response" required></textarea>
                  </label>
                  <button type="submit" class="secondary-button">Post reply</button>
                </form>
              `
              : ""
          }
        </article>
      `
    )
    .join("");
}

function renderAnnouncements() {
  const announcements = getDashboardExtras().announcements;
  const markup = buildAnnouncementCards(announcements);
  const sidebarMarkup = announcements
    .map(
      (announcement) => `
        <article class="sidebar-announcement-card">
          <div class="announcement-title-row">
            <span class="announcement-author">${announcement.author}</span>
            <span class="announcement-date">${formatDisplayDate(announcement.date)}</span>
          </div>
          <p>${announcement.message}</p>
        </article>
      `
    )
    .join("");

  elements.announcementsFeed.innerHTML = markup || "<p>No announcements available.</p>";
  elements.announcementsPageFeed.innerHTML = markup || "<p>No announcements available.</p>";
  elements.sidebarAnnouncementsList.innerHTML = sidebarMarkup || "<p>No announcements available.</p>";
}

function buildMemberCards(members, detailed = false) {
  return members
    .map(
      (member) => `
        <article class="stack-item ${detailed ? "stack-item-detailed" : ""}">
          <span class="mini-avatar" aria-hidden="true"></span>
          <div>
            <strong>${member.name}</strong><br />
            <span class="stack-item-meta">${member.role}</span>
          </div>
          <span class="status-badge status-${member.status.toLowerCase()}">${member.status}</span>
        </article>
      `
    )
    .join("");
}

function buildManagedMemberCards() {
  if (!state.accessUsers.length) {
    return '<p class="subtle">No signed-in users are available yet.</p>';
  }

  const roleOptions = state.accessRoles
    .map(
      (role) => `
        <option value="${role.id}">${role.label}</option>
      `
    )
    .join("");

  return state.accessUsers
    .map((user) => {
      const currentRoleId = getAccessUserPrimaryRoleId(user);

      return `
        <article class="stack-item stack-item-managed">
          <span class="mini-avatar" aria-hidden="true"></span>
          <div>
            <strong>${user.name}</strong><br />
            <span class="stack-item-meta">${user.accountId} • ${user.email}</span>
          </div>
          <div class="member-role-editor">
            <label class="field member-role-field">
              <span>Role</span>
              <select
                data-role-assign-select="true"
                data-account-id="${user.accountId}"
                aria-label="Update role for ${user.name}"
              >
                ${roleOptions}
              </select>
            </label>
            <span class="status-badge">${user.access?.role || user.role}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderMembers() {
  const members = getDashboardExtras().members;
  const onlineMembers = members.filter((member) => member.status === "Online");
  elements.membersList.innerHTML = buildMemberCards((onlineMembers.length ? onlineMembers : members).slice(0, 4));

  if (hasPermission("accounts.manage_roles") && state.accessUsers.length) {
    elements.membersPageList.innerHTML = buildManagedMemberCards();
    elements.membersPageList
      .querySelectorAll("[data-role-assign-select='true']")
      .forEach((select) => {
        const accessUser = state.accessUsers.find(
          (entry) => entry.accountId === select.dataset.accountId
        );

        select.value = getAccessUserPrimaryRoleId(accessUser);
      });
    return;
  }

  setMessage(elements.membersPageMessage, "");
  elements.membersPageList.innerHTML = buildMemberCards(members, true);
}

function addAnnouncementReply(announcementId, replyText) {
  const announcement = getDashboardExtras().announcements.find((item) => item.id === announcementId);

  if (!announcement || !state.activeUser) {
    return;
  }

  ensureAnnouncementReplyState([announcement]);
  announcement.replies.unshift({
    id: `announcement-reply-${Date.now()}`,
    author: state.activeUser.name,
    sentAt: new Date().toISOString(),
    text: replyText
  });
}

function applyAnnouncementReaction(announcementId, reactionName) {
  const announcement = getDashboardExtras().announcements.find((item) => item.id === announcementId);

  if (!announcement) {
    return;
  }

  ensureAnnouncementReplyState([announcement]);

  if (announcement.userReaction === reactionName) {
    announcement.reactions[reactionName] = Math.max(
      0,
      (announcement.reactions[reactionName] || 0) - 1
    );
    announcement.userReaction = null;
  } else {
    if (announcement.userReaction) {
      const previousReaction = announcement.userReaction;
      announcement.reactions[previousReaction] = Math.max(
        0,
        (announcement.reactions[previousReaction] || 0) - 1
      );
    }

    announcement.reactions[reactionName] = (announcement.reactions[reactionName] || 0) + 1;
    announcement.userReaction = reactionName;
  }

  renderAnnouncements();
}

function buildThreadCards(threads, compact = false) {
  return threads
    .map(
      (thread) => `
        <button
          type="button"
          class="thread-card ${thread.status === "Read" ? "thread-card-read" : ""} ${state.selectedThreadId === thread.id ? "thread-card-active" : ""}"
          data-thread-id="${thread.id}"
          data-open-thread="true"
        >
          <div>
            <strong>${thread.subject}</strong><br />
            <span class="stack-item-meta">${thread.sender} • ${thread.preview}</span>
          </div>
          <span class="status-badge status-${thread.status.toLowerCase()}">${thread.status}</span>
        </button>
      `
    )
    .join("");
}

function renderMessages() {
  const threads = getDashboardExtras().messageThreads;
  ensureThreadInteractionState(threads);

  elements.messagesList.innerHTML = buildThreadCards(threads.slice(0, 3), true);
  elements.messagesPageList.innerHTML = buildThreadCards(threads);
  renderSelectedThread();
}

function renderSelectedThread() {
  const thread = getSelectedThread();

  if (!thread) {
    elements.messageThreadSubject.textContent = "Select a message";
    elements.messageThreadMeta.textContent = "Open a thread to view replies";
    elements.messageThreadBody.innerHTML = "<p class=\"subtle\">Choose a thread on the left to start reading or replying.</p>";
    return;
  }

  elements.messageThreadSubject.textContent = thread.subject;
  elements.messageThreadMeta.textContent = `${thread.sender} • Updated ${formatDateTime(
    thread.updatedAt
  )}`;

  elements.messageThreadBody.innerHTML = thread.messages
    .map(
      (message) => `
        <article class="thread-message">
          <div class="thread-message-header">
            <div>
              <strong>${message.author}</strong>
              <span class="stack-item-meta">${message.role}</span>
            </div>
            <span class="stack-item-meta">${formatDateTime(message.sentAt)}</span>
          </div>
          <p>${message.text}</p>
          <div class="reaction-row">
            <button
              type="button"
              class="reaction-button ${message.userReaction === "up" ? "reaction-button-active" : ""}"
              data-thread-id="${thread.id}"
              data-message-id="${message.id}"
              data-reaction="up"
            >
              👍 ${message.reactions.up || 0}
            </button>
            <button
              type="button"
              class="reaction-button ${message.userReaction === "down" ? "reaction-button-active reaction-button-negative" : "reaction-button-negative"}"
              data-thread-id="${thread.id}"
              data-message-id="${message.id}"
              data-reaction="down"
            >
              👎 ${message.reactions.down || 0}
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderSelectedOrganization() {
  const organization = getSelectedOrganization();

  if (!organization) {
    elements.organizationName.textContent = "No accessible organizations yet";
    elements.organizationMeta.textContent = "This account does not currently have an assigned organization scope.";
    elements.currentBalance.textContent = formatCurrency(0);
    elements.approvedIncome.textContent = formatCurrency(0);
    elements.approvedExpenses.textContent = formatCurrency(0);
    elements.pendingExpenses.textContent = formatCurrency(0);
    elements.projectedBalance.textContent = "Projected balance: $0.00";
    elements.transactionsBody.innerHTML =
      '<tr><td colspan="4">No organization data is available for this account.</td></tr>';
    elements.transactionsPageCount.textContent = "Showing 0-0 of 0 transactions";
    elements.transactionsPagePrev.disabled = true;
    elements.transactionsPageNext.disabled = true;
    elements.historyPageBody.innerHTML =
      '<tr><td colspan="7">No organization data is available for this account.</td></tr>';
    elements.announcementsFeed.innerHTML = "<p>No announcements available.</p>";
    elements.announcementsPageFeed.innerHTML = "<p>No announcements available.</p>";
    elements.sidebarAnnouncementsList.innerHTML = "<p>No announcements available.</p>";
    elements.membersList.innerHTML = "<p class=\"subtle\">No members available.</p>";
    elements.membersPageList.innerHTML = "<p class=\"subtle\">No members available.</p>";
    elements.messagesList.innerHTML = "<p class=\"subtle\">No messages available.</p>";
    elements.messagesPageList.innerHTML = "<p class=\"subtle\">No messages available.</p>";
    state.selectedThreadId = null;
    renderSelectedThread();
    return;
  }

  const { summary } = organization;
  const threads = getDashboardExtras().messageThreads;
  const visibleTransactions = getVisibleTransactions();

  if (!threads.find((thread) => thread.id === state.selectedThreadId)) {
    state.selectedThreadId = threads[0]?.id || null;
  }

  elements.organizationName.textContent = organization.name;
  elements.organizationMeta.textContent = buildMetaLine(organization);
  elements.currentBalance.textContent = formatCurrency(summary.currentBalance);
  elements.approvedIncome.textContent = formatCurrency(summary.approvedIncome);
  elements.approvedExpenses.textContent = formatCurrency(summary.approvedExpenses);
  elements.pendingExpenses.textContent = formatCurrency(summary.pendingExpenses);
  elements.projectedBalance.textContent = `Projected balance: ${formatCurrency(
    summary.projectedBalance
  )}`;

  renderCompactHistory(visibleTransactions);
  renderFullHistory(visibleTransactions);
  renderAnnouncements();
  renderMembers();
  renderMessages();
}

function renderExpandableState() {
  elements.membersContent.classList.toggle("hidden", !state.membersExpanded);
  elements.messagesContent.classList.toggle("hidden", !state.messagesExpanded);
  elements.membersChevron.textContent = state.membersExpanded ? "⌄" : "›";
  elements.messagesChevron.textContent = state.messagesExpanded ? "⌄" : "›";
}

function renderSidebarState() {
  elements.dashboardSidebar.classList.toggle("open", state.sidebarOpen);
  elements.sidebarOverlay.classList.toggle("hidden", !state.sidebarOpen);
  elements.dashboardSidebar.setAttribute("aria-hidden", String(!state.sidebarOpen));

  elements.sidebarLinks.forEach((link) => {
    const isActive = link.dataset.sidebarPanel === state.activeSidebarPanel;
    link.classList.toggle("active", isActive);
  });

  ["announcements", "account", "settings", "help"].forEach((panelId) => {
    document
      .querySelector(`#sidebar-panel-${panelId}`)
      .classList.toggle("hidden", panelId !== state.activeSidebarPanel);
  });
}

function renderDashboardPage() {
  elements.navPills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.dashboardPage === state.currentDashboardPage);
  });

  elements.dashboardPages.forEach((page) => {
    const pageName = page.id.replace("dashboard-page-", "");
    page.classList.toggle(
      "hidden",
      pageName !== state.currentDashboardPage || !canAccessDashboardPage(pageName)
    );
  });
}

function renderPermissionState() {
  const leadership = isLeadershipRole();
  const officer = isOfficerRole();
  const member = isMemberRole();
  const canViewAnnouncements = leadership || officer || member || hasPermission("announcements.view");
  const canViewMessages = leadership || officer || member || hasPermission("messages.view");
  const canViewMembers = leadership || officer || member || hasPermission("members.view");
  const canViewBalance =
    leadership || officer || member || hasPermission("balance.view") || hasPermission("transactions.view");
  const canViewTransactions = leadership || officer || hasPermission("transactions.view");
  const canCreateTransactions = leadership || officer || hasPermission("transactions.create");
  const canApproveTransactions = leadership || hasPermission("transactions.approve");
  const canReplyToMessages = leadership || officer || member || hasPermission("messages.reply");
  const canReplyToAnnouncements = leadership || officer || member || hasPermission("announcements.reply");
  const canViewSettings = leadership || hasPermission("settings.view");
  const canManageAccounts = leadership || hasPermission("accounts.view");

  elements.navPills.forEach((pill) => {
    pill.classList.toggle("hidden", !canAccessDashboardPage(pill.dataset.dashboardPage));
  });

  elements.balanceCard.classList.toggle("hidden", !canViewBalance);
  elements.membersCard.classList.toggle("hidden", !canViewMembers);
  elements.messagesCard.classList.toggle("hidden", !canViewMessages);
  elements.announcementsCard.classList.toggle("hidden", !canViewAnnouncements);
  elements.entryCard.classList.toggle("hidden", !canCreateTransactions);
  elements.historyCard.classList.toggle("hidden", !canViewTransactions);
  elements.openHistoryPageButton.classList.toggle("hidden", !canAccessDashboardPage("transactions"));
  elements.projectedBalance.classList.toggle("hidden", !canViewBalance);
  elements.messageReplyForm.classList.toggle("hidden", !canViewMessages);
  elements.messageReplyInput.disabled = !canReplyToMessages;
  elements.messageReplySubmitButton.disabled = !canReplyToMessages;
  elements.organizationSelectField.classList.toggle("hidden", state.organizations.length <= 1);
  elements.transactionForm.elements.status.disabled = !canApproveTransactions;
  elements.transactionForm.elements.status.value = canApproveTransactions ? "approved" : "pending";
  elements.transactionForm.elements.submittedBy.value = state.activeUser?.name || "";
  elements.transactionForm.elements.submittedBy.disabled = !canApproveTransactions;
  elements.transactionPermissionNote.textContent = canApproveTransactions
    ? "Leadership can submit transactions as approved immediately or leave them pending."
    : "Officer requests stay pending until a sponsor, treasurer, or president approves them.";

  document.querySelectorAll("[data-announcement-form='true'] textarea").forEach((textarea) => {
    textarea.disabled = !canReplyToAnnouncements;
  });

  elements.sidebarLinks.forEach((link) => {
    const panelName = link.dataset.sidebarPanel;
    const shouldShow =
      panelName === "announcements"
        ? canViewAnnouncements
        : panelName === "settings"
          ? canViewSettings
          : true;

    link.classList.toggle("hidden", !shouldShow);
  });

  if (state.activeSidebarPanel === "announcements" && !canViewAnnouncements) {
    state.activeSidebarPanel = "account";
  }

  if (state.activeSidebarPanel === "settings" && !canViewSettings) {
    state.activeSidebarPanel = "account";
  }

  if (!canAccessDashboardPage(state.currentDashboardPage)) {
    state.currentDashboardPage = getPreferredDashboardPage();
  }

  if (officer && !canApproveTransactions) {
    elements.historyNavLabel.textContent = "Requests";
    elements.historyCardTitle.textContent = "Recent Requests";
    elements.historyPageTitle.textContent = "Transaction Requests";
    elements.historyPageSubtitle.textContent = "Track the status of requests submitted for approval.";
    elements.openHistoryPageButton.textContent = "Open requests";
  } else if (canViewTransactions) {
    elements.historyNavLabel.textContent = "Transactions";
    elements.historyCardTitle.textContent = "Recent Transactions";
    elements.historyPageTitle.textContent = "Full Transactions";
    elements.historyPageSubtitle.textContent =
      "Review the full transaction ledger for the selected organization.";
    elements.openHistoryPageButton.textContent = "Open transactions";
  } else {
    elements.historyNavLabel.textContent = "Transactions";
    elements.historyCardTitle.textContent = "Recent Transactions";
    elements.historyPageTitle.textContent = "Full Transactions";
    elements.historyPageSubtitle.textContent =
      "Review the full transaction ledger for the selected organization.";
    elements.openHistoryPageButton.textContent = "Open page";
  }
}

function getAccessUserPrimaryRoleId(accessUser) {
  return (
    accessUser?.assignment?.roleIds?.[0] ||
    accessUser?.access?.roleIds?.[0] ||
    "member"
  );
}

function buildRoleTemplateCards() {
  if (!state.accessRoles.length) {
    return "<p class=\"subtle\">No role templates are available yet.</p>";
  }

  return state.accessRoles
    .map(
      (role) => `
        <article class="access-role-card">
          <div class="access-role-header">
            <strong>${role.label}</strong>
            <span class="status-badge">${role.id}</span>
          </div>
          <p class="subtle">${role.description}</p>
          <p class="subtle">Default page: ${role.defaultLandingPage}</p>
          <p class="subtle">Permissions: ${role.permissions.join(", ")}</p>
        </article>
      `
    )
    .join("");
}

function buildAccessUserCards() {
  if (!state.accessUsers.length) {
    return "<p class=\"subtle\">No users are available yet.</p>";
  }

  const organizationOptions = state.organizations
    .map(
      (organization) =>
        `<option value="${organization.id}">${organization.name}</option>`
    )
    .join("");
  const roleOptions = state.accessRoles
    .map(
      (role) => `
        <option value="${role.id}">${role.label}</option>
      `
    )
    .join("");

  return state.accessUsers
    .map((user) => {
      const currentRoleId = getAccessUserPrimaryRoleId(user);
      const scopeLevel = user.assignment?.scope?.level || user.access?.scope?.level || "global";
      const scopedOrganizationIds =
        user.assignment?.scope?.organizationIds || user.access?.scope?.organizationIds || [];
      const notes = user.assignment?.notes || "";

      return `
        <form class="access-user-card" data-access-form="true" data-account-id="${user.accountId}">
          <div class="access-user-topline">
            <div>
              <strong>${user.name}</strong>
              <p class="subtle">${user.accountId} • ${user.email}</p>
            </div>
            <span class="status-badge">${user.access?.role || user.role}</span>
          </div>

          <div class="field-row">
            <label class="field">
              <span>Role</span>
              <select name="roleId">
                ${roleOptions}
              </select>
            </label>

            <label class="field">
              <span>Scope</span>
              <select name="scopeLevel">
                <option value="global">Global</option>
                <option value="organization">Organization only</option>
              </select>
            </label>
          </div>

          <label class="field">
            <span>Organization scope</span>
            <select name="organizationIds" multiple size="${Math.max(3, state.organizations.length || 3)}">
              ${organizationOptions}
            </select>
          </label>

          <label class="field">
            <span>Notes</span>
            <textarea name="notes" rows="2" placeholder="Optional notes about this assignment">${notes}</textarea>
          </label>

          <div class="reply-actions">
            <button type="submit" class="primary-button">Save access</button>
            <span class="subtle">Current permissions: ${(user.access?.permissions || []).join(", ") || "none"}</span>
          </div>
        </form>
      `;
    })
    .join("");
}

function renderAccessManagement() {
  elements.accessRolesList.innerHTML = buildRoleTemplateCards();
  elements.accessUsersList.innerHTML = buildAccessUserCards();

  elements.accessUsersList.querySelectorAll("[data-access-form='true']").forEach((form) => {
    const accountId = form.dataset.accountId;
    const accessUser = state.accessUsers.find((entry) => entry.accountId === accountId);
    const currentRoleId = getAccessUserPrimaryRoleId(accessUser);
    const scopeLevel = accessUser?.assignment?.scope?.level || accessUser?.access?.scope?.level || "global";
    const scopedOrganizationIds =
      accessUser?.assignment?.scope?.organizationIds || accessUser?.access?.scope?.organizationIds || [];

    form.elements.roleId.value = currentRoleId;
    form.elements.scopeLevel.value = scopeLevel;

    Array.from(form.elements.organizationIds.options).forEach((option) => {
      option.selected = scopedOrganizationIds.includes(option.value);
    });
  });
}

async function loadAccessManagement() {
  if (!hasPermission("accounts.view")) {
    state.accessRoles = [];
    state.accessUsers = [];
    renderAccessManagement();
    return;
  }

  const [rolesResponse, usersResponse] = await Promise.all([
    apiFetch("/api/access/roles"),
    apiFetch("/api/access/users")
  ]);

  state.accessRoles = await rolesResponse.json();
  state.accessUsers = await usersResponse.json();
  renderAccessManagement();
}

function setDashboardPage(pageName) {
  state.currentDashboardPage = normalizeDashboardPageName(pageName);
  renderDashboardPage();
}

function openSidebar() {
  state.sidebarOpen = true;
  renderSidebarState();
}

function closeSidebar() {
  state.sidebarOpen = false;
  renderSidebarState();
}

async function loadTransactionsForSelectedOrganization() {
  if (!hasPermission("transactions.view")) {
    state.currentTransactions = [];
    resetTransactionsPageState();
    return;
  }

  if (!state.selectedOrganizationId) {
    state.currentTransactions = [];
    resetTransactionsPageState();
    return;
  }

  const response = await apiFetch(
    `/api/organizations/${state.selectedOrganizationId}/transactions`
  );
  state.currentTransactions = await response.json();
  resetTransactionsPageState();
}

async function loadOrganizations() {
  const response = await apiFetch("/api/organizations");
  state.organizations = applyOrganizationScope(await response.json());

  if (!state.organizations.some((organization) => organization.id === state.selectedOrganizationId)) {
    state.selectedOrganizationId = state.organizations[0]?.id || null;
  }

  if (!state.selectedOrganizationId && state.organizations.length) {
    state.selectedOrganizationId = state.organizations[0].id;
  }

  renderOrganizations();
  await loadTransactionsForSelectedOrganization();
  renderSelectedOrganization();
}

async function loadCurrentUser() {
  const response = await apiFetch("/api/auth/me");
  const payload = await response.json();
  state.activeUser = payload.user;
  renderActiveUser();
}

async function enterDashboard() {
  await loadCurrentUser();
  await loadOrganizations();
  await loadAccessManagement();
  renderExpandableState();
  renderPermissionState();
  state.currentDashboardPage = getPreferredDashboardPage();
  renderSidebarState();
  renderDashboardPage();
  showView("dashboard");
}

async function authenticate(url, payload, messageElement) {
  setMessage(messageElement, "Submitting...");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to complete authentication.");
  }

  setAuthToken(result.token);
  state.activeUser = result.user;
  renderActiveUser();
  return result;
}

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(elements.loginForm);
  const payload = {
    identifier: String(formData.get("identifier") || "").trim(),
    password: String(formData.get("password") || "")
  };

  if (!isValidEmail(payload.identifier) && !isValidAccountId(payload.identifier)) {
    setMessage(
      elements.loginMessage,
      "Please enter a valid email address or a K-number between K00000000 and K00999999.",
      true
    );
    return;
  }

  if (!payload.password) {
    setMessage(elements.loginMessage, "Please enter your password.", true);
    return;
  }

  try {
    await authenticate("/api/auth/login", payload, elements.loginMessage);
    setMessage(elements.loginMessage, "");
    elements.loginForm.reset();
    await enterDashboard();
  } catch (error) {
    setMessage(elements.loginMessage, error.message, true);
  }
}

async function handleSignup(event) {
  event.preventDefault();

  const formData = new FormData(elements.signupForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    accountId: normalizeAccountId(formData.get("accountId")),
    password: String(formData.get("password") || "")
  };

  if (!payload.name) {
    setMessage(elements.signupMessage, "Please enter your name.", true);
    return;
  }

  if (!isValidEmail(payload.email)) {
    setMessage(elements.signupMessage, "Please enter a valid email address.", true);
    return;
  }

  if (!isValidAccountId(payload.accountId)) {
    setMessage(
      elements.signupMessage,
      "Account ID must be between K00000000 and K00999999.",
      true
    );
    return;
  }

  if (payload.password.length < 8) {
    setMessage(elements.signupMessage, "Password must be at least 8 characters long.", true);
    return;
  }

  const emailStatus = await checkAccountStatus(payload.email);
  if (emailStatus.exists) {
    elements.signupForm.reset();
    moveToSigninWithIdentifier(
      payload.email,
      "That email is already in the system. Try signing in instead."
    );
    return;
  }

  const accountIdStatus = await checkAccountStatus(payload.accountId);
  if (accountIdStatus.exists) {
    setMessage(
      elements.signupMessage,
      "That K-number is already in the system.",
      true
    );
    return;
  }

  try {
    await authenticate("/api/auth/signup", payload, elements.signupMessage);
    setMessage(elements.signupMessage, "");
    elements.signupForm.reset();
    await enterDashboard();
  } catch (error) {
    setMessage(elements.signupMessage, error.message, true);
  }
}

function handleLogout() {
  clearAuthState();
  showView("auth");
  showAuthMode("signin");
  setMessage(elements.loginMessage, "");
  setMessage(elements.signupMessage, "");
}

async function submitTransaction(event) {
  event.preventDefault();

  if (!hasPermission("transactions.create")) {
    setMessage(elements.formMessage, "You do not have permission to add transactions.", true);
    return;
  }

  const formData = new FormData(elements.transactionForm);
  const payload = Object.fromEntries(formData.entries());

  setMessage(elements.formMessage, "Saving transaction...");

  try {
    const response = await apiFetch(
      `/api/organizations/${state.selectedOrganizationId}/transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to save transaction.");
    }

    state.organizations = state.organizations.map((organization) =>
      organization.id === result.organization.id ? result.organization : organization
    );
    state.currentTransactions = result.transactions;

    renderSelectedOrganization();
    elements.transactionForm.reset();
    elements.transactionForm.elements.date.valueAsDate = new Date();
    setMessage(
      elements.formMessage,
      hasPermission("transactions.approve")
        ? "Transaction saved successfully."
        : "Request submitted. It is pending approval from leadership."
    );
  } catch (error) {
    setMessage(elements.formMessage, error.message, true);
  }
}

async function approveTransaction(transactionId) {
  if (!hasPermission("transactions.approve")) {
    setMessage(elements.formMessage, "You do not have permission to approve transactions.", true);
    return;
  }

  const response = await apiFetch(
    `/api/organizations/${state.selectedOrganizationId}/transactions/${transactionId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "approved" })
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to approve transaction.");
  }

  state.organizations = state.organizations.map((organization) =>
    organization.id === result.organization.id ? result.organization : organization
  );
  state.currentTransactions = result.transactions;
  renderSelectedOrganization();
  setMessage(elements.formMessage, "Pending request approved.");
}

async function saveAccessAssignment(form) {
  const organizationIds = Array.from(form.elements.organizationIds.selectedOptions).map(
    (option) => option.value
  );
  const payload = {
    roleIds: [form.elements.roleId.value],
    scope: {
      level: form.elements.scopeLevel.value,
      organizationIds
    },
    notes: form.elements.notes.value.trim()
  };
  const accountId = form.dataset.accountId;

  setMessage(elements.accessMessage, "Saving access update...");

  const response = await apiFetch(`/api/access/users/${accountId}/assignment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to save access assignment.");
  }

  setMessage(elements.accessMessage, `Access updated for ${accountId}.`);
  await loadAccessManagement();
}

async function saveQuickRoleAssignment(accountId, roleId) {
  const accessUser = state.accessUsers.find((entry) => entry.accountId === accountId);

  if (!accessUser) {
    throw new Error("That user could not be found.");
  }

  const scope =
    accessUser.assignment?.scope ||
    accessUser.access?.scope || {
      level: "global",
      organizationIds: []
    };

  const payload = {
    roleIds: [roleId],
    scope,
    notes: accessUser.assignment?.notes || ""
  };

  setMessage(elements.membersPageMessage, "Updating role...");

  const response = await apiFetch(`/api/access/users/${accountId}/assignment`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Unable to update this role.");
  }

  setMessage(elements.membersPageMessage, `Role updated for ${accessUser.name}.`);
  await loadAccessManagement();
  renderMembers();
}

function addReplyToThread(replyText) {
  const thread = getSelectedThread();

  if (!thread || !state.activeUser) {
    return;
  }

  const timestamp = new Date().toISOString();
  thread.messages.push({
    id: `reply-${Date.now()}`,
    author: state.activeUser.name,
    role: state.activeUser.role,
    sentAt: timestamp,
    text: replyText,
    reactions: { up: 0, down: 0 },
    userReaction: null
  });

  thread.status = "Read";
  thread.updatedAt = timestamp;
  thread.preview = replyText;
}

function handleReplySubmit(event) {
  event.preventDefault();

  if (!hasPermission("messages.reply")) {
    setMessage(elements.messageThreadFeedback, "You do not have permission to reply in threads.", true);
    return;
  }

  const replyText = elements.messageReplyInput.value.trim();

  if (!state.selectedThreadId) {
    setMessage(elements.messageThreadFeedback, "Select a thread before replying.", true);
    return;
  }

  if (!replyText) {
    setMessage(elements.messageThreadFeedback, "Write a message before sending.", true);
    return;
  }

  addReplyToThread(replyText);
  elements.messageReplyForm.reset();
  setMessage(elements.messageThreadFeedback, "Reply added to the thread.");
  renderMessages();
}

function handleAnnouncementReplySubmit(event) {
  event.preventDefault();

  if (!hasPermission("announcements.reply")) {
    return;
  }

  const form = event.target.closest("[data-announcement-form='true']");

  if (!form) {
    return;
  }

  const replyText = form.elements.replyText.value.trim();

  if (!replyText) {
    return;
  }

  addAnnouncementReply(form.dataset.announcementId, replyText);
  form.reset();
  renderAnnouncements();
}

function applyReaction(threadId, messageId, reactionName) {
  const thread = getDashboardExtras().messageThreads.find((item) => item.id === threadId);
  const message = thread?.messages.find((item) => item.id === messageId);

  if (!message) {
    return;
  }

  ensureThreadInteractionState([thread]);

  if (message.userReaction === reactionName) {
    message.reactions[reactionName] = Math.max(0, (message.reactions[reactionName] || 0) - 1);
    message.userReaction = null;
  } else {
    if (message.userReaction) {
      const previousReaction = message.userReaction;
      message.reactions[previousReaction] = Math.max(
        0,
        (message.reactions[previousReaction] || 0) - 1
      );
    }

    message.reactions[reactionName] = (message.reactions[reactionName] || 0) + 1;
    message.userReaction = reactionName;
  }

  renderMessages();
}

function openThread(threadId) {
  if (!hasPermission("messages.view")) {
    return;
  }

  const thread = getDashboardExtras().messageThreads.find((item) => item.id === threadId);
  state.selectedThreadId = threadId;
  if (thread) {
    thread.status = "Read";
  }
  setDashboardPage("messages");
  renderMessages();
  setMessage(elements.messageThreadFeedback, "");
}

function initializeFormDefaults() {
  elements.transactionForm.elements.date.valueAsDate = new Date();
}

elements.homeReadyButton.addEventListener("click", () => {
  showView("auth");
  showAuthMode("signup");
});

elements.backHomeButton.addEventListener("click", () => {
  showView("home");
});

elements.showSigninButton.addEventListener("click", () => {
  showAuthMode("signin");
});

elements.showSignupButton.addEventListener("click", () => {
  showAuthMode("signup");
});

elements.loginIdentifier.addEventListener("blur", async () => {
  const identifier = elements.loginIdentifier.value.trim();

  if (!identifier || (!isValidEmail(identifier) && !isValidAccountId(identifier))) {
    return;
  }

  const accountStatus = await checkAccountStatus(identifier);
  if (!accountStatus.exists) {
    setMessage(
      elements.loginMessage,
      "No account was found for that email or K-number yet. You may need to sign up first.",
      true
    );
  } else {
    setMessage(elements.loginMessage, "");
  }
});

elements.signupEmail.addEventListener("blur", async () => {
  const email = elements.signupEmail.value.trim();

  if (!email || !isValidEmail(email)) {
    return;
  }

  const accountStatus = await checkAccountStatus(email);
  if (accountStatus.exists) {
    setMessage(
      elements.signupMessage,
      "That email is already registered. You can sign in instead.",
      true
    );
  } else {
    setMessage(elements.signupMessage, "");
  }
});

elements.signupAccountId.addEventListener("blur", async () => {
  const accountId = normalizeAccountId(elements.signupAccountId.value);
  elements.signupAccountId.value = accountId;

  if (!accountId || !isValidAccountId(accountId)) {
    return;
  }

  const accountStatus = await checkAccountStatus(accountId);
  if (accountStatus.exists) {
    setMessage(
      elements.signupMessage,
      "That K-number is already registered.",
      true
    );
  } else if (!elements.signupMessage.textContent.includes("email")) {
    setMessage(elements.signupMessage, "");
  }
});

elements.loginForm.addEventListener("submit", (event) => {
  handleLogin(event).catch((error) => {
    setMessage(elements.loginMessage, error.message, true);
  });
});

elements.signupForm.addEventListener("submit", (event) => {
  handleSignup(event).catch((error) => {
    setMessage(elements.signupMessage, error.message, true);
  });
});

elements.sidebarToggleButton.addEventListener("click", openSidebar);
elements.sidebarCloseButton.addEventListener("click", closeSidebar);
elements.sidebarOverlay.addEventListener("click", closeSidebar);

elements.sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    state.activeSidebarPanel = link.dataset.sidebarPanel;
    renderSidebarState();
  });
});

elements.membersToggle.addEventListener("click", () => {
  state.membersExpanded = !state.membersExpanded;
  renderExpandableState();
});

elements.messagesToggle.addEventListener("click", () => {
  state.messagesExpanded = !state.messagesExpanded;
  renderExpandableState();
});

elements.navPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    setDashboardPage(pill.dataset.dashboardPage);
  });
});

elements.openHistoryPageButton.addEventListener("click", () => {
  setDashboardPage("transactions");
});

elements.organizationSelect.addEventListener("change", async (event) => {
  state.selectedOrganizationId = event.target.value;
  await loadTransactionsForSelectedOrganization();
  renderSelectedOrganization();
});

elements.transactionsPagePrev.addEventListener("click", () => {
  state.currentTransactionsPage = Math.max(1, state.currentTransactionsPage - 1);
  renderFullHistory(getVisibleTransactions());
});

elements.transactionsPageNext.addEventListener("click", () => {
  state.currentTransactionsPage += 1;
  renderFullHistory(getVisibleTransactions());
});

elements.historyPageBody.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-toggle-transaction-row='true']");

  if (toggleButton) {
    toggleTransactionExpanded(toggleButton.dataset.transactionId);
    renderFullHistory(getVisibleTransactions());
    return;
  }

  const button = event.target.closest("[data-approve-transaction='true']");

  if (!button) {
    return;
  }

  approveTransaction(button.dataset.transactionId).catch((error) => {
    setMessage(elements.formMessage, error.message, true);
  });
});

elements.membersPageList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-role-assign-select='true']");

  if (!select) {
    return;
  }

  select.disabled = true;
  saveQuickRoleAssignment(select.dataset.accountId, select.value)
    .catch((error) => {
      setMessage(elements.membersPageMessage, error.message, true);
    })
    .finally(() => {
      select.disabled = false;
    });
});

elements.messagesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-thread='true']");
  if (!button) {
    return;
  }

  openThread(button.dataset.threadId);
});

elements.messagesPageList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-thread='true']");
  if (!button) {
    return;
  }

  openThread(button.dataset.threadId);
});

elements.messageThreadBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-reaction]");
  if (!button) {
    return;
  }

  applyReaction(
    button.dataset.threadId,
    button.dataset.messageId,
    button.dataset.reaction
  );
});

elements.announcementsFeed.addEventListener("click", (event) => {
  const button = event.target.closest("[data-announcement-reaction]");

  if (!button) {
    return;
  }

  applyAnnouncementReaction(
    button.dataset.announcementId,
    button.dataset.announcementReaction
  );
});

elements.announcementsPageFeed.addEventListener("click", (event) => {
  const button = event.target.closest("[data-announcement-reaction]");

  if (!button) {
    return;
  }

  applyAnnouncementReaction(
    button.dataset.announcementId,
    button.dataset.announcementReaction
  );
});

elements.messageReplyForm.addEventListener("submit", handleReplySubmit);
elements.announcementsFeed.addEventListener("submit", handleAnnouncementReplySubmit);
elements.announcementsPageFeed.addEventListener("submit", handleAnnouncementReplySubmit);

elements.transactionForm.addEventListener("submit", (event) => {
  submitTransaction(event).catch((error) => {
    setMessage(elements.formMessage, error.message, true);
  });
});

elements.accessUsersList.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-access-form='true']");

  if (!form) {
    return;
  }

  event.preventDefault();
  saveAccessAssignment(form).catch((error) => {
    setMessage(elements.accessMessage, error.message, true);
  });
});

elements.logoutButton.addEventListener("click", handleLogout);

initializeFormDefaults();
showAuthMode("signin");
renderExpandableState();
renderSidebarState();
renderDashboardPage();

const storedToken = localStorage.getItem(TOKEN_KEY);

if (storedToken) {
  setAuthToken(storedToken);
  enterDashboard().catch((error) => {
    clearAuthState();
    showView("auth");
    showAuthMode("signin");
    setMessage(elements.loginMessage, error.message, true);
  });
} else {
  showView("auth");
}
