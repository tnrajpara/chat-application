"use client";

import React from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [pending, setPending] = React.useState(true);

  React.useEffect(() => {
    const unsubscibe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setPending(false);
    });
    return () => unsubscibe();
  }, []);

  if (pending) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
