// import React, { useState } from "react";
// import { useNotifications } from "../contexts/NotificationContext";
// import { Bell } from "lucide-react";

// export default function NotificationBell() {
//   const { notifications, markAllAsRead } = useNotifications();
//   const [open, setOpen] = useState(false);
//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return (
//     <div className="relative z-50">
//       {/* Bell Icon */}
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative p-2 rounded-full hover:bg-indigo-100 transition-all duration-200"
//       >
//         <Bell className="w-6 h-6 text-white md:text-indigo-300" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-semibold px-1 py-0.5 rounded-full animate-pulse">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {open && (
//         <div className="absolute top-12 right-0 w-80 max-h-[400px] bg-white shadow-2xl border border-gray-200 rounded-xl overflow-hidden text-sm">
//           <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b">
//             <h3 className="text-indigo-800 font-semibold text-base">
//               Notifications
//             </h3>
//             <button
//               onClick={markAllAsRead}
//               className="text-indigo-600 text-sm hover:underline"
//             >
//               Mark all as read
//             </button>
//           </div>

//           {notifications.length === 0 ? (
//             <div className="p-4 text-center text-gray-500">
//               No notifications
//             </div>
//           ) : (
//             <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
//               {notifications.map((n) => (
//                 <div
//                   key={n._id}
//                   className={`px-4 py-3 border-b cursor-pointer transition duration-150 hover:bg-indigo-50 ${
//                     n.isRead ? "bg-white" : "bg-indigo-100"
//                   }`}
//                 >
//                   <p className="text-gray-900 font-medium">
//                     {n.sender?.fullName || "Someone"}{" "}
//                     <span className="font-normal text-gray-700">
//                       {n.type === "like"
//                         ? "liked your question"
//                         : n.type === "answer"
//                         ? "answered your question"
//                         : "sent you a notification"}
//                     </span>
//                   </p>
//                   {n.question?.title && (
//                     <p className="text-gray-600 text-xs italic line-clamp-1">
//                       {n.question.title}
//                     </p>
//                   )}
//                   <p className="text-[11px] text-gray-400 mt-1">
//                     {new Date(n.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









import React, { useState, useEffect } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { Bell, X } from "lucide-react";

export default function NotificationBell() {
  const { notifications, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Effect to prevent body scroll when the modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup function to restore scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setOpen(true)} // Always set to true to open the modal
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
        // 1. Full-screen overlay with a semi-transparent background
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
          onClick={() => setOpen(false)} // Close modal on overlay click
        >
          {/* 2. Modal content container */}
          <div
            className="relative w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden text-sm m-4"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 border-b">
              <h3 className="text-indigo-800 font-semibold text-base">
                Notifications
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={markAllAsRead}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Mark all as read
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-800"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                You have no new notifications.
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`px-4 py-3 border-b cursor-pointer transition duration-150 hover:bg-indigo-50 ${
                      n.isRead ? "bg-white" : "bg-indigo-100"
                    }`}
                  >
                    <p className="text-gray-900 font-medium">
                      {n.sender?.fullName || "Someone"}{" "}
                      <span className="font-normal text-gray-700">
                        {n.type === "like"
                          ? "liked your question"
                          : n.type === "answer"
                          ? "answered your question"
                          : "sent you a notification"}
                      </span>
                    </p>
                    {n.question?.title && (
                      <p className="text-gray-600 text-xs italic line-clamp-1 mt-1">
                        {n.question.title}
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
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