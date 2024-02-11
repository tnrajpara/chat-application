"use client";
import React from "react";
import Register from "./Register/page";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
// import { UserAuth } from "./contexts/userAuth";
import Dashboard from "./Dashboard/page";

import { AuthContext } from "./context/AuthContext";

const Page = () => {
  const { currentUser } = React.useContext(AuthContext);

  return (
    <div>
      {currentUser ? (
        <Dashboard />
      ) : (
        <div>
          <Register />
        </div>
      )}
    </div>
  );
};

export default Page;
