const INSIGHT_ICONS = {
  danger: "⚠️",
  warning: "⚠️",
  goal: "🎯",
  info: "💡",
  success: "🎉",
};

const INSIGHT_CLASSES = {
  danger: "alert-card danger-alert",
  warning: "alert-card warning-alert",
  goal: "alert-card goal-alert",
  info: "alert-card info-alert",
  success: "alert-card success-alert",
};

function InsightsSection({ insights }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Smart Insights</h2>
          <p>AI-style financial analysis</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧠</div>
          <h3>No insights yet</h3>
          <p>Add more financial data to generate insights.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={INSIGHT_CLASSES[insight.type] ?? "alert-card"}
            >
              <div className="alert-icon">
                {INSIGHT_ICONS[insight.type] ?? "🧠"}
              </div>
              <p>{insight.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default InsightsSection;
