function AlertSection({ alerts }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Smart Alerts</h2>
          <p>Financial warnings and insights</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎉</div>
          <h3>No alerts</h3>
          <p>Everything looks healthy right now.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={
                alert.type === "danger"
                  ? "alert-card danger-alert"
                  : "alert-card warning-alert"
              }
            >
              <div className="alert-icon">
                {alert.type === "danger" ? "⚠" : "🔔"}
              </div>

              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AlertSection;