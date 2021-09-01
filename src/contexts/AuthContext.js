import React, { useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail as firebaseUpdateEmail,
} from "firebase/auth";

import { getDatabase, ref, set, onDisconnect } from "firebase/database";

const AuthContext = React.createContext();

initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const auth = getAuth();
const databaseInstance = getDatabase();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const dataDatabaseReference = ref(
    databaseInstance,
    `/online/${currentUser?.uid}`
  );
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth).then(() => {
      set(dataDatabaseReference, false);
    });
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateEmail(email) {
    return firebaseUpdateEmail(auth, email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(auth, password);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document["hidden"]) {
      }
    });
  }, []);

  useEffect(() => {
    if (currentUser === null) return;
    if (currentUser === undefined) return;

    set(dataDatabaseReference, true);
    onDisconnect(dataDatabaseReference).set(false);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        set(dataDatabaseReference, true);
      } else {
        set(dataDatabaseReference, false);
      }
    };
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
        false
      );
  }, [currentUser, dataDatabaseReference]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    databaseInstance,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
