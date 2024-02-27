"use client";

import {
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
  Timestamp,
  collection,
} from "firebase/firestore";

// const Chats = () => {
//   const [inputMessage, setInputMessage] = useState("");
//   const [chats, setChats] = useState([]);

//   const handleMessageSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const chatRef = doc(firestore, "chats", `${senderId}-${receiverId}`);

//       const chatSnap = await getDoc(chatRef);

//       const newMessage = {
//         message: inputMessage,
//         sender: senderId,
//         receiver: receiverId,
//         timestamp: Timestamp.now(),
//       };

//       if (chatSnap.exists()) {
//         await updateDoc(chatRef, {
//           messages: arrayUnion(newMessage),
//           timestamp: Timestamp.now(),
//         });
//       } else {
//         const chatDoc = {
//           users: [senderId, receiverId].sort(),
//           messages: [newMessage],
//           timestamp: Timestamp.now(),
//         };
//         await setDoc(chatRef, chatDoc);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     const fetchChats = async () => {
//       const receiverRef = doc(firestore, "users", receiver);
//       const receiverSnap = await getDoc(receiverRef);
//       if (receiverSnap.exists()) {
//         setReceiver(receiverSnap.data());
//         console.log(receiverSnap.data());
//       }
//       const q1 = query(
//         collection(firestore, "chats"),
//         where("sender", "==", sender),
//         where("receiver", "==", receiver),
//         orderBy("timestamp")
//       );

//       const q2 = query(
//         collection(firestore, "chats"),
//         where("sender", "==", receiver),
//         where("receiver", "==", sender),
//         orderBy("timestamp")
//       );

//       const [q1Snapshot, q2Snapshot] = await Promise.all([
//         getDocs(q1),
//         getDocs(q2),
//       ]);

//       let newChats = [
//         ...q1Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//         ...q2Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//       ];

//       setChats(newChats);
//       console.log(newChats);
//       setInputMessage("");
//     };
//   });

//   return (
//     <div>
//       <div className="flex flex-col justify-between items-start w-1/2 space-y-6 flex-grow">
//         <div className="bg-gray-50 text-black p-6 w-full">
//           <h1 className="text-xl first-letter:uppercase text-center">
//             {receiver.firstName} {receiver.lastName}
//           </h1>
//         </div>

//         <div className="flex flex-col w-full h-4/5 overflow-y-scroll">
//           {chats.map((chat) => (
//             <div
//               key={chat.id}
//               className={`flex flex-col  ${
//                 chat.sender === senderId ? "items-end" : "items-start"
//               }`}
//             >
//               {chat.messages.map((message) => (
//                 <p
//                   key={message.id} // Use message ID as key
//                   className={`${
//                     senderId === chat.sender
//                       ? " px-4 py-2 rounded-md relative inline-block hover:cursor-pointer  ml-2 mr-2 border-b-4 border-b-gray-100 bg-gray-900 border border-white text-gray-100"
//                       : "px-4 py-2 rounded-md text-sm ml-2 border-b-4 border-b-gray-900 text-gray-900 border border-black hover:cursor-pointer inline-block mr-2 "
//                   }`}
//                 >
//                   {message.message}
//                   <div className="text-xs absolute right-0 bottom">
//                     {senderId === chat.senderId ? "You" : ""}
//                   </div>
//                 </p>
//               ))}
//             </div>
//           ))}
//         </div>

//         <div className="p-4 w-full">
//           <form
//             className="w-full flex border border-black"
//             onSubmit={handleMessageSubmit}
//           >
//             <input
//               type="text"
//               placeholder="Type your message..."
//               className="flex-grow p-2 rounded-l-md outline-none border-black"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//             <button
//               type="submit"
//               className="px-4 py-2  ml-2 border-b-4 border-b-gray-900 outline-4 border border-black bg-gray-800 text-gray-100 hover:cursor-pointer"
//             >
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chats;

import { useParams, usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { firestore } from "../../firebase";

const page = () => {
  const { personal } = useContext(UserContext);
  const [inputMessage, setInputMessage] = useState("");
  const [receiverData, setReceiverData] = useState({});
  const [isSender, setIsSender] = useState(false);
  const [chats, setChats] = useState([]);

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
    console.log("sender", sender);
    const fetchChats = async () => {
      const q1 = query(
        collection(firestore, "chats"),
        where("sender", "==", sender),
        where("receiver", "==", receiver),
        orderBy("timestamp")
      );

      console.log("q1", q1);
      console.log("sender", sender);
      console.log("receiver", receiver);
    };
    fetchChats();
  }, []);

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
    <div>
      <div className="bg-gray-50 text-black p-6 w-full">
        <h1 className="text-xl first-letter:uppercase text-center">
          {receiverData.firstName} {receiverData.lastName}
        </h1>
      </div>

      <div className="flex flex-col w-full h-11/12 overflow-y-scroll">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex flex-col  ${
              chat.sender === sender ? "items-end" : "items-start"
            }`}
          >
            {chat.messages.map((message) => (
              <p
                key={message.id} // Use message ID as key
                className={`${
                  sender === chat.sender
                    ? " px-4 py-2 rounded-md relative inline-block hover:cursor-pointer  ml-2 mr-2 border-b-4 border-b-gray-100 bg-gray-900 border border-white text-gray-100"
                    : "px-4 py-2 rounded-md text-sm ml-2 border-b-4 border-b-gray-900 text-gray-900 border border-black hover:cursor-pointer inline-block mr-2 "
                }`}
              >
                {message.message}
                <div className="text-xs absolute right-0 bottom">
                  {sender === chat.sender ? "You" : ""}
                </div>
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 w-full justify-end flexl">
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
  );
};

export default page;
