function GoalModal({
  show,
  goalForm,
  setGoalForm,
  editingGoal,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={editingGoal ? "Edit Goal" : "Create Goal"}>
      <form
        className="transaction-modal"
        onSubmit={onSubmit}
      >
        <h2>{editingGoal ? "Edit Goal" : "Create Goal"}</h2>

        <input
          type="text"
          placeholder="Goal title"
          value={goalForm.title}
          onChange={(e) =>
            setGoalForm({
              ...goalForm,
              title: e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Target amount"
          value={
            goalForm.target_amount
          }
          onChange={(e) =>
            setGoalForm({
              ...goalForm,
              target_amount:
                e.target.value,
            })
          }
          required
        />

        <input
          type="number"
          placeholder="Current saved amount"
          value={
            goalForm.current_amount
          }
          onChange={(e) =>
            setGoalForm({
              ...goalForm,
              current_amount:
                e.target.value,
            })
          }
        />

        <input
          type="date"
          value={goalForm.deadline}
          onChange={(e) =>
            setGoalForm({
              ...goalForm,
              deadline:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="modal-submit-btn"
        >
          {editingGoal ? "Save Changes" : "Save Goal"}
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

export default GoalModal;