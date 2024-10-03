document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById('expenseForm');
  const expenseTable = document.getElementById('expenseTable').getElementsByTagName('tbody')[0];
  const totalAmountDisplay = document.getElementById('totalAmount');
  let expenses = [];
  let totalAmount = 0;

  // Load expenses from local storage
  if (localStorage.getItem('expenses')) {
      expenses = JSON.parse(localStorage.getItem('expenses'));
      renderExpenses();
  }

  // Add new expense
  expenseForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const date = document.getElementById('date').value;
      const description = document.getElementById('description').value;
      const category = document.getElementById('category').value;
      const amount = parseFloat(document.getElementById('amount').value).toFixed(2);

      const expense = { date, description, category, amount };
      expenses.push(expense);

      saveAndRender();
      expenseForm.reset();
  });

  // Render the expense table
  function renderExpenses() {
      expenseTable.innerHTML = "";
      totalAmount = 0;
      
      expenses.forEach((expense, index) => {
          const row = expenseTable.insertRow();

          row.innerHTML = `
              <td>${expense.date}</td>
              <td>${expense.description}</td>
              <td>${expense.category}</td>
              <td>$${expense.amount}</td>
              <td>
                  <button onclick="deleteExpense(${index})">Delete</button>
              </td>
          `;

          totalAmount += parseFloat(expense.amount);
      });

      totalAmountDisplay.textContent = totalAmount.toFixed(2);
      updateChart();
  }

  // Save expenses to local storage
  function saveAndRender() {
      localStorage.setItem('expenses', JSON.stringify(expenses));
      renderExpenses();
  }

  // Delete expense
  window.deleteExpense = (index) => {
      expenses.splice(index, 1);
      saveAndRender();
  };

  // Create Chart
  const ctx = document.getElementById('expenseChart').getContext('2d');
  let chart;

  function updateChart() {
      const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];
      const categoryTotals = categories.map(category => {
          return expenses
              .filter(expense => expense.category === category)
              .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      });

      if (chart) {
          chart.destroy();
      }

      chart = new Chart(ctx, {
          type: 'pie',
          data: {
              labels: categories,
              datasets: [{
                  data: categoryTotals,
                  backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
              }]
          }
      });
  }
});
