"use client";

import {
  setDoc,
  arrayUnion,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { firestore } from "../../firebase";

const Chats = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [receiverData, setReceiverData] = useState({});
  const [chats, setChats] = useState([]);
  const [receiverChats, setReceiverChats] = useState([]);
  const [senderChats, setSenderChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const pathName = usePathname();
  const ids = pathName.split("/")[2];
  const sender = ids.split("-")[0];
  const receiver = ids.split("-")[1];

  useEffect(() => {
    const fetchReceiverData = async () => {
      const receiverRef = doc(firestore, "users", receiver);
      const receiverSnap = await getDoc(receiverRef);
      if (receiverSnap.exists()) {
        setReceiverData(receiverSnap.data());
      }
    };
    fetchReceiverData();
    return () => {};
  }, []);

  useEffect(() => {
    let chatRef = doc(firestore, "chats", `${sender}-${receiver}`);
    const unsubscribe = onSnapshot(chatRef, (doc) => {
      if (doc.exists()) {
        setSenderChats(doc.data().messages);
      }
    });

    const userRef = doc(firestore, "chats", `${receiver}-${sender}`);
    const userUnsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setReceiverChats(doc.data().messages);
      }
    });

    return () => {
      unsubscribe();
      userUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!senderChats.isEmpty && !receiverChats.isEmpty) {
      mergeMessages(senderChats, receiverChats);
      setLoading(false);
    }
  }, [senderChats, receiverChats]);

  function mergeMessages(senderChats, receiverChats) {
    let mergedMessages = [...senderChats, ...receiverChats];
    mergedMessages.sort((a, b) => a.timestamp - b.timestamp);
    setChats(mergedMessages);
  }

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try {
      const chatRef = doc(firestore, "chats", `${sender}-${receiver}`);

      const chatSnap = await getDoc(chatRef);

      const newMessage = {
        message: inputMessage,
        sender: sender,
        receiver: receiver,
        timestamp: Timestamp.now(),
      };

      if (chatSnap.exists()) {
        await updateDoc(chatRef, {
          messages: arrayUnion(newMessage),
        });
        setInputMessage("");
      } else {
        const chatDoc = {
          users: [sender, receiver].sort(),
          messages: [newMessage],
          timestamp: Timestamp.now(),
        };
        await setDoc(chatRef, chatDoc);
        setInputMessage("");
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
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="">
        <div className="bg-gray-50 text-black p-6 w-full">
          <h1 className="text-xl first-letter:uppercase text-center">
            {receiverData.firstName} {receiverData.lastName}
          </h1>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col flex-grow overflow-y-scroll mt-2">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === sender ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-xs mx-2 p-2 rounded-lg ${
                    chat.sender === sender
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            ))}
          </div>
        )}
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
            className="px-4 py-2 ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chats;
