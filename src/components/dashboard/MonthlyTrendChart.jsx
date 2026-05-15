import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function MonthlyTrendChart({ transactions }) {
  const grouped = {};

  transactions.forEach((item) => {
    const date = new Date(item.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", { month: "short" }) + " '" + String(year).slice(2);

    if (!grouped[key]) {
      grouped[key] = { key, label, income: 0, expenses: 0 };
    }

    if (item.type === "income") {
      grouped[key].income += Number(item.amount);
    } else {
      grouped[key].expenses += Number(item.amount);
    }
  });

  const chartData = Object.keys(grouped)
    .sort()
    .map((k) => ({ month: grouped[k].label, income: grouped[k].income, expenses: grouped[k].expenses }));

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Monthly Trends</h2>
          <p>Income vs expense flow</p>
        </div>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <div className="mobile-chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₱${Number(value).toFixed(2)}`} />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default MonthlyTrendChart;
