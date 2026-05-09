import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryConfig } from "../../lib/categoryConfig";

function TransactionsSection({
  transactions,
  activeSpace,
  onAdd,
  onRecurring,
  onEdit,
  onDelete,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Recent Transactions</h2>
          <p>Viewing: {activeSpace?.name}</p>
        </div>

        <div className="header-actions">
          <button className="small-add-btn" onClick={onAdd}>
            <Plus size={16} />
            Add
          </button>

          <button className="small-add-btn recurring-btn" onClick={onRecurring}>
            🔁 Recurring
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No transactions yet</h3>
          <p>Add your first income or expense to start tracking.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((item) => (
            <div className="transaction-item" key={item.id}>
              <div>
                <div className="transaction-category">
                  <div
                    className="category-icon"
                    style={{
                      background:
                        categoryConfig[item.category]?.color || "#6b7280",
                    }}
                  >
                    {categoryConfig[item.category]?.icon || "✨"}
                  </div>

                  <h3>{item.category}</h3>
                </div>

                <p>{item.description || "No description"}</p>

                <small className="added-by">
                  Added by {item.profiles?.full_name || "Unknown"}
                </small>
              </div>

              <div className="transaction-actions">
                <strong
                  className={item.type === "income" ? "money-in" : "money-out"}
                >
                  {item.type === "income" ? "+" : "-"}₱
                  {Number(item.amount).toFixed(2)}
                </strong>

                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(item)}>
                    <Pencil size={15} />
                  </button>

                  <button className="delete-btn" onClick={() => onDelete(item.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default TransactionsSection;