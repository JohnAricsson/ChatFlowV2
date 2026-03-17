import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100/50 backdrop-blur-md">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-transparent relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSentByMe ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border-2 border-base-100 shadow-sm overflow-hidden">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="object-cover size-full"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-[10px] font-bold uppercase tracking-wider opacity-40 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div
                className={`chat-bubble max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm flex flex-col gap-2 
                ${
                  isSentByMe
                    ? "bg-primary text-primary-content shadow-primary/10"
                    : "bg-base-200/80 backdrop-blur-sm border border-white/5 text-base-content"
                }`}
              >
                {message.image && (
                  <div className="relative group">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-xl max-h-[300px] object-cover shadow-lg border border-white/10"
                    />

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  </div>
                )}

                {message.text && (
                  <p className="text-sm leading-relaxed font-medium">
                    {message.text}
                  </p>
                )}
              </div>

              <div className="chat-footer opacity-40 text-[10px] mt-1 font-bold">
                {isSentByMe && "Delivered"}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
