"use client";
import { useEffect, useState } from "react";
import { updateDoc, doc, arrayUnion, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LiaRestroomSolid } from "react-icons/lia";
import Link from "next/link";
import { IoMdArrowRoundForward } from "react-icons/io";

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [cookies] = useCookies(["user"]);
  // const [roomCookie, setRoomCookie] = useCookies(["roomInfo"]);
  const [u, setU] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    }
  });
  // useEffect(() => {
  //   if (!user.user) {
  //     router.push("/OnBoarding");
  //   }
  // });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomName.trim() === "") {
      alert("Please enter a valid room name");
      return;
    }
    if (!u) {
      router.push("/Login");
    }
    try {
      const roomRef = doc(firestore, "rooms", roomName);
      await setDoc(roomRef, {
        name: roomName,
        users: [currentUser.uid],
        messages: [],
        createdBy: currentUser.uid,
      });

      await updateDoc(doc(firestore, "users", currentUser.uid), {
        rooms: arrayUnion(roomRef.id),
      });
      router.push(`/room/${roomName}`);
    } catch (error) {
      console.error("Error while creating room :: CreateRoom.jsx:", error);
    }
  };

  return (
    <div className=" bg-gray-50 flex text-gray-900 w-screen h-screen items-center justify-center flex-col space-y-5 font-cal ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 border border-black px-3 py-5 rounded-lg items-center justify-center w-1/2 h-1/2 lg:text-xl"
      >
        <LiaRestroomSolid className="text-6xl" />

        <h1 className="text-4xl text-center">Create a Room</h1>
        <div className="flex">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className=" p-2 rounded-md outline-none border border-black"
          />
          <button
            className="border border-black bg-white  px-2 py-1 rounded-lg"
            type="submit"
          >
            <IoMdArrowRoundForward className="text-2xl" />
          </button>
        </div>
        <Link href="/Dashboard">Go to Dashboard</Link>
      </form>
    </div>
  );
};

export default CreateRoomPage;
