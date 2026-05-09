import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import AnalyticsSummary from "./AnalyticsSummary";
import TopCategories from "./TopCategories";

function AnalyticsSection({
  transactions,
  expenseByCategory,
  incomeExpenseData,
  activeSpace,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Analytics</h2>
          <p>
            Spending overview for {activeSpace?.name}
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            📊
          </div>

          <h3>No analytics yet</h3>

          <p>
            Add transactions to generate
            charts.
          </p>
        </div>
      ) : (
        <div className="analytics-grid">
          <AnalyticsSummary
            transactions={transactions}
          />

          <TopCategories
            transactions={transactions}
          />
          <div className="chart-card">
            <h3>Expense Breakdown</h3>

            {expenseByCategory.length ===
              0 ? (
              <p className="muted-text">
                No expenses yet.
              </p>
            ) : (
              <div className="mobile-chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={75}
                      label
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => `₱${Number(value).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="chart-card">
            <h3>
              Income vs Expenses
            </h3>

            <div className="mobile-chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeExpenseData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₱${Number(value).toFixed(2)}`} />

                  <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                    {incomeExpenseData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.name === "Income" ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AnalyticsSection;