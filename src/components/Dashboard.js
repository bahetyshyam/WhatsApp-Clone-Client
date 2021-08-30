import React, { useRef, useState, useEffect } from "react";
import { Button, Alert, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const textRef = useRef("");
  const { logout } = useAuth();
  const history = useHistory();
  const socket = useSocket();

  const sendMessage = (ev) => {
    ev.preventDefault();
    console.log(textRef.current.value);
    socket.emit("send-message", {
      recipientId: "Kdw6hjARNLMMUq9Nbiq0SL2q20c2",
      text: textRef.current.value,
    });
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-message", (value) => console.log(value));

    return () => socket.off("receive-message");
  }, [socket]);

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
      <Form onSubmit={sendMessage}>
        <Form.Group id="email">
          <Form.Label>Text</Form.Label>
          <Form.Control type="text" ref={textRef} required />
        </Form.Group>
        <Button className="w-100" type="submit">
          Send
        </Button>
      </Form>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
}
