function InsightsSection({
  insights,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>
            Smart Insights
          </h2>

          <p>
            AI-style financial
            analysis
          </p>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            🧠
          </div>

          <h3>No insights yet</h3>

          <p>
            Add more financial data
            to generate insights.
          </p>
        </div>
      ) : (
        <div className="alerts-list">
          {insights.map(
            (insight, index) => (
              <div
                key={index}
                className={
                  insight.type ===
                  "danger"
                    ? "alert-card danger-alert"
                    : insight.type ===
                      "warning"
                    ? "alert-card warning-alert"
                    : "alert-card"
                }
              >
                <div className="alert-icon">
                  {insight.type ===
                  "goal"
                    ? "🎯"
                    : insight.type ===
                      "warning"
                    ? "⚠"
                    : "🧠"}
                </div>

                <p>
                  {insight.message}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}

export default InsightsSection;