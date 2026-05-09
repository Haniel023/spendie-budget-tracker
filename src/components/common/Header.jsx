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

        <button className="icon-btn" onClick={onToggleDarkMode}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button className="icon-btn danger" onClick={onLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;