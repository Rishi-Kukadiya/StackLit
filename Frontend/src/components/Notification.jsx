import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationBell() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.length;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    console.log(notifications);

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // NotificationMessage.jsx
  const renderNotificationMessage = (notification) => {
    const { type, sender, question, answer } = notification;
    console.log(type,sender,question,answer);
    

    const senderName = sender?.fullName || "Someone";
    const shortAnswerPreview = answer?.content
      ? `${stripHtml(answer.content).slice(0, 30)}...`
      : "";

    switch (type) {
      case "like":
        if (answer)
          return `${senderName} liked your answer: ${shortAnswerPreview}`;
        if (question)
          return `${senderName} liked your question: ${question.title}`;
        return `${senderName} liked your post`;

      case "dislike":
        if (answer)
          return `${senderName} disliked your answer: ${shortAnswerPreview}`;
        if (question)
          return `${senderName} disliked your question: ${question.title}`;
        return `${senderName} disliked your post`;

      case "answer":
        return `${senderName} answered your question: ${question?.title || ""}`;

      default:
        return `${senderName} sent you a notification`;
    }
  };

  // Helper to strip HTML from content
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden text-sm m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b">
              <h3 className="text-indigo-800 font-semibold text-base">
                Notifications
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    markAllAsRead();
                    setOpen(false);
                  }}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                You have no new notifications.
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar divide-y">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="flex gap-3 px-4 py-3 items-start hover:bg-indigo-50 transition"
                  >
                    <img
                      src={n.sender?.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        {console.log(n)
                        }
                        {renderNotificationMessage(n)}
                      </p>

                      {n.question?.title && (
                        <p className="text-xs text-gray-600 mt-1 italic line-clamp-1">
                          {n.question.title}
                        </p>
                      )}

                      {n.answer?.content && (
                        <p
                          className="text-xs text-gray-600 mt-1"
                          dangerouslySetInnerHTML={{
                            __html:
                              n.answer.content.length > 100
                                ? n.answer.content.slice(0, 100) + "..."
                                : n.answer.content,
                          }}
                        />
                      )}

                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt))} ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
