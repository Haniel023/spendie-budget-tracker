import { Plus } from "lucide-react";

function FloatingAddButton({
  label,
  onClick,
}) {
  return (
    <button
      className="floating-add"
      onClick={onClick}
    >
      <Plus size={24} />

      <span>{label}</span>
    </button>
  );
}

export default FloatingAddButton;