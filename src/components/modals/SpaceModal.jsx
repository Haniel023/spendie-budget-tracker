function SpaceModal({
  show,
  spaceName,
  setSpaceName,
  spaceEmoji,
  setSpaceEmoji,
  onSubmit,
  onClose,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Create Shared Space">
      <form
        className="transaction-modal"
        onSubmit={onSubmit}
      >
        <h2>Create Shared Space</h2>

        <input
          type="text"
          placeholder="e.g. Me & Juan"
          value={spaceName}
          onChange={(e) =>
            setSpaceName(e.target.value)
          }
          required
        />

        <div className="emoji-picker">
          {[
            "💰",
            "💕",
            "🏠",
            "✈️",
            "🎮",
            "🍔",
            "🚗",
            "🎯",
          ].map((emoji) => (
            <button
              type="button"
              key={emoji}
              className={
                spaceEmoji === emoji
                  ? "emoji-btn active-emoji"
                  : "emoji-btn"
              }
              onClick={() =>
                setSpaceEmoji(emoji)
              }
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="modal-submit-btn"
        >
          Create Space
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

export default SpaceModal;