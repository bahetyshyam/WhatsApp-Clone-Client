import React, { useCallback, useContext, useEffect } from "react";
import useLocalStorageConversation from "../hooks/useLocalStorageConversation";
import { useSocket } from "./SocketContext";
import { v4 as uuid } from "uuid";
import { useAuth } from "./AuthContext";

const ConversationContext = React.createContext();

export function useConversation() {
  return useContext(ConversationContext);
}

export function ConversationProvider({ activeUser, children }) {
  const [messages, setMessages] = useLocalStorageConversation(activeUser);
  const { currentUser } = useAuth();
  const socket = useSocket();

  const addMessageToConversation = useCallback(
    ({ messageId, senderId, text }) => {
      setMessages((value) => {
        return [...value, { messageId, senderId, text }];
      });
    },
    [setMessages]
  );

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", (data) => addMessageToConversation(data));

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  function sendMessage(text) {
    const messageId = uuid();
    socket.emit("send-message", { messageId, recipientId: activeUser, text });

    addMessageToConversation({ messageId, senderId: currentUser.uid, text });
  }

  const value = {
    messages,
    sendMessage,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}
