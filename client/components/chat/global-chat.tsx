"use client";

import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/store/useAuth";

interface IMessage {
  content: string;
  user_id: string;
  username: string;
  global: boolean;
}

const GlobalChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { user } = useAuth();

  const keydownEvent = useCallback((event: KeyboardEvent) => {
    if (event.code !== "Enter") return;

    sendMessage(message);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", keydownEvent);
  }, [keydownEvent]);

  useEffect(() => {});

  const sendMessage = (content: string) => {
    console.log(content);

    const newMessage: IMessage = {
      content,
      user_id: user?.id || "",
      username: user?.username || "",
      global: true,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="w-[20dvw] rounded-2xl bg-white shadow-sm px-3">
      Global
      <div>
        {messages.map((message, i) => (
          <div key={i}>{message.content}</div>
        ))}
      </div>
      <div className="flex flex-nowrap gap-1">
        <Input value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button
          size="icon"
          variant="ghost"
          onClick={() => sendMessage(message)}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};

export default GlobalChat;
