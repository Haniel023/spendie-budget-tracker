function TransactionModal({
  show,
  editingTransaction,
  transactionForm,
  setTransactionForm,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={editingTransaction ? "Edit Transaction" : "Add Transaction"}>
      <form
        className="transaction-modal"
        onSubmit={onSubmit}
      >
        <h2>
          {editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"}
        </h2>

        <select
          value={transactionForm.type}
          onChange={(e) =>
            setTransactionForm({
              ...transactionForm,
              type: e.target.value,
            })
          }
        >
          <option value="expense">
            Expense
          </option>

          <option value="income">
            Income
          </option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={transactionForm.amount}
          onChange={(e) =>
            setTransactionForm({
              ...transactionForm,
              amount: e.target.value,
            })
          }
          required
        />

        <select
          value={transactionForm.category}
          onChange={(e) =>
            setTransactionForm({
              ...transactionForm,
              category: e.target.value,
            })
          }
          required
        >
          <option value="">
            Select Category
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Transportation">
            Transportation
          </option>

          <option value="Salary">
            Salary
          </option>

          <option value="Bills">
            Bills
          </option>

          <option value="Shopping">
            Shopping
          </option>

          <option value="Games">
            Games
          </option>

          <option value="Savings">
            Savings
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={
            transactionForm.description
          }
          onChange={(e) =>
            setTransactionForm({
              ...transactionForm,
              description:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="modal-submit-btn"
        >
          {editingTransaction
            ? "Save Changes"
            : "Save Transaction"}
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

export default TransactionModal;