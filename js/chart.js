let cashChart = null;

function renderChart() {
    const transactions = getUserTransactions();
    const canvas = document.getElementById("cashChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (cashChart) {
        cashChart.destroy();
    }

    if (transactions.length === 0) {
        cashChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Income",
                        data: [],
                        backgroundColor: "#16a34a"
                    },
                    {
                        label: "Expense",
                        data: [],
                        backgroundColor: "#dc2626"
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        return;
    }

    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const groupedData = {};
    transactions.forEach(transaction => {

        if (!groupedData[transaction.date]) {
            groupedData[transaction.date] = {
                income: 0,
                expense: 0
            };
        }

        if (transaction.type === "income") {
            groupedData[transaction.date].income += Number(transaction.amount);
        } else {
            groupedData[transaction.date].expense += Number(transaction.amount);
        }
    });

    const labels = Object.keys(groupedData).map(date => {
        const d = new Date(date);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    });

    const incomeData = Object.values(groupedData).map(item => item.income);
    const expenseData = Object.values(groupedData).map(item => item.expense);
    cashChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    backgroundColor: "#16a34a",
                    borderRadius: 8,
                    barThickness: 150
                },

                {
                    label: "Expense",
                    data: expenseData,
                    backgroundColor: "#dc2626",
                    borderRadius: 8,
                    barThickness: 150
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 800
            },

            plugins: {
                legend: {
                    position: "top"
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}