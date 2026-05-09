function RecentActivity({ transactions }) {
  const recent = transactions.slice(0, 3);

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Recent Activity</h2>
          <p>Latest money movement</p>
        </div>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No activity yet</h3>
          <p>Your latest transactions will appear here.</p>
        </div>
      ) : (
        <div className="activity-list">
          {recent.map((item) => (
            <div className="activity-item" key={item.id}>
              <div>
                <h3>{item.category}</h3>
                <p>{item.description || "No description"}</p>
              </div>

              <strong className={item.type === "income" ? "money-in" : "money-out"}>
                {item.type === "income" ? "+" : "-"}₱
                {Number(item.amount).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentActivity;