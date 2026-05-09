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
              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                    label
                  >
                    {expenseByCategory.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            entry.color
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(
                      value
                    ) =>
                      `₱${Number(
                        value
                      ).toFixed(2)}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="chart-card">
            <h3>
              Income vs Expenses
            </h3>

            <ResponsiveContainer
              width="100%"
              height={240}
            >
              <BarChart
                data={
                  incomeExpenseData
                }
              >
                <XAxis dataKey="name" />
                <YAxis />

                <Tooltip
                  formatter={(
                    value
                  ) =>
                    `₱${Number(
                      value
                    ).toFixed(2)}`
                  }
                />

                <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
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
      )}
    </section>
  );
}

export default AnalyticsSection;