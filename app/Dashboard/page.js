"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImProfile } from "react-icons/im";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfo";
import { CiSearch } from "react-icons/ci";
import { UserContext } from "../context/UserContext";

const Page = () => {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const { personal } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
    if (!userInfo) {
      setLoading(true);
      router.push("/OnBoarding");
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data());
      } else {
        console.log("No such user!");
      }
    };
    fetchUser();
    fetchUsers();
  }, []);

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

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="px-5 py-7 font-poppins">
      {!user && (
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
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-center font-bold text-4xl mt-5 mb-5  text-black">
          Dashboard
        </h1>

        <div className="lg:flex items-start border border-black justify-center ml-10 px-2 py-2 w-3/5 rounded-md  hidden">
          <CiSearch className="mr-2 text-center text-xl" />
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Link href={`profile/${user.firstName}-${user.lastName}/${user.uid}`}>
          <img
            src={user.image}
            alt="Not Found"
            className="w-12 h-12 rounded-md object-cover cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex items-center border border-black  justify-center px-2 py-2 w-full mt-5 space-y-4 rounded-md  lg:hidden">
        <input
          type="text"
          className="w-full bg-transparent outline-none"
          placeholder="Search users..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center lg:mt-5 space-y-4 lg:space-y-0 lg:space-x-2 lg:mb-10 mt-8">
        <div
          className="lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 shadow-fill active:shadow-input-shrink flex place-items-center
         w-full overflow-hidden rounded-[40px] border-[2px] border-black bg-gray-50 leading-[26px] transition-all duration-150 ease-in-out will-change-transform active:translate-y-[2px] active:duration-100 md:h-[90px] border-b-8 border-b-gray-900  font-bold"
        >
          <Link className="text-center" href={`/EditProfile`}>
            <button className=" flex h-full place-items-center justify-center  gap-4  text-gray-900 pl-8 pr-3 md:min-w-[209px] md:px-0">
              <ImProfile className="text-4xl lg:text-lg" />
              <span>Edit Profile</span>
            </button>
          </Link>

          <Link className="text-center  " href={`/CreateRoom`}>
            <button className=" flex h-full place-items-center justify-center lg:mb-0 mb-5 text-gray-900  pl-8 pr-3 md:min-w-[209px] md:px-0">
              Create Room
            </button>
          </Link>
          <Link className="text-center " href={`/Rooms`}>
            <button className=" flex h-full place-items-center justify-center  mb-5 lg:mb-0 text-gray-900  pl-8 pr-3 md:min-w-[209px] md:px-0">
              Rooms
            </button>
          </Link>
        </div>
      </div>

      {/* <div className="flex flex-col mt-5">
        <div className="space-y-1 flex row-span-3 justify-start">
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
                className="ml-5 w-full lg:w-1/4 border border-black border-t-4 border-t-black lg:px-6 px-4 py-3 rounded-full  flex  justify-between items-end"
              >
                <div className="flex  ">
                  <img
                    src={user.image}
                    alt=""
                    className="rounded-md w-16 h-16  object-cover"
                  />
                </div>
                <h1 className="text-lg font-bold flex space-x-4  lg:flex-row flex-col justify-between">
                  <div className="text-right first-letter:capitalize text-sm justify-start">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="justify-end flex">
                    {personal.uid === "" && user.uid === "" ? (
                      <div></div>
                    ) : (
                      <Link
                        href={`chats/${personal.uid}-${user.uid}`}
                        className="text-end"
                      >
                        <CiChat2 className="text-2xl" type="submit" />
                      </Link>
                    )}
                  </div>
                </h1>
              </div>
            );
          })}
        </div>
      </div> */}

      <div className="flex md:flex-row flex-col col-span-3 row-span-3 justify-center items-center space-x-5">
        {filteredUsers.map((user) => {
          if (
            user.image === personal.image ||
            user.firstName === personal.firstName
          ) {
            return null;
          }
          return (
            <div
              class="w-full max-w-sm  border  rounded-lg shadow bg-[#2a2438] border-gray-500 mt-7 "
              key={user.uid}
            >
              <div class="flex justify-end px-4 pt-4">
                <button
                  id="dropdownButton"
                  data-dropdown-toggle="dropdown"
                  class="inline-block text-gray-400  hover:bg-gray-700 focus:ring-4 focus:outline-none  focus:ring-gray-700 rounded-lg text-sm p-1.5"
                  type="button"
                >
                  <span class="sr-only">Open dropdown</span>
                  <svg
                    class="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 3"
                  >
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                  </svg>
                </button>
              </div>
              <div class="flex flex-col items-center pb-10">
                <img
                  class="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
                  src={user.image}
                  alt="Bonnie image"
                />
                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </h5>
                <span class="text-sm text-gray-500 dark:text-gray-400 first-letter:capitalize">
                  {user.bio}
                </span>
                <div class="flex mt-4 md:mt-6">
                  <a
                    href="#"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-center  bg-white rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 text-black"
                  >
                    Add friend
                  </a>
                  {personal.uid === "" && user.uid === "" ? (
                    <div></div>
                  ) : (
                    <Link
                      href={`chats/${personal.uid}-${user.uid}`}
                      class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Message
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
