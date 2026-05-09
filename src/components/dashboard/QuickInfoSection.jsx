function QuickInfoSection({
  activeSpace,
}) {
  return (
    <section className="quick-grid">
      <div className="mini-card">
        <p>Current Space</p>

        <h3>
          {activeSpace?.name ||
            "No Space"}
        </h3>
      </div>

      <div className="mini-card">
        <p>Space Type</p>

        <h3>
          {activeSpace?.type || "-"}
        </h3>
      </div>
    </section>
  );
}

export default QuickInfoSection;