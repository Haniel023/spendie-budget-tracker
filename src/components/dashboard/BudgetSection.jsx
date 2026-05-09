import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryConfig } from "../../lib/categoryConfig";

function BudgetSection({
  budgets,
  transactions,
  onCreateBudget,
  onEditBudget,
  onDeleteBudget,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Budget Limits</h2>
          <p>Monthly category spending limits</p>
        </div>

        <button className="small-add-btn" onClick={onCreateBudget}>
          <Plus size={16} />
          Budget
        </button>
      </div>

      <div className="budget-list">
        {budgets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No budgets yet</h3>
            <p>Create monthly spending limits.</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const spent = transactions
              .filter(
                (item) =>
                  item.type === "expense" && item.category === budget.category
              )
              .reduce((total, item) => total + Number(item.amount), 0);

            const limit = Number(budget.monthly_limit);
            const percentage = limit ? Math.min((spent / limit) * 100, 100) : 0;
            const exceeded = spent > limit;

            return (
              <div className="budget-card" key={budget.id}>
                <div className="budget-top">
                  <div className="transaction-category">
                    <div
                      className="category-icon"
                      style={{
                        background:
                          categoryConfig[budget.category]?.color || "#6b7280",
                      }}
                    >
                      {categoryConfig[budget.category]?.icon || "✨"}
                    </div>

                    <div>
                      <h3>{budget.title || budget.category}</h3>
                      <p>
                        ₱{spent.toFixed(2)} / ₱{limit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="card-actions-row">
                    {exceeded && <span className="warning-badge">Exceeded</span>}

                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => onEditBudget(budget)}>
                        <Pencil size={15} />
                      </button>

                      <button className="delete-btn" onClick={() => onDeleteBudget(budget.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="progress-bar">
                  <div
                    className={
                      exceeded ? "progress-fill exceeded" : "progress-fill"
                    }
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default BudgetSection;