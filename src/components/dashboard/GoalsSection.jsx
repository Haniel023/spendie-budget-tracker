import { Plus, Pencil, Trash2 } from "lucide-react";

function GoalsSection({
  goals,
  onCreateGoal,
  onEditGoal,
  onDeleteGoal,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Savings Goals</h2>

          <p>
            Track your financial goals
          </p>
        </div>

        <button
          className="small-add-btn"
          onClick={onCreateGoal}
        >
          <Plus size={16} />
          Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            🎯
          </div>

          <h3>No goals yet</h3>

          <p>
            Create your first savings
            goal.
          </p>
        </div>
      ) : (
        <div className="budget-list">
          {goals.map((goal) => {
            const percentage =
              Math.min(
                (goal.current_amount /
                  goal.target_amount) *
                100,
                100
              );

            const completed =
              goal.current_amount >=
              goal.target_amount;

            return (
              <div
                className="budget-card"
                key={goal.id}
              >
                <div className="goal-card-header">
                  <div className="goal-info">
                    <h3>{goal.title}</h3>

                    <p>
                      ₱{Number(goal.current_amount).toFixed(2)} / ₱
                      {Number(goal.target_amount).toFixed(2)}
                    </p>

                    {goal.deadline && (
                      <small className="muted-text">
                        Goal Date: {goal.deadline}
                      </small>
                    )}
                  </div>

                  <div className="card-actions-row">
                    {completed && <span className="warning-badge">Completed</span>}

                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => onEditGoal(goal)}>
                        <Pencil size={15} />
                      </button>

                      <button className="delete-btn" onClick={() => onDeleteGoal(goal.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default GoalsSection;