function DashboardTabs({ activeTab, setActiveTab }) {
const tabs = [
  {
    id: "overview",
    label: "Overview",
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
    <div className="dashboard-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;