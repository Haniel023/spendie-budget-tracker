function OverviewStats({
  summary,
  goals,
  budgets,
  alerts,
}) {
  const completedGoals =
    goals.filter(
      (goal) =>
        Number(
          goal.current_amount
        ) >=
        Number(goal.target_amount)
    ).length;

  const criticalBudgets =
    alerts.filter(
      (alert) =>
        alert.type === "danger"
    ).length;

  return (
    <section className="overview-grid">
      <div className="overview-widget">
        <span>💰</span>

        <div>
          <p>Total Balance</p>

          <h3>
            ₱
            {summary.balance.toFixed(
              2
            )}
          </h3>
        </div>
      </div>

      <div className="overview-widget">
        <span>🎯</span>

        <div>
          <p>Goals Completed</p>

          <h3>
            {completedGoals}
          </h3>
        </div>
      </div>

      <div className="overview-widget">
        <span>⚠</span>

        <div>
          <p>Critical Alerts</p>

          <h3>
            {
              criticalBudgets
            }
          </h3>
        </div>
      </div>

      <div className="overview-widget">
        <span>📊</span>

        <div>
          <p>Budgets Active</p>

          <h3>
            {budgets.length}
          </h3>
        </div>
      </div>
    </section>
  );
}

export default OverviewStats;