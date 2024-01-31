"use client";
import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import { update } from "firebase/database";

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [cookies, setCookie] = useCookies(["user"]);
  const [user, setUser] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showDelete, setShowDelete] = useState(
    Array(chatMessages.length).fill(false)
  );
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const roomName = useParams().ChatBoard.toString();

  const [userId, setUserId] = useState(null);
  const [createdBy, setCreatedBy] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomRef = doc(firestore, "rooms", roomName);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const { createdBy } = roomSnap.data();

        setCreatedBy(createdBy);
      } else {
        console.log("No such room!");
      }
    };

    fetchRoomData();
  }, [roomName]);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      router.push("/Login");
    } else {
      console.log(currentUser.uid);
    }
  });

  useEffect(() => {
    const roomRef = doc(firestore, `rooms/${roomName}`);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      const roomData = snapshot.data();
      if (roomData && roomData.messages) {
        const messages = roomData.messages.map((message) => ({
          id: message.id,
          ...message,
        }));
        setChatMessages([...messages]);
        console.log("current", currentUser.uid);
      } else {
        console.log("No messages");
      }
    });
    return () => unsubscribe();
  }, [roomName]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "") {
      return;
    }
    if (inputMessage.trim() !== "") {
      setInputMessage("");
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const { firstName, lastName } = userSnap.data();

        const message = {
          uid: currentUser.uid,
          id: uuidv4(),
          message: inputMessage,
          sender: firstName + " " + lastName,
          timeStamp: new Date().toLocaleString(),
        };

        try {
          const roomRef = doc(firestore, `rooms/${roomName}`);
          await updateDoc(roomRef, {
            messages: arrayUnion(message),
            users: arrayUnion(userRef.id),
          });

          console.log("Message sent");
        } catch (err) {
          console.error("Error sending message:", err);
        }
      } else {
        console.log("No such document!");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  const removeMessage = async (id) => {
    try {
      console.log(id);
      // remove only message from array query
      const roomRef = doc(firestore, `rooms/${roomName}`);
      await updateDoc(roomRef, {
        messages: arrayRemove(id),
      });
    } catch (err) {
      console.error("Error removing message:", err);
    }
  };

  return (
    <div className="bg-gray-50 text-black h-screen flex flex-col font-cal">
      <div className="bg-[#e5e7eb] p-4 flex justify-between items-center space-x-2">
        <h1 className="text-center font-bold text-2xl">ChatBoard</h1>
        <p className="font-semibold  text-2xl"> {roomName}</p>

        <div className="flex gap-3 lg:gap-7">
          <button
            className=" p-2 border-black border rounded-md"
            onClick={() => {
              router.push("/Dashboard");
            }}
          >
            <FaHome className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        <div id="chatMessages" className="grid grid-cols-1 gap-y-4">
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className={` h-12 flex items-center ${
                createdBy === chat.uid
                  ? "justify-self-start flex-row-reverse"
                  : "justify-self-end"
              }`}
            >
              <h1
                className={`${
                  createdBy === chat.uid
                    ? " px-4 py-2 rounded-md hover:cursor-pointer text-sm ml-2 mr-2 border-b-4 border-b-gray-900 text-gray-900 border border-black"
                    : "px-4 py-2 rounded-md  text-sm ml-2 border-b-4 border-b-gray-900 text-gray-900 border border-black hover:cursor-pointer  mr-2"
                }`}
                onClick={() => {
                  setShowDelete({
                    ...showDelete,
                    [chat.id]: !showDelete[chat.id],
                  });
                }}
              >
                {chat.message}
              </h1>
              {showDelete[chat.id] && (
                <MdDelete
                  className="ml-2 text-red-500 cursor-pointer"
                  onClick={() => {
                    removeMessage(chat.id);
                  }}
                />
              )}
              <Link
                href={`/profile/${chat.sender.replace(/\s+/g, "-")}/${
                  chat.uid
                }`}
              >
                <span className=" text-sm font-semibold">{chat.sender}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 flex items-center">
        <form className="w-full flex" onSubmit={() => handleMessageSubmit()}>
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow  p-2 rounded-l-md outline-none border-black"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className=" px-4 py-2 rounded-md ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
