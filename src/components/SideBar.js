import React, { useEffect, useState } from "react";
import { Tab, Nav, ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import UserItem from "./UserItem";
const CONVERSATIONS_KEY = "conversations";

export default function Sidebar({ activeUser, setActiveUser }) {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();

  const fetchUsers = async () => {
    const responseFromServer = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/api/getAllUsers"
    );
    const responseArray = await responseFromServer.json();
    setUsers(responseArray);
    setActiveUser(responseArray[0].uid);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ width: "250px" }} className="d-flex flex-column">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Users</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="border-right overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <ListGroup variant="flush">
              {users.map((user, index) => {
                if (user.uid !== currentUser.uid)
                  return (
                    <UserItem
                      key={user.uid}
                      user={user}
                      activeId={activeUser}
                      handleClick={setActiveUser}
                    />
                  );
                else return null;
              })}
            </ListGroup>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
