export const generateInsights = ({ transactions, budgets, goals, summary }) => {
  const insights = [];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = transactions.filter((item) => {
    const d = new Date(item.created_at);
    return (
      item.type === "expense" &&
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  // TOP EXPENSE CATEGORY
  const expenseMap = {};
  thisMonthExpenses.forEach((item) => {
    expenseMap[item.category] = (expenseMap[item.category] || 0) + Number(item.amount);
  });

  const topCategory = Object.entries(expenseMap).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      type: "info",
      message: `Your highest spending category this month is ${topCategory[0]} at ₱${topCategory[1].toFixed(2)}.`,
    });
  }

  // LOW BALANCE
  if ((summary.balance ?? 0) < 1000) {
    insights.push({
      type: "warning",
      message: "Your remaining balance is below ₱1000.",
    });
  }

  // GOAL INSIGHTS
  goals.forEach((goal) => {
    const remaining = Number(goal.target_amount) - Number(goal.current_amount);

    if (remaining > 0 && goal.deadline) {
      const today = new Date();
      const deadline = new Date(goal.deadline);
      const rawMonths = (deadline - today) / (1000 * 60 * 60 * 24 * 30);
      const monthsRemaining = Math.max(parseFloat(rawMonths.toFixed(1)), 1);
      const neededPerMonth = remaining / monthsRemaining;

      insights.push({
        type: "goal",
        message: `You need ₱${neededPerMonth.toFixed(2)}/month to reach ${goal.title}.`,
      });
    }
  });

  // BUDGET INSIGHTS (current month only)
  budgets.forEach((budget) => {
    const spent = thisMonthExpenses
      .filter((item) => item.category === budget.category)
      .reduce((total, item) => total + Number(item.amount), 0);

    const limit = Number(budget.monthly_limit);
    if (limit <= 0) return;

    const percentage = (spent / limit) * 100;
    if (percentage >= 90) {
      insights.push({
        type: "danger",
        message: `${budget.category} is critically near its budget limit this month.`,
      });
    }
  });

  return insights;
};
