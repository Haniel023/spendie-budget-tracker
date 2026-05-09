import { Bell } from "lucide-react";

function NotificationBell({
    notifications,
    showNotifications,
    setShowNotifications,
    markNotificationsAsRead,
}) {
    const unreadCount =
        notifications.filter(
            (n) => !n.is_read
        ).length;

    return (
        <div className="notification-wrapper">
            <button
                className="icon-btn"
                onClick={async () => {
                    const nextState =
                        !showNotifications;

                    setShowNotifications(
                        nextState
                    );

                    if (nextState) {
                        await markNotificationsAsRead();
                    }
                }}
            >
                <Bell size={18} />

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="notification-panel">
                    <h3>Notifications</h3>

                    {notifications.length ===
                        0 ? (
                        <p className="muted-text">
                            No notifications yet.
                        </p>
                    ) : (
                        notifications.map((notification) => {
                            const icon =
                                notification.type === "danger"
                                    ? "⚠️"
                                    : notification.type === "warning"
                                        ? "🔔"
                                        : notification.type === "goal"
                                            ? "🎯"
                                            : notification.type === "success"
                                                ? "🎉"
                                                : "💡";

                            return (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.type}`}
                                >
                                    <div className="notification-icon">
                                        {icon}
                                    </div>

                                    <div>
                                        <strong>
                                            {notification.title}
                                        </strong>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <small>
                                            {new Date(
                                                notification.created_at
                                            ).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;