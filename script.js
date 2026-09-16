// Get expenses from local storage

function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}


// Login

function login(event) {
    event.preventDefault();

    let username = document.getElementById("username").value;

    localStorage.setItem("username", username);

    window.location.href = "dashboard.html";
}


// Add Expense

function addExpense(event) {
    event.preventDefault();

    let date = document.getElementById("expenseDate").value;
    let category = document.getElementById("category").value;
    let description = document.getElementById("description").value;
    let amount = Number(document.getElementById("amount").value);

    let expenses = getExpenses();

    let newExpense = {
        id: Date.now(),
        date: date,
        category: category,
        description: description,
        amount: amount
    };

    expenses.push(newExpense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    alert("Expense added successfully! 💰");

    window.location.href = "dashboard.html";
}


// Dashboard

function loadDashboard() {

    let expenses = getExpenses();

    let totalExpense = expenses.reduce(function(total, expense) {
        return total + expense.amount;
    }, 0);

    let income = 50000;
    let balance = income - totalExpense;

    document.getElementById("expenseAmount").innerText =
        "₹" + totalExpense;

    document.getElementById("balanceAmount").innerText =
        "₹" + balance;

    let recent = expenses.slice(-5).reverse();

    let table = document.getElementById("recentExpenses");

    table.innerHTML = "";

    if (recent.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="4">No expenses added yet.</td>
            </tr>
        `;
        return;
    }

    recent.forEach(function(expense) {

        table.innerHTML += `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount}</td>
            </tr>
        `;

    });
}


// History

function displayHistory() {

    let expenses = getExpenses();

    let search =
        document.getElementById("searchExpense").value.toLowerCase();

    let table =
        document.getElementById("historyTable");

    table.innerHTML = "";

    let filteredExpenses = expenses.filter(function(expense) {

        return (
            expense.category.toLowerCase().includes(search) ||
            expense.description.toLowerCase().includes(search)
        );

    });

    if (filteredExpenses.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">No expenses found.</td>
            </tr>
        `;

        return;
    }

    filteredExpenses.reverse().forEach(function(expense) {

        table.innerHTML += `
            <tr>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>₹${expense.amount}</td>
                <td>
                    <button class="delete-btn"
                    onclick="deleteExpense(${expense.id})">
                    Delete
                    </button>
                </td>
            </tr>
        `;

    });
}


// Delete Expense

function deleteExpense(id) {

    if (!confirm("Are you sure you want to delete this expense?")) {
        return;
    }

    let expenses = getExpenses();

    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    displayHistory();
}


// Reports

function loadReports() {

    let expenses = getExpenses();

    let categoryTotals = {};

    expenses.forEach(function(expense) {

        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }

        categoryTotals[expense.category] += expense.amount;

    });

    let total = expenses.reduce(function(sum, expense) {
        return sum + expense.amount;
    }, 0);

    document.getElementById("reportTotal").innerText =
        "₹" + total;

    document.getElementById("expenseCount").innerText =
        expenses.length;

    let average = expenses.length > 0
        ? Math.round(total / expenses.length)
        : 0;

    document.getElementById("averageExpense").innerText =
        "₹" + average;

    let reportList =
        document.getElementById("reportList");

    reportList.innerHTML = "";

    if (Object.keys(categoryTotals).length === 0) {

        reportList.innerHTML =
            "<p>No expense data available.</p>";

        return;
    }

    Object.keys(categoryTotals).forEach(function(category) {

        let amount = categoryTotals[category];

        let percentage =
            total > 0 ? (amount / total) * 100 : 0;

        reportList.innerHTML += `

            <div class="report-item">

                <div>
                    <strong>${category}</strong>
                    <span>₹${amount}</span>
                </div>

                <div class="progress">
                    <div class="progress-bar"
                         style="width:${percentage}%">
                    </div>
                </div>

            </div>

        `;

    });
}