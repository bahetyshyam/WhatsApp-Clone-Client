import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { ref, onValue } from "firebase/database";

const UserItem = ({ user, activeId, handleClick }) => {
  const { databaseInstance } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const dataDatabaseReference = ref(databaseInstance, `/online/${user.uid}`);
    const unsubscribe = onValue(dataDatabaseReference, (snapshot) => {
      setIsOnline(snapshot.val());
    });
    return () => unsubscribe();
  }, [databaseInstance, user.uid]);
  return (
    <ListGroup.Item
      key={user.uid}
      action
      onClick={() => handleClick(user.uid)}
      active={user.uid === activeId}
    >
      <div>{user.email}</div>
      <div>{isOnline ? "Online" : "Offline"}</div>
    </ListGroup.Item>
  );
};

export default UserItem;
