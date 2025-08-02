import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";
import { useUser } from "../Components/UserContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();
  const userContext = useUser();
  const user = userContext?.user;

  // Fetch notifications when user is available
  useEffect(() => {
    if (!user?.user?._id) return;

    axios
      .get(`${import.meta.env.VITE_SERVER}/notifications/`, {
        withCredentials: true,
      })
      .then((res) => {
        setNotifications(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
      });
  }, [user?.user?._id]);

  // Handle real-time notification via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log("Received notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  // Delete all notifications on markAsRead
  const markAllAsRead = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_SERVER}/notifications/mark-as-read`,
        { withCredentials: true }
      );

      console.log(res);
      
      setNotifications([]); 
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
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
