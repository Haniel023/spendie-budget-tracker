import { Bell } from "lucide-react";
import { useEffect, useRef } from "react";

function NotificationBell({
  notifications,
  showNotifications,
  setShowNotifications,
  markNotificationsAsRead,
}) {
  const wrapperRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    if (!showNotifications) return;

    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, setShowNotifications]);

  const ICONS = {
    danger: "⚠️",
    warning: "🔔",
    goal: "🎯",
    success: "🎉",
    info: "💡",
  };

  return (
    <div className="notification-wrapper" ref={wrapperRef}>
      <button
        className="icon-btn"
        aria-label="Notifications"
        onClick={async () => {
          const nextState = !showNotifications;
          setShowNotifications(nextState);
          if (nextState) {
            await markNotificationsAsRead();
          }
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <div className="notification-panel" role="dialog" aria-label="Notifications panel">
          <h3>Notifications</h3>

          {notifications.length === 0 ? (
            <p className="muted-text">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${notification.type}`}
              >
                <div className="notification-icon">
                  {ICONS[notification.type] ?? "💡"}
                </div>

                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.created_at).toLocaleString()}</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
