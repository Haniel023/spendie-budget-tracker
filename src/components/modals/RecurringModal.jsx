function RecurringModal({
  show,
  recurringForm,
  setRecurringForm,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <form className="transaction-modal" onSubmit={onSubmit}>
        <h2>Create Recurring Transaction</h2>

        <select
          value={recurringForm.type}
          onChange={(e) =>
            setRecurringForm({
              ...recurringForm,
              type: e.target.value,
            })
          }
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={recurringForm.amount}
          onChange={(e) =>
            setRecurringForm({
              ...recurringForm,
              amount: e.target.value,
            })
          }
          required
        />

        <select
          value={recurringForm.category}
          onChange={(e) =>
            setRecurringForm({
              ...recurringForm,
              category: e.target.value,
            })
          }
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Salary">Salary</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Games">Games</option>
          <option value="Savings">Savings</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={recurringForm.description}
          onChange={(e) =>
            setRecurringForm({
              ...recurringForm,
              description: e.target.value,
            })
          }
        />

        <select
          value={recurringForm.frequency}
          onChange={(e) =>
            setRecurringForm({
              ...recurringForm,
              frequency: e.target.value,
            })
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="semi_monthly">Semi-Monthly</option>
        </select>

        {recurringForm.frequency === "semi_monthly" && (
          <div className="two-column-inputs">
            <input
              type="number"
              placeholder="First day e.g. 15"
              value={recurringForm.recurring_day_1}
              onChange={(e) =>
                setRecurringForm({
                  ...recurringForm,
                  recurring_day_1: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Second day e.g. 30"
              value={recurringForm.recurring_day_2}
              onChange={(e) =>
                setRecurringForm({
                  ...recurringForm,
                  recurring_day_2: e.target.value,
                })
              }
              required
            />
          </div>
        )}

        <button type="submit" className="modal-submit-btn">
          Save Recurring
        </button>

        <button type="button" className="modal-cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default RecurringModal;