"use client";

import { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

const Page = () => {
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const roomRef = collection(firestore, "rooms");
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const roomNames = snapshot.docs.map((doc) => doc.id);
      setRooms(roomNames);
    });
    return unsub;
  }, []);

  return (
    <div className="mt-10 ml-10 font-poppins">
      <div>
        <h1 className="text-4xl font-cal ">Rooms</h1>
      </div>
      {rooms.length === 0 && (
        <p className="text-2xl font-cal mt-5">No rooms Available!</p>
      )}
      <ul className="flex flex-wrap justify-center space-x-5 mt-10">
        {rooms.map((roomName, index) => (
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
