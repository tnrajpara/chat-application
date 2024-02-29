"use client";
import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImProfile } from "react-icons/im";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useUserInfo } from "../context/UserInfo";

const Page = () => {
  const [roomNames, setRoomNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const router = useRouter();
  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
    if (!userInfo) {
      setLoading(true);
      router.push("/OnBoarding");
    }
    console.log(currentUser);
    console.log(userInfo);
  });

  useEffect(() => {
    const roomRef = collection(firestore, "rooms");
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const roomNames = snapshot.docs.map((doc) => doc.id);
      setRoomNames(roomNames);
    });
    return unsub;
  }, []);

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
  }, []);

  return (
    <div className="px-5 py-7 lg:h-screen h-screen lg:w-screen bg-[#f4f4f4] font-cal">
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

      <div className="flex justify-between">
        <h1 className="text-center font-bold text-4xl mt-5 mb-5  text-black">
          Dashboard
        </h1>

        <Link href={`profile/${user.firstName}-${user.lastName}/${user.uid}`}>
          <img
            src={user.image}
            alt="Not Found"
            className="w-12 h-12 rounded-md object-cover cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center lg:mt-5 space-y-4 lg:space-y-0 lg:space-x-2 lg:mb-10">
        <div
          className=" lg:flex-row space-y-4 lg:space-y-0 lg:space-x-5 shadow-fill active:shadow-input-shrink flex
         w-full overflow-hidden rounded-[32px] border-[2px] border-black bg-gray-50 leading-[26px] transition-all duration-150 ease-in-out will-change-transform active:translate-y-[2px] active:duration-100 md:h-[90px] border-b-8 border-b-gray-900 justify-center "
        >
          <Link className="text-center" href={`/EditProfile`}>
            <button className="border-primary-700 flex h-full place-items-center justify-center border-r-2 gap-4 border-dashed text-gray-900 pl-8 pr-6 md:min-w-[209px] md:px-0">
              <ImProfile className="text-xl" />
              <span>Edit Your Profile</span>
            </button>
          </Link>

          <Link
            className="text-center flex justify-center items-center md:block lg:block "
            href={`/CreateRoom`}
          >
            <button className="border-primary-700 flex h-full place-items-center justify-center border-r-2 mb-2 border-dashed text-gray-900  pl-8 pr-6 md:min-w-[209px] md:px-0">
              Create Room
            </button>
          </Link>
          <Link
            className="text-center flex justify-center items-center md:block lg:block "
            href={`/Users`}
          >
            <button className="border-primary-700 flex h-full place-items-center justify-center border-r-2 mb-2 border-dashed text-gray-900  pl-8 pr-6 md:min-w-[209px] md:px-0">
              Users
            </button>
          </Link>
        </div>
      </div>
      <ul className="flex flex-wrap justify-center space-x-5 mt-10">
        {roomNames.map((roomName, index) => (
          <li
            key={index}
            className="bg-gray-50 text-gray-900 w-52 h-52 flex items-center justify-center text-2xl font-bold rounded-lg m-2 border-l-8 border-l-gray-900 border-black border-2"
          >
            <Link className="text-center" href={`/room/${roomName}`}>
              {roomName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
