const loginCard = document.getElementById("loginCard");
const registerCard = document.getElementById("registerCard");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if(localStorage.getItem("isLoggedIn") === "true"){
    window.location.href = "dashboard.html";
}

showRegister.addEventListener("click", () => {
    loginCard.classList.add("hidden");
    registerCard.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
    registerCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
});

function getUsers(){
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(username === "" || email === "" || password === "" || confirmPassword === ""){
        alert("Please fill all fields.");
        return;
    }

    if(password !== confirmPassword){
        alert("Passwords do not match.");
        return;
    }

    let users = getUsers();

    const alreadyExists = users.find(user => user.email === email);

    if(alreadyExists){
        alert("Email already registered.");
        return;
    }

    const newUser = {

        id: Date.now(),

        username: username,

        email: email,

        password: password
    };

    users.push(newUser);
    saveUsers(users);
    alert("Registration Successful!");

    registerForm.reset();
    registerCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
});

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(u => {

        return (u.email === email && u.password === password);
    });

    if (!user) {
        alert("Invalid Credentials");
        return;
    }

    localStorage.setItem("isLoggedIn", "true");

    localStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "dashboard.html";
});