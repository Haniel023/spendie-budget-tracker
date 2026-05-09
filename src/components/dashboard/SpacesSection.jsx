import { Plus, Trash2 } from "lucide-react";

function SpacesSection({
  spaces,
  activeSpace,
  onSelectSpace,
  onCreateSpace,
  onDeleteSpace,
}) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Spaces</h2>
          <p>Switch between personal and shared budgets</p>
        </div>
        
        <div className="header-actions">
          {activeSpace?.type !== "personal" && (
            <button
              className="danger-action-btn"
              onClick={() => onDeleteSpace(activeSpace.id)}
            >
              Delete Space
            </button>
          )}

          <button className="small-add-btn" onClick={onCreateSpace}>
            <Plus size={16} />
            Space
          </button>
        </div>
      </div>

      <div className="space-pills">
        {spaces.map((space) => (
          <button
            key={space.id}
            className={
              activeSpace?.id === space.id ? "space-pill active" : "space-pill"
            }
            onClick={() => onSelectSpace(space)}
          >
            {space.emoji || "💰"} {space.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default SpacesSection;