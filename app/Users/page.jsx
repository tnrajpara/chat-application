"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { UserContext } from "../context/UserContext";
import { CiChat2 } from "react-icons/ci";
import Link from "next/link";

const Page = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [inputMessage, setInputMessage] = useState("");
  const router = useRouter();
  const [lastDoc, setLastDoc] = useState(null);
  const { personal } = useContext(UserContext);

  const fetchUsers = async () => {
    // useeffect for users
    const col = collection(firestore, "users");
    let q;

    if (lastDoc) {
      q = query(col, orderBy("firstName"), startAfter(lastDoc), limit(10));
    } else {
      q = query(col, orderBy("firstName"), limit(10));
    }

    const usersCol = await getDocs(q);
    const users = usersCol.docs.map((doc) => doc.data());

    // Save the last document from the results
    setLastDoc(usersCol.docs[usersCol.docs.length - 1]);
    setUsers((prevUsers) => {
      const newUsers = users.filter(
        (user) =>
          !prevUsers.find(
            (prevUser) =>
              prevUser.firstName === user.firstName ||
              prevUser.lastName === user.lastName
          )
      );
      return [...prevUsers, ...newUsers];
    });
  };

  useEffect(() => {
    if (!currentUser) {
      router.push("/Login");
    }

    fetchUsers();
  });

  // useEffect(() => {
  //   // useeffect for chats

  //   return () => unsubscribe();
  // });

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="flex  h-full ">
      <div className="flex items-start w-full  py-4 flex-col space-y-6 font-cal">
        <div className="flex items-start border justify-center ml-10 px-2 py-2 w-4/5 rounded-md">
          <CiSearch className="mr-2 " />
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-screen  lg:w-full h-full ">
          <div className="space-y-1">
            {filteredUsers.map((user) => {
              if (
                user.image === personal.image ||
                user.firstName === personal.firstName
              ) {
                return null;
              }

              return (
                <div
                  key={user.uid}
                  className="ml-5 w-1/4 border border-gray-500 px-2 py-3 rounded-md "
                >
                  <div className="flex flex-col ">
                    <img
                      src={user.image}
                      alt=""
                      className="rounded-md w-24 h-24 object-cover"
                    />
                  </div>
                  <h1 className="text-lg font-bold  flex space-x-4 items-end justify-end ">
                    <div className="text-right first-letter:capitalize text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                    <Link
                      href={`chats/${personal.uid}-${user.uid}`}
                      className="text-end"
                    >
                      <CiChat2 className="text-2xl" type="submit" />
                    </Link>
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Second part */}
    </div>
  );
};
export default Page;
