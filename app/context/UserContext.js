"use client";
import React, { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [personal, setPersonal] = useState([]);
  const [pending, setPending] = React.useState(true);
  const { currentUser } = React.useContext(AuthContext);

  const router = useRouter();

  React.useEffect(() => {
    if (currentUser === null) {
      setPending(false);
      router.push("/Register");
    } else {
      const fetchUser = async () => {
        try {
          const userRef = doc(firestore, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setPersonal(userSnap.data());
            setPending(false);
          } else {
            router.push("/Login");
            setPending(false);
            console.log("No such user!");
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }
  }, []);

  if (pending) {
    return <div>Loading from usercontext...</div>;
  }
  return (
    <UserContext.Provider value={{ personal }}>{children}</UserContext.Provider>
  );
}
