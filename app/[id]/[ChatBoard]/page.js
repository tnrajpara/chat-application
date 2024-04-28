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
import { IoSend } from "react-icons/io5";

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const { currentUser } = useContext(AuthContext);

  const router = useRouter();
  const roomName = useParams().ChatBoard.toString();
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
      console.log("the current", currentUser.uid);
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
  });

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() === "") {
      return;
    }
    if (inputMessage.trim() !== "") {
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
          viewdby: [currentUser.uid],
        };

        try {
          const roomRef = doc(firestore, `rooms/${roomName}`);
          await updateDoc(roomRef, {
            messages: arrayUnion(message),
            users: arrayUnion(userRef.id),
          });

          setInputMessage("");
          console.log("Message sent");
        } catch (err) {
          console.error("Error sending message:", err);
        }
      } else {
        console.log("No such document!");
      }
    }
  };

  const markMessageAsViewed = async (messageId) => {
    const roomRef = doc(firestore, `rooms/${roomName}`);
    const roomSnap = await getDoc(roomRef);

    if (roomSnap.exists()) {
      const messages = roomSnap.data().messages;
      const messageIndex = messages.findIndex((msg) => msg.id === messageId);

      if (messageIndex !== -1) {
        messages[messageIndex].viewedBy.push(currentUser.uid);

        await updateDoc(roomRef, {
          messages: messages,
        });
        console.log("Message marked as viewed");
      } else {
        console.log("No such message!");
      }
    } else {
      console.log("No such room!");
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      chatMessages.forEach((msg) => {
        if (!msg.viewedBy.includes(currentUser.uid)) {
          markMessageAsViewed(msg.id);
        }
      });
    });

    return () => unsubscribe();
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit(e);
    }
  };

  return (
    <div className="bg-gray-50 text-black h-screen flex flex-col font-poppins">
      <div className="text-[#e5e7eb] bg-black p-4 flex justify-between items-center space-x-2">
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
        <div>
          {chatMessages.map((chat) => (
            <div
              key={chat.id}
              className={` h-12 flex items-center ${
                chat.uid === currentUser.uid ? "justify-end" : "justify-start"
              }`}
            >
              {currentUser.uid === chat.uid ? (
                <></>
              ) : (
                <Link
                  href={`/profile/${chat.sender.replace(/\s+/g, "-")}/${
                    chat.uid
                  }`}
                >
                  <span className="text-xs text-end">{chat.sender}</span>
                </Link>
              )}{" "}
              <div className="flex flex-col">
                <h1
                  className={`${
                    currentUser.uid === chat.uid
                      ? " px-4 py-2 rounded-full hover:cursor-pointer text-sm ml-2 mr-2 border-b-4 border-b-gray-900 bg-gray-900 text-gray-50 border border-black"
                      : "px-4 py-2 rounded-full  text-sm ml-2 border-b-4 border-b-gray-900 text-gray-900 border border-black hover:cursor-pointer  mr-2"
                  }`}
                >
                  {chat.message}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 flex items-center rounded-full">
        <form
          className="w-full flex border border-gray-400 rounded-full"
          onSubmit={() => handleMessageSubmit()}
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow  p-2 rounded-l-md   outline-none "
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className=" px-4 py-2  ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
          >
            <IoSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
