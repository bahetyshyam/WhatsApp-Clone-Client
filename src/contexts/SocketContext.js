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

    console.log("Useeffect running, creating socket connection");
    const newSocket = io("http://localhost:5000", {
      query: { id: currentUser.uid },
    });
    // client-side
    newSocket.on("connect", () => {
      console.log(newSocket.id); // x8WIv7-mJelg7on_ALbx
    });

    newSocket.on("disconnect", () => {
      console.log(newSocket.id); // undefined
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
