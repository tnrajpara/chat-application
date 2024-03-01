"use client";

import { useEffect } from "react";
import { firestore } from "../firebase";
import { collection } from "firebase/firestore";

const page = () => {
  const [roomNames, setRoomNames] = useState([]);
  useEffect(() => {
    const roomRef = collection(firestore, "rooms");
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const roomNames = snapshot.docs.map((doc) => doc.id);
      setRoomNames(roomNames);
    });
    return unsub;
  }, []);

  return (
    <div>
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

export default page;
