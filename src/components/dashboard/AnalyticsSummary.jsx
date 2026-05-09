function AnalyticsSummary({
  transactions,
}) {
  const expenses =
    transactions.filter(
      (item) =>
        item.type === "expense"
    );

  const totalExpenses =
    expenses.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const averageSpend =
    expenses.length > 0
      ? totalExpenses /
        expenses.length
      : 0;

  const categoryMap = {};

  expenses.forEach((item) => {
    categoryMap[item.category] =
      (categoryMap[
        item.category
      ] || 0) +
      Number(item.amount);
  });

  const topCategory =
    Object.entries(categoryMap)
      .sort(
        (a, b) => b[1] - a[1]
      )[0];

  return (
    <section className="analytics-summary-grid">
      <div className="analytics-widget">
        <span>💸</span>

        <div>
          <p>Total Expenses</p>

          <h3>
            ₱
            {totalExpenses.toFixed(
              2
            )}
          </h3>
        </div>
      </div>

      <div className="analytics-widget">
        <span>📊</span>

        <div>
          <p>
            Average Spend
          </p>

          <h3>
            ₱
            {averageSpend.toFixed(
              2
            )}
          </h3>
        </div>
      </div>

      <div className="analytics-widget">
        <span>🔥</span>

        <div>
          <p>Top Category</p>

          <h3>
            {topCategory
              ? topCategory[0]
              : "None"}
          </h3>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsSummary;