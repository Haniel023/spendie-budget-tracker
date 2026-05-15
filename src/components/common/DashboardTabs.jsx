import { NAV_TABS } from "../../lib/constants";

function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <div className="dashboard-tabs">
      {NAV_TABS.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? "tab-btn active-tab" : "tab-btn"}
          onClick={() => setActiveTab(tab.id)}
          aria-label={tab.label}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default DashboardTabs;
