import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function MonthlyTrendChart({
  transactions,
}) {
  const grouped = {};

  transactions.forEach((item) => {
    const date = new Date(
      item.created_at
    );

    const month =
      date.toLocaleString(
        "default",
        {
          month: "short",
        }
      );

    if (!grouped[month]) {
      grouped[month] = {
        month,
        income: 0,
        expenses: 0,
      };
    }

    if (item.type === "income") {
      grouped[month].income +=
        Number(item.amount);
    } else {
      grouped[month].expenses +=
        Number(item.amount);
    }
  });

  const chartData =
    Object.values(grouped);

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>
            Monthly Trends
          </h2>

          <p>
            Income vs expense flow
          </p>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <div className="mobile-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₱${Number(value).toFixed(2)}`} />

              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
              />

              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default MonthlyTrendChart;