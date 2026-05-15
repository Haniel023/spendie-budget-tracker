const ALERT_ICONS = {
  danger: "⚠️",
  warning: "🔔",
  info: "💡",
  goal: "🎯",
  success: "🎉",
};

const ALERT_CLASSES = {
  danger: "alert-card danger-alert",
  warning: "alert-card warning-alert",
  info: "alert-card info-alert",
  goal: "alert-card goal-alert",
  success: "alert-card success-alert",
};

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
              className={ALERT_CLASSES[alert.type] ?? "alert-card"}
            >
              <div className="alert-icon">
                {ALERT_ICONS[alert.type] ?? "💡"}
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
