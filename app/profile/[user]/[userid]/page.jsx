"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase";

const UserProfile = () => {
  const id = useParams();
  const [user, setUser] = useState(null);

  console.log(id);

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(firestore, "users", id.userid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data());
      } else {
        console.log("No such user!");
      }
    };
    fetchUser();
  }, []);

  // Render user details
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-900 text-white">
      {user ? (
        <div className="p-6 text-white shadow-md rounded-lg bg-gray-800 ">
          <img
            className="w-24 h-24 mb-4 rounded-full mx-auto"
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <h1 className="text-2xl font-bold text-center">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-center mt-2">{user.bio}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default UserProfile;
