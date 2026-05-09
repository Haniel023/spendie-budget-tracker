function BudgetModal({
  show,
  budgetForm,
  setBudgetForm,
  editingBudget,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <form className="transaction-modal" onSubmit={onSubmit}>
        <h2>{editingBudget ? "Edit Budget" : "Create Budget"}</h2>

        <input
          type="text"
          placeholder="Budget name e.g. H&M, Groceries, Shopee"
          value={budgetForm.title}
          onChange={(e) =>
            setBudgetForm({
              ...budgetForm,
              title: e.target.value,
            })
          }
          required
        />

        <select
          value={budgetForm.category}
          onChange={(e) =>
            setBudgetForm({
              ...budgetForm,
              category: e.target.value,
            })
          }
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">
            Transportation
          </option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Games">Games</option>
          <option value="Savings">Savings</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Monthly Limit"
          value={budgetForm.monthly_limit}
          onChange={(e) =>
            setBudgetForm({
              ...budgetForm,
              monthly_limit: e.target.value,
            })
          }
          required
        />

        <button type="submit" className="modal-submit-btn">
          {editingBudget ? "Save Changes" : "Save Budget"}
        </button>

        <button
          type="button"
          className="modal-cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default BudgetModal;