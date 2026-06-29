const currentUser = getCurrentUser();
if (!currentUser || localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "index.html";
}

const dashboardBtn = document.getElementById("dashboardBtn");
const settingsBtn = document.getElementById("settingsBtn");

const dashboardSection = document.getElementById("dashboardSection");
const settingsSection = document.getElementById("settingsSection");

const logoutBtn = document.getElementById("logoutBtn");
const loggedUser = document.getElementById("loggedUser");
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");

const addTransactionBtn = document.getElementById("addTransactionBtn");
const transactionModal = document.getElementById("transactionModal");
const closeModal = document.getElementById("closeModal");
const transactionForm = document.getElementById("transactionForm");
const modalTitle = document.getElementById("modalTitle");
const saveTransactionBtn = document.getElementById("saveTransaction");

function initializeDashboard() {
    loggedUser.textContent = currentUser.username;
    usernameInput.value = currentUser.username;
    emailInput.value = currentUser.email;

    loadTheme();
    loadCurrency();
    refreshDashboard();
}

dashboardBtn.addEventListener("click", () => {

    dashboardSection.classList.remove("hidden");
    settingsSection.classList.add("hidden");
    dashboardBtn.classList.add("active");

    settingsBtn.classList.remove("active");
});


settingsBtn.addEventListener("click", () => {

    dashboardSection.classList.add("hidden");
    settingsSection.classList.remove("hidden");
    settingsBtn.classList.add("active");
    dashboardBtn.classList.remove("active");
});


logoutBtn.addEventListener("click", () => {

    const confirmLogout = confirm("Logout from FinTrack Pro?");
    if (!confirmLogout) return;
    logoutUser();
    window.location.href = "index.html";
});

addTransactionBtn.addEventListener("click", () => {

    modalTitle.textContent = "Add Transaction";
    saveTransactionBtn.textContent = "Save Transaction";
    transactionForm.reset();
    transactionModal.classList.remove("hidden");
});


closeModal.addEventListener("click", () => {

    transactionModal.classList.add("hidden");
});

transactionModal.addEventListener("click", (e) => {

    if (e.target === transactionModal) {
        transactionModal.classList.add("hidden");
    }
});

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        transactionModal.classList.add("hidden");
    }
});

function refreshDashboard() {

    updateCards();
    renderTransactions();

    if (typeof renderChart === "function") {
        renderChart();
    }
}

function updateCards() {

    const transactions = getUserTransactions();
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += Number(transaction.amount);
        }
        else {
            expense += Number(transaction.amount);
        }
    });

    const balance = income - expense;

    document.getElementById("income").textContent =
        formatCurrency(income);
    document.getElementById("expense").textContent =
        formatCurrency(expense);
    document.getElementById("balance").textContent =
        formatCurrency(balance);
    document.getElementById("transactionCount").textContent =
        transactions.length;
}

function formatCurrency(amount) {

    const settings = getSettings();
    return settings.currency + Number(amount).toLocaleString();
}

function loadTheme() {

    const settings = getSettings();
    const toggle = document.getElementById("themeToggle");
    if (settings.theme === "dark") {
        document.body.classList.add("dark");
        toggle.checked = true;
    }

    else {
        document.body.classList.remove("dark");
        toggle.checked = false;
    }
}

function loadCurrency() {
    const settings = getSettings();
    document.getElementById("currencySelect").value =settings.currency;
}

initializeDashboard();
