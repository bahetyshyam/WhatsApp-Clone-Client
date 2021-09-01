import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Sidebar from "./SideBar";
import { ConversationProvider } from "../contexts/ConversationContext";
import OpenConversation from "./OpenConversations";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const history = useHistory();
  const [activeUser, setActiveUser] = useState(null);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <div className="d-flex" style={{ height: "100vh" }}>
        <Sidebar activeUser={activeUser} setActiveUser={setActiveUser} />
        <ConversationProvider activeUser={activeUser}>
          <OpenConversation activeUser={activeUser} />
        </ConversationProvider>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
