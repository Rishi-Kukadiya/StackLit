import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "../Components/UserContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.user?._id) return;
    const newSocket = io(import.meta.env.VITE_SERVER_FOR_SOCKET, {
      auth: { userId: user.user._id },
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [user?.user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
