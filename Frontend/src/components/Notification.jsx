import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationBell() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  // console.log(notifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)}>
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              color: "white",
              background: "red",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: "fixed", // <-- changed from "absolute"
            top: "60px", // <-- adjust as needed for your layout/header
            right: "-100px", // <-- adjust as needed for your layout
            // background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "320px",
            zIndex: 99999, // <-- much higher z-index
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
            <button onClick={markAllAsRead}>Mark all as read</button>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: "16px" }}>No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: "12px",
                  background: n.isRead ? "#f9f9f9" : "#e6f7ff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <b>{n.sender.fullName}</b>{" "}
                  {n.type === "like" ? "liked your question" : n.type}
                </div>
                <div>
                  <i>{n.question?.title}</i>
                </div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
