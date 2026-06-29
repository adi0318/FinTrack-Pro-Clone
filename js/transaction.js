const type = document.getElementById("type");
const category = document.getElementById("category");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const tableBody = document.getElementById("transactionTable");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

const incomeCategories = [
    "Salary",
    "Freelancing",
    "Business",
    "Investment",
    "Gift",
    "Bonus",
    "Other"
];

const expenseCategories = [
    "Food",
    "Shopping",
    "Bills",
    "Travel",
    "Health",
    "Entertainment",
    "Education",
    "Personal",
    "Other"
];

type.addEventListener("change", () => {

    category.innerHTML = "";
    let option = document.createElement("option");
    option.textContent = "Choose Category";
    option.value = "";
    category.appendChild(option);
    let list = [];
    if (type.value === "income") {
        list = incomeCategories;
    }
    else {
        list = expenseCategories;
    }

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        category.appendChild(option);
    });
});


let editId = null;

transactionForm.addEventListener("submit", function (e) {

    e.preventDefault();
    if (
        type.value === "" ||
        description.value.trim() === "" ||
        amount.value === "" ||
        date.value === "" ||
        category.value === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    const transaction = {
        id: editId || Date.now(),
        userId: currentUser.id,
        type: type.value,
        description: description.value.trim(),
        amount: Number(amount.value),
        date: date.value,
        category: category.value
    };

    if (editId === null) {
        addTransaction(transaction);
    }

    else {
        updateTransaction(transaction);
        editId = null;
    }

    transactionModal.classList.add("hidden");
    transactionForm.reset();
    category.innerHTML = `<option value="">Choose Category</option>`;
    refreshDashboard();
});

function formatDate(dateString){
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN");
}

function renderTransactions() {

    const transactions = getUserTransactions();
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedType = filterType.value;

    tableBody.innerHTML = "";

    let filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchText) ||
            transaction.category.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "all" ||
            transaction.type === selectedType;
        return matchesSearch && matchesType;
    });

    filteredTransactions.sort((a, b) => b.id - a.id);

    if (filteredTransactions.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;padding:30px;color:gray;">
                No Transactions Found
            </td>
        </tr>
        `;
        return;

    }

    filteredTransactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${formatDate(transaction.date)}</td>
        <td>${transaction.description}</td>

        <td>${transaction.category}</td>
        <td class="${transaction.type}-amount">
            ${transaction.type === "income" ? "+" : "-"}
            ${formatCurrency(transaction.amount)}

        </td>

        <td>
            <button
                class="action-btn edit-btn"
                onclick="editTransaction(${transaction.id})">

                <i class="ri-pencil-fill"></i>

            </button>

            <button
                class="action-btn delete-btn"
                onclick="removeTransaction(${transaction.id})">
                <i class="ri-delete-bin-fill"></i>

            </button>

        </td>
        `;
        tableBody.appendChild(row);
    });

}


searchInput.addEventListener("input", renderTransactions);

filterType.addEventListener("change", renderTransactions);

function removeTransaction(id) {
    const confirmation = confirm(
        "Delete this transaction?"
    );

    if (!confirmation) return;
    deleteTransaction(id);
    refreshDashboard();
}

function editTransaction(id) {

    const transactions = getUserTransactions();
    const transaction = transactions.find(item => item.id === id);

    if (!transaction) return;
    editId = transaction.id;
    modalTitle.textContent = "Edit Transaction";
    saveTransactionBtn.textContent = "Update Transaction";
    type.value = transaction.type;

    category.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choose Category";

    category.appendChild(defaultOption);
    const list = transaction.type === "income" ? incomeCategories: expenseCategories;

    list.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        category.appendChild(option);
    });

    description.value = transaction.description;

    amount.value = transaction.amount;

    date.value = transaction.date;

    category.value = transaction.category;

    transactionModal.classList.remove("hidden");
}