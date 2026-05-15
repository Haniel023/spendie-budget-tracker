import { LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";

function Header({
  displayName,
  darkMode,
  onToggleDarkMode,
  onLogout,
  notifications,
  showNotifications,
  setShowNotifications,
  markNotificationsAsRead,
}) {
  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">Hello, {displayName} 👋</p>
        <h1>Welcome to Spendie</h1>
      </div>

      <div className="top-actions">
        <NotificationBell
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          markNotificationsAsRead={
            markNotificationsAsRead
          }
        />

        <button
          className="icon-btn"
          onClick={onToggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button className="icon-btn danger" onClick={onLogout} aria-label="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;