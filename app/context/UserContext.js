"use client";
import React, { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { AuthContext } from "./AuthContext";

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [personal, setPersonal] = useState([]);
  const [pending, setPending] = React.useState(true);
  const { currentUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setPersonal(userSnap.data());
        setPending(false);
      } else {
        console.log("No such user!");
      }
    };
    fetchUser();
  }, []);

  if (pending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div class="animate-pulse flex space-x-4">
          <div class="rounded-full bg-slate-700 h-10 w-10"></div>
          <div class="flex-1 space-y-6 py-1">
            <div class="h-2 bg-slate-700 rounded"></div>
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                <div class="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
              <div class="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ personal }}>{children}</UserContext.Provider>
  );
}
