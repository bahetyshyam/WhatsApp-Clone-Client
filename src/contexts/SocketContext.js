import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const { currentUser } = useAuth();
  const [socket, setSocket] = useState();

  useEffect(() => {
    if (currentUser === null) return;
    if (currentUser === undefined) return;

    const newSocket = io(process.env.REACT_APP_BACKEND_URL, {
      query: { id: currentUser.uid },
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
