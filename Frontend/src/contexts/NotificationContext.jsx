// [CHANGED BY GITHUB COPILOT]
// Added null check for useUser() to prevent destructuring error
// Lines changed: 10-12

// filepath: e:\MERN-projects\stacklt\StackLit\Frontend\src\contexts\NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import { useUser } from "../Components/UserContext";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const userContext = useUser();
  const user = userContext?.user;

  // Fetch notifications on mount
  useEffect(() => {
    if (!user?.user?._id) return;
    axios
      .get(`${import.meta.env.VITE_SERVER}/notifications/`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.data);

        setNotifications(res.data.data || []);
      });
  }, [user?.user?._id]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;
    socket.on("new_notification", (notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => {
      socket.off("new_notification");
    };
  }, [socket]);

  const markAllAsRead = async () => {
    await axios.post(
      `${import.meta.env.VITE_SERVER}/notifications/mark-as-read`,
      {},
      { withCredentials: true }
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
