function InviteModal({
  show,
  inviteEmail,
  setInviteEmail,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <form className="transaction-modal" onSubmit={onSubmit}>
        <h2>Invite Member</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          required
        />

        <button type="submit" className="primary-btn">
          Send Invite
        </button>

        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default InviteModal;