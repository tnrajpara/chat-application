"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
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
import { IoMdClose } from "react-icons/io";
import Users from "./Users";
import { signOut } from "../config";

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const { personal } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
    if (!userInfo) {
      setLoading(true);
      router.push("/OnBoarding");
    }
  }, []);

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
  });

  const handleUserProfile = async (userId) => {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && showProfile === false) {
      setUserProfile(userSnap.data());
      setShowProfile(true);
      console.log(userProfile);
    } else {
      console.log("No such user!");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div
      className={
        users.length <= 3
          ? "px-5 py-7 font-poppins  h-screen mb-5"
          : "px-5 py-7 font-poppins mb-5"
      }
    >
      {!user && (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">Loading...</h1>
        </div>
      )}

      <div className="flex justify-between items-center ">
        <h1 className="text-center font-bold text-4xl mt-5 mb-5  text-black ">
          Dashboard
        </h1>

        <div className="lg:flex items-start  border border-black justify-center ml-10 px-2 py-2 w-3/5 rounded-full hidden ">
          <CiSearch className="mr-2 text-center text-xl" />
          <input
            type="text"
            className="w-full bg-transparent outline-none "
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            handleUserProfile(`${user.uid}`);
          }}
          className="relative"
        >
          <div className="flex">
            {showProfile && (
              <>
                <div class=" px-6 py-6 text-center bg-gray-800 rounded-lg lg:mt-0 lg:px-3 xl:px-10 z-10 right-1 top-[10px] fixed">
                  <div>
                    <IoMdClose
                      className="absolute top-2 right-2 text-white text-2xl"
                      onClick={() => {
                        setShowProfile(!showProfile);
                      }}
                    />
                  </div>
                  <div class="space-y-4 xl:space-y-6 justify-center items-center flex flex-col">
                    <img
                      src={userProfile.image}
                      alt="Not Found"
                      className="w-24 h-24 rounded-md object-cover cursor-pointer"
                      onClick={() => {
                        setShowProfile(!showProfile);
                      }}
                    />
                    <div class="space-y-2">
                      <div class="flex justify-center items-center flex-col space-y-3 text-lg font-medium leading-6">
                        <h3 class="text-white">
                          {userProfile.firstName} {userProfile.lastName}
                        </h3>
                        <p class="text-indigo-300">{userProfile.bio}</p>
                        <button
                          className="bg-red-500 text-white  px-2 py-2"
                          onClick={() => {
                            signOut();
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <img
              src={user.image}
              alt="Not Found"
              className="w-12 h-12 rounded-md object-cover cursor-pointer"
            />
          </div>
        </button>
      </div>

      {/* mobile screen input  */}
      <div className="flex flex-col justify-center lg:hidden">
        <div className="flex justify-start space-x-4 items-center border border-black lg:hidden py-2 rounded-full">
          <CiSearch className="text-xl ml-2" />
          <div>
            <input
              type="text"
              className="bg-transparent outline-none"
              placeholder="Search users..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center lg:mt-5 space-y-4 lg:space-y-0 lg:space-x-2 lg:mb-10 mt-8 ">
        <div
          className="lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 shadow-fill active:shadow-input-shrink flex place-items-center
         w-full overflow-hidden rounded-[40px] border-[2px] border-black bg-gray-50  leading-[26px] transition-all duration-150 ease-in-out will-change-transform active:translate-y-[2px] active:duration-100 md:h-[90px] border-b-8 border-b-gray-900  font-bold text-gray-900 "
        >
          <Link className="text-center" href={`/EditProfile`}>
            <button className=" flex h-full place-items-center justify-center  gap-4  text-gray-900  pl-8 pr-3 md:min-w-[209px] md:px-0">
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

      <Users users={filteredUsers} personal={personal} />
    </div>
  );
}
