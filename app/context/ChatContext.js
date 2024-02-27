"use client";
import { createContext, useContext, useState } from "react";

const Chatcontext = createContext();

export function ChatProvider({ children }) {
  const [chat, setChat] = useState(null);
  return (
    <Chatcontext.Provider value={{ chat, setChat }}>
      {children}
    </Chatcontext.Provider>
  );
}

export function useChat() {
  return useContext(Chatcontext);
}
