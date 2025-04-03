import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../../store/useAuthStore";
import useListenMessages from "../../hooks/useListenMessages";

const MessageContainer = ({ selectedConversation }) => {
  const { authUser } = useAuthStore();
  const { messages, loading } = useGetMessages(selectedConversation._id);
  const lastMessageRef = useRef();

  // Listen for incoming messages with socket.io
  useListenMessages();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-base-100">
      <div className="sticky top-0 z-10 p-4 border-b bg-base-100">
        <span className="font-bold text-lg">
          {selectedConversation.fullName}
        </span>
      </div>

      {/* Messages section with flex-1 to take available space */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && [...Array(3)].map((_, i) => <MessageSkeleton key={i} />)}

        {!loading &&
          messages.map((message, idx) => (
            <div key={message._id || idx} ref={idx === messages.length - 1 ? lastMessageRef : null}>
              <Message message={message} />
            </div>
          ))}
      </div>

      {/* Message input always at the bottom */}
      <MessageInput conversationId={selectedConversation._id} />
    </div>
  );
};

export default MessageContainer;