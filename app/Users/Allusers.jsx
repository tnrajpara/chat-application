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
import { IoChatboxOutline } from "react-icons/io5";
import Link from "next/link";
import { UserContext } from "../context/UserContext";

const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [lastDoc, setLastDoc] = useState(null);
  const { personal } = useContext(UserContext);

  const fetchUsers = async () => {
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
    } else {
      fetchUsers();
    }
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="bg-gray-50 font-cal h-full ">
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center justify-center w-full max-w-md px-2 py-2  rounded-md">
          <CiSearch className="mr-2 " />
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="">
          {filteredUsers.map((user) => {
            if (
              user.image === personal.image ||
              user.firstName === personal.firstName
            ) {
              return null;
            }

            return (
              <div
                key={user.id}
                className="flex justify-between  rounded-lg px-3 py-2 w-3/4 mx-auto border border-black border-b-8 border-b-black items-end"
              >
                <div className="flex justify-end">
                  <img
                    src={user.image}
                    alt=""
                    className="rounded-full w-24 h-24"
                  />
                </div>
                <h1 className="text-2xl font-bold text-end">
                  <div className="text-right">
                    {user.firstName} {user.lastName}
                  </div>
                </h1>
                {/* <Link className="flex justify-end" href={`chat/${user.uid}`}>
        <IoChatboxOutline className="text-2xl" />
      </Link> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
