import React from "react";
import { format } from "date-fns";
import { ChatMessage } from "@/types/entity";

interface ChatBubbleProps {
  msg: ChatMessage;
  currentUserId: string; 
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ msg, currentUserId }) => {
  const isMe = msg.senderId === currentUserId;
  const timeStr = format(new Date(msg.timestamp), "HH:mm");

  return (
    <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm flex flex-col ${
          isMe
            ? "bg-primary text-white rounded-tr-none"
            : "bg-muted border border-border text-foreground rounded-tl-none"
        }`}
      >
        <div className="text-[14px] leading-relaxed break-words">
          {msg.content}
        </div>

        <div
          className={`text-[10px] mt-1 opacity-70 select-none ${
            isMe ? "text-right text-white" : "text-left text-muted-foreground"
          }`}
        >
          {timeStr}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatBubble);