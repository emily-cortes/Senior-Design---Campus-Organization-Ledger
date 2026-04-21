const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const TOKEN_KEY = "campus-ledger-token";

const dashboardExtras = {
  "cs-club": {
    members: [
      { id: "cs-1", name: "Nina Patel", status: "Online", role: "Treasurer" },
      { id: "cs-2", name: "Ethan Brooks", status: "Online", role: "President" },
      { id: "cs-3", name: "Maya Chen", status: "Offline", role: "Secretary" },
      { id: "cs-4", name: "Carlos Ruiz", status: "Offline", role: "Event Lead" }
    ],
    announcements: [
      {
        id: "cs-ann-1",
        author: "Dean Rochelle Price",
        date: "2026-04-19",
        message: "End-of-semester funding requests should be submitted by Friday for advisor review."
      },
      {
        id: "cs-ann-2",
        author: "Campus Finance Office",
        date: "2026-04-14",
        message: "Please attach receipts for all travel-related reimbursements before final approval."
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
      { id: "robo-1", name: "Jordan Lee", status: "Online", role: "Treasurer" },
      { id: "robo-2", name: "Amari Scott", status: "Online", role: "Build Lead" },
      { id: "robo-3", name: "Tessa Nguyen", status: "Offline", role: "Programming Lead" },
      { id: "robo-4", name: "Noah Kim", status: "Offline", role: "Driver" }
    ],
    announcements: [
      {
        id: "robo-ann-1",
        author: "Competition Coordinator",
        date: "2026-04-18",
        message: "Travel reimbursements for the regional trip should be filed within five business days."
      },
      {
        id: "robo-ann-2",
        author: "Campus Finance Office",
        date: "2026-04-09",
        message: "Equipment purchases over $500 should include a short justification note in the ledger."
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
      { id: "sen-1", name: "Camila Torres", status: "Online", role: "Treasurer" },
      { id: "sen-2", name: "Liam Harris", status: "Online", role: "President" },
      { id: "sen-3", name: "Olivia Reed", status: "Offline", role: "Committee Chair" },
      { id: "sen-4", name: "Jasmine Cole", status: "Offline", role: "Secretary" }
    ],
    announcements: [
      {
        id: "sen-ann-1",
        author: "Dean Rochelle Price",
        date: "2026-04-20",
        message: "Leadership retreat requests will need a final participant count before approval."
      },
      {
        id: "sen-ann-2",
        author: "Student Affairs",
        date: "2026-04-12",
        message: "Please keep town hall and programming spending categorized separately for reporting."
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
  selectedOrganizationId: null,
  activeUser: null,
  authToken: null,
  sidebarOpen: false,
  activeSidebarPanel: "announcements",
  membersExpanded: true,
  messagesExpanded: true,
  currentDashboardPage: "home",
  selectedThreadId: null
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
  loginEmail: document.querySelector("#login-email"),
  signupEmail: document.querySelector("#signup-email"),
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
  accountRole: document.querySelector("#account-role"),
  sidebarAnnouncementsList: document.querySelector("#sidebar-announcements-list"),
  logoutButton: document.querySelector("#logout-button"),
  organizationName: document.querySelector("#organization-name"),
  organizationMeta: document.querySelector("#organization-meta"),
  organizationSelect: document.querySelector("#organization-select"),
  currentBalance: document.querySelector("#current-balance"),
  approvedIncome: document.querySelector("#approved-income"),
  approvedExpenses: document.querySelector("#approved-expenses"),
  pendingExpenses: document.querySelector("#pending-expenses"),
  projectedBalance: document.querySelector("#projected-balance"),
  transactionsBody: document.querySelector("#transactions-body"),
  historyPageBody: document.querySelector("#history-page-body"),
  announcementsFeed: document.querySelector("#announcements-feed"),
  announcementsPageFeed: document.querySelector("#announcements-page-feed"),
  membersList: document.querySelector("#members-list"),
  membersPageList: document.querySelector("#members-page-list"),
  messagesList: document.querySelector("#messages-list"),
  messagesPageList: document.querySelector("#messages-page-list"),
  membersToggle: document.querySelector("#members-toggle"),
  messagesToggle: document.querySelector("#messages-toggle"),
  membersContent: document.querySelector("#members-content"),
  messagesContent: document.querySelector("#messages-content"),
  membersChevron: document.querySelector("#members-chevron"),
  messagesChevron: document.querySelector("#messages-chevron"),
  navPills: Array.from(document.querySelectorAll(".nav-pill")),
  dashboardPages: Array.from(document.querySelectorAll(".dashboard-page")),
  openHistoryPageButton: document.querySelector("#open-history-page-button"),
  messageThreadSubject: document.querySelector("#message-thread-subject"),
  messageThreadMeta: document.querySelector("#message-thread-meta"),
  messageThreadBody: document.querySelector("#message-thread-body"),
  messageReplyForm: document.querySelector("#message-reply-form"),
  messageReplyInput: document.querySelector("#message-reply-input"),
  messageThreadFeedback: document.querySelector("#message-thread-feedback"),
  transactionForm: document.querySelector("#transaction-form"),
  formMessage: document.querySelector("#form-message")
};

function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
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

function moveToSigninWithEmail(email, message) {
  showView("auth");
  showAuthMode("signin");
  elements.loginForm.elements.email.value = email;
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

async function checkAccountStatus(email) {
  const response = await fetch("/api/auth/check-account", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
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
  elements.organizationSelect.innerHTML = state.organizations
    .map(
      (organization) =>
        `<option value="${organization.id}">${organization.name}</option>`
    )
    .join("");

  elements.organizationSelect.value = state.selectedOrganizationId;
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
  if (!transactions.length) {
    elements.historyPageBody.innerHTML =
      '<tr><td colspan="6">No transactions have been recorded yet.</td></tr>';
    return;
  }

  elements.historyPageBody.innerHTML = transactions
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
          <td>${transaction.description}</td>
          <td>${transaction.fund}</td>
          <td>${transaction.status}</td>
          <td>${deposit}</td>
          <td>${withdrawal}</td>
        </tr>
      `;
    })
    .join("");
}

function buildAnnouncementCards(announcements) {
  return announcements
    .map(
      (announcement) => `
        <article class="announcement-card">
          <div class="announcement-title-row">
            <span class="announcement-author">${announcement.author}</span>
            <span class="announcement-date">${formatDisplayDate(announcement.date)}</span>
          </div>
          <p>${announcement.message}</p>
        </article>
      `
    )
    .join("");
}

function renderAnnouncements() {
  const announcements = getDashboardExtras().announcements;
  const markup = buildAnnouncementCards(announcements);

  elements.announcementsFeed.innerHTML = markup || "<p>No announcements available.</p>";
  elements.announcementsPageFeed.innerHTML = markup || "<p>No announcements available.</p>";
  elements.sidebarAnnouncementsList.innerHTML =
    markup.replaceAll("announcement-card", "sidebar-announcement-card") ||
    "<p>No announcements available.</p>";
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

function renderMembers() {
  const members = getDashboardExtras().members;
  elements.membersList.innerHTML = buildMemberCards(members.slice(0, 4));
  elements.membersPageList.innerHTML = buildMemberCards(members, true);
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
    return;
  }

  const { summary } = organization;
  const threads = getDashboardExtras().messageThreads;

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

  renderCompactHistory(state.currentTransactions);
  renderFullHistory(state.currentTransactions);
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
    page.classList.toggle("hidden", pageName !== state.currentDashboardPage);
  });
}

function setDashboardPage(pageName) {
  state.currentDashboardPage = pageName;
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
  if (!state.selectedOrganizationId) {
    state.currentTransactions = [];
    return;
  }

  const response = await apiFetch(
    `/api/organizations/${state.selectedOrganizationId}/transactions`
  );
  state.currentTransactions = await response.json();
}

async function loadOrganizations() {
  const response = await apiFetch("/api/organizations");
  state.organizations = await response.json();

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
  renderExpandableState();
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
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };

  if (!isValidEmail(payload.email)) {
    setMessage(elements.loginMessage, "Please enter a valid email address.", true);
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

  if (payload.password.length < 8) {
    setMessage(elements.signupMessage, "Password must be at least 8 characters long.", true);
    return;
  }

  const accountStatus = await checkAccountStatus(payload.email);
  if (accountStatus.exists) {
    elements.signupForm.reset();
    moveToSigninWithEmail(
      payload.email,
      "That email is already in the system. Try signing in instead."
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
    setMessage(elements.formMessage, "Transaction saved successfully.");
  } catch (error) {
    setMessage(elements.formMessage, error.message, true);
  }
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
    reactions: { like: 0, support: 0, celebrate: 0 }
  });

  thread.status = "Read";
  thread.updatedAt = timestamp;
  thread.preview = replyText;
}

function handleReplySubmit(event) {
  event.preventDefault();

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

elements.loginEmail.addEventListener("blur", async () => {
  const email = elements.loginEmail.value.trim();

  if (!email || !isValidEmail(email)) {
    return;
  }

  const accountStatus = await checkAccountStatus(email);
  if (!accountStatus.exists) {
    setMessage(
      elements.loginMessage,
      "No account was found for that email yet. You may need to sign up first.",
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
  setDashboardPage("history");
});

elements.organizationSelect.addEventListener("change", async (event) => {
  state.selectedOrganizationId = event.target.value;
  await loadTransactionsForSelectedOrganization();
  renderSelectedOrganization();
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

elements.messageReplyForm.addEventListener("submit", handleReplySubmit);

elements.transactionForm.addEventListener("submit", (event) => {
  submitTransaction(event).catch((error) => {
    setMessage(elements.formMessage, error.message, true);
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
