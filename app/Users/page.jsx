"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  setDoc,
  arrayUnion,
  doc,
  onSnapshot,
  getDoc,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import Link from "next/link";
import { UserContext } from "../context/UserContext";
import { MdMessage } from "react-icons/md";
import { update } from "firebase/database";

const Page = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [inputMessage, setInputMessage] = useState("");
  const router = useRouter();
  const [lastDoc, setLastDoc] = useState(null);
  const { personal } = useContext(UserContext);
  const [receiver, setReceiver] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [chats, setChats] = useState([]);

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
  }, [users, chats]);

  // useEffect(() => {
  //   // useeffect for chats

  //   return () => unsubscribe();
  // });

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const chatRef = doc(firestore, "chats", `${senderId}-${receiverId}`);

      const chatSnap = await getDoc(chatRef);

      const newMessage = {
        message: inputMessage,
        sender: senderId,
        receiver: receiverId,
        timestamp: new Date(),
      };

      if (chatSnap.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion(newMessage),
          timestamp: new Date(),
        });
      } else {
        const chatDoc = {
          users: [senderId, receiverId].sort(),
          messages: [newMessage],
          timestamp: new Date(),
        };
        await setDoc(chatRef, chatDoc);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessageSubmit();
    }
  };

  const pushIds = async (receiver, sender) => {
    try {
      setSenderId(sender);
      setReceiverId(receiver);

      const receiverRef = doc(firestore, "users", receiver);
      const receiverSnap = await getDoc(receiverRef);
      if (receiverSnap.exists()) {
        setReceiver(receiverSnap.data());
        console.log(receiverSnap.data());
      }
      const q1 = query(
        collection(firestore, "chats"),
        where("sender", "==", sender),
        where("receiver", "==", receiver),
        orderBy("timestamp")
      );

      const q2 = query(
        collection(firestore, "chats"),
        where("sender", "==", receiver),
        where("receiver", "==", sender),
        orderBy("timestamp")
      );
      const [q1Snapshot, q2Snapshot] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
      ]);

      let newChats = [
        ...q1Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...q2Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);

      setChats(newChats);

      setInputMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex font-cal h-full ">
      <div className="flex items-start w-1/2 py-4 flex-col space-y-6">
        <div className="flex items-start border justify-center ml-10 px-2 py-2 w-4/5 rounded-md">
          <CiSearch className="mr-2 " />
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Search users..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-11/12">
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
                  key={user.id}
                  className="flex justify-between rounded-lg px-3 py-2 w-11/12 mx-auto border border-black items-end "
                >
                  <div className="flex justify-end">
                    <img
                      src={user.image}
                      alt=""
                      className="rounded-full w-16 h-16 object-cover border-2 border-gray-800"
                    />
                  </div>
                  <h1 className="text-lg font-bold text-center flex space-x-4 items-center">
                    <div className="text-right first-letter:capitalize">
                      {user.firstName} {user.lastName}
                    </div>

                    <button
                      onClick={() => pushIds(user.uid, personal.uid)}
                      className="text-end"
                    >
                      <MdMessage className="text-2xl" type="submit" />
                    </button>
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vertical line */}
      <div className="border border-gray-800 h-screen"></div>

      {/* Second part */}
      <div className="flex flex-col justify-between items-start w-1/2 space-y-6 flex-grow">
        <div className="bg-gray-50 text-black p-6 w-full">
          <h1 className="text-xl first-letter:uppercase text-center">
            {receiver.firstName} {receiver.lastName}
          </h1>
        </div>

        <div className="flex flex-col w-full h-4/5 overflow-y-scroll">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex flex-col  ${
                chat.sender === senderId ? "items-end" : "items-start"
              }`}
            >
              {chat.messages.map((message) => (
                <p
                  key={message.id} // Use message ID as key
                  className={`${
                    senderId === chat.sender
                      ? " px-4 py-2 rounded-md relative inline-block hover:cursor-pointer  ml-2 mr-2 border-b-4 border-b-gray-100 bg-gray-900 border border-white text-gray-100 clear-both"
                      : "px-4 py-2 rounded-md text-sm ml-2 border-b-4 border-b-gray-900 text-gray-900 border border-black hover:cursor-pointer inline-block mr-2 clear-both"
                  }`}
                >
                  {message.message}
                  <div className="text-xs absolute right-0 bottom">
                    {senderId === chat.senderId ? "You" : ""}
                  </div>
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="p-4 w-full">
          <form
            className="w-full flex border border-black"
            onSubmit={handleMessageSubmit}
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 rounded-l-md outline-none border-black"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="px-4 py-2  ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;
