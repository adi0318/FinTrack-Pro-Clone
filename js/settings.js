const saveSettingsBtn = document.getElementById("saveSettings");

const currencySelect = document.getElementById("currencySelect");

const themeToggle = document.getElementById("themeToggle");

const resetBtn = document.getElementById("resetDataBtn");

saveSettingsBtn.addEventListener("click", () => {

    const currentUser = getCurrentUser();
    const users = getUsers();

    currentUser.username = usernameInput.value.trim();
    const index = users.findIndex(user => user.id === currentUser.id);

    if (index !== -1) {
        users[index] = currentUser;
    }

    saveUsers(users);
    saveCurrentUser(currentUser);

    document.getElementById("loggedUser").textContent =
        currentUser.username;

    saveSettings({
        currency: currencySelect.value,
        theme: themeToggle.checked ? "dark" : "light"
    });

    refreshDashboard();
    alert("Settings Saved Successfully.");
});

themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        document.body.classList.add("dark");
    }
    else {
        document.body.classList.remove("dark");
    }
});


resetBtn.addEventListener("click", () => {
    const confirmation = confirm(
        "Delete all your transactions?"
    );
    if (!confirmation) return;

    resetTransactions();
    refreshDashboard();

});

(function(){

    const settings = getSettings();
    currencySelect.value = settings.currency;
    themeToggle.checked = settings.theme === "dark";
    
    if(settings.theme === "dark"){

        document.body.classList.add("dark");
    }
})();