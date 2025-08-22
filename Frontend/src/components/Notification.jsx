import React, { useState, useRef, useEffect } from "react";
import { Bell, X, Circle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationBell() {
  const { notifications, markAllAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Correctly calculates only unread notifications for the badge
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Effect to close the dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Helper to strip HTML from content for previews (from incoming change)
  const stripHtml = (html) => {
    if (typeof document === "undefined") return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Renders detailed notification messages (from incoming change)
  const renderNotificationMessage = (notification) => {
    const { type, sender, question, answer } = notification;
    const senderName = (
      <b className="font-semibold text-neutral-100">
        {sender?.fullName || "Someone"}
      </b>
    );
    const shortAnswerPreview = answer?.content
      ? `"${stripHtml(answer.content).slice(0, 30)}..."`
      : "";
    const questionTitle = question?.title ? `"${question.title}"` : "";

    switch (type) {
      case "like":
        if (answer)
          return (
            <>
              {senderName} liked your answer: {shortAnswerPreview}
            </>
          );
        if (question)
          return (
            <>
              {senderName} liked your question: {questionTitle}
            </>
          );
        return <>{senderName} liked your post</>;
      case "dislike":
        if (answer)
          return (
            <>
              {senderName} disliked your answer: {shortAnswerPreview}
            </>
          );
        if (question)
          return (
            <>
              {senderName} disliked your question: {questionTitle}
            </>
          );
        return <>{senderName} disliked your post</>;
      case "answer":
        return (
          <>
            {senderName} answered your question: {questionTitle}
          </>
        );
      case "relatedAnswer":
        return (
          <>
            {senderName} also answered a question you answered: {questionTitle}
          </>
        );
      default:
        return <>{senderName} sent you a notification</>;
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      {/* Bell Icon Button (Your UI) */}
      <button
        onClick={() => setNotifOpen((v) => !v)}
        className="relative bg-white/20 backdrop-blur-sm p-2 rounded-full text-white/80 hover:text-white"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown (Your UI Theme) */}
      {notifOpen && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 rounded-lg z-50 overflow-hidden bg-[#1A1A1A] border border-[#433D8B] shadow-[0_0_25px_rgba(200,172,214,0.15)]">
          {/* Dropdown Header (Your UI) */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#433D8B]/70">
            <h3 className="font-semibold text-neutral-100">Notifications</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#c6c3c3] hover:text-white hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setNotifOpen(false)}
                className="text-neutral-500 hover:text-neutral-200"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notification List (Combined UI and Logic) */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              You're all caught up!
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#433D8B] hover:scrollbar-thumb-[#C8ACD6]/50 scrollbar-track-transparent">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex gap-3 px-4 py-3 transition duration-200 border-b border-[#433D8B]/70 last:border-b-0 ${
                    n.isRead
                      ? "bg-transparent hover:bg-[#433D8B]/40"
                      : "bg-amber-400/10"
                  }`}
                >
                  {!n.isRead && (
                    <div className="w-2.5 pt-1.5">
                      <Circle className="w-2 h-2 text-amber-400 fill-current" />
                    </div>
                  )}
                  <img
                    src={
                      n.sender?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        n.sender?.fullName || "?"
                      )}`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className={`flex-1 ${!n.isRead ? "pl-0" : "pl-3.5"}`}>
                    <p className="text-sm text-neutral-300">
                      {renderNotificationMessage(n)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {formatDistanceToNow(new Date(n.createdAt))} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}