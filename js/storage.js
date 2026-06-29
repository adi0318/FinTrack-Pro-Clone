const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const SETTINGS_KEY = "settings";
const TRANSACTIONS_KEY = "transactions";


function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem("isLoggedIn");
}


function getTransactions() {
  return JSON.parse(localStorage.getItem(TRANSACTIONS_KEY)) || [];
}

function saveTransactions(transactions) {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}


function getUserTransactions() {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  const allTransactions = getTransactions();
  return allTransactions.filter(
    (transaction) => transaction.userId === currentUser.id,
  );
}


function addTransaction(transaction) {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}


function updateTransaction(updatedTransaction) {
  const transactions = getTransactions();
  const index = transactions.findIndex(
    (transaction) => transaction.id === updatedTransaction.id,
  );

  if (index !== -1) {
    transactions[index] = updatedTransaction;
    saveTransactions(transactions);
  }
}

function deleteTransaction(id) {
  let transactions = getTransactions();
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions(transactions);
}


function getSettings() {
  return (
    JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
      currency: "₹",
      theme: "light",
    }
  );
}

function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings),
  );
}


function resetTransactions() {

  const currentUser = getCurrentUser();
  if (!currentUser) return;
  let transactions = getTransactions();
  transactions = transactions.filter(
    (transaction) => transaction.userId !== currentUser.id,
  );

  saveTransactions(transactions);
}
