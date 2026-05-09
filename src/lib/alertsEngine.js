export const generateSmartAlerts = ({ summary, budgets, transactions }) => {
  const generatedAlerts = [];

  if (summary.balance < 0) {
    generatedAlerts.push({
      type: "danger",
      message: "Your balance is negative.",
    });
  }

  budgets.forEach((budget) => {
    const spent = transactions
      .filter(
        (item) =>
          item.type === "expense" && item.category === budget.category
      )
      .reduce((total, item) => total + Number(item.amount), 0);

    const limit = Number(budget.monthly_limit);
    const percentage = (spent / limit) * 100;

    if (spent > limit) {
      generatedAlerts.push({
        type: "danger",
        message: `${budget.category} exceeded budget by ₱${(
          spent - limit
        ).toFixed(2)}`,
      });
    } else if (percentage >= 80) {
      generatedAlerts.push({
        type: "warning",
        message: `${budget.category} is at ${percentage.toFixed(0)}% of budget`,
      });
    }
  });

  return generatedAlerts;
};