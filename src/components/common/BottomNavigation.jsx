function BottomNavigation({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      id: "overview",
      label: "Home",
      icon: "🏠",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "💸",
    },
    {
      id: "planning",
      label: "Planning",
      icon: "🎯",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📊",
    },
    {
      id: "people",
      label: "People",
      icon: "👥",
    },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={
            activeTab === tab.id
              ? "bottom-nav-btn active-bottom-tab"
              : "bottom-nav-btn"
          }
          onClick={() =>
            setActiveTab(tab.id)
          }
        >
          <span>{tab.icon}</span>

          <small>
            {tab.label}
          </small>
        </button>
      ))}
    </nav>
  );
}

export default BottomNavigation;