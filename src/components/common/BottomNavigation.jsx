import { NAV_TABS } from "../../lib/constants";

function BottomNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      {NAV_TABS.map((tab) => (
        <button
          key={tab.id}
          className={
            activeTab === tab.id
              ? "bottom-nav-btn active-bottom-tab"
              : "bottom-nav-btn"
          }
          onClick={() => setActiveTab(tab.id)}
          aria-label={tab.label}
        >
          <span>{tab.icon}</span>
          <small>{tab.mobileLabel}</small>
        </button>
      ))}
    </nav>
  );
}

export default BottomNavigation;
