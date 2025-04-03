import { useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import MessageContainer from "../components/messages/MessageContainer";
import { useAuthStore } from "../store/useAuthStore";

import NoChatSelected from "../components/NoChatSelected";
import useConversation from "../zustand/useConversation";

const Chat = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthStore();

  useEffect(() => {
    // Clean up function to reset selected conversation when component unmounts
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex sm:h-[calc(100vh-60px)] overflow-hidden bg-base-200 pt-16">
      <div className="flex h-full w-full max-w-6xl mx-auto">
        <Sidebar />
        {selectedConversation ? (
          <div className="md:min-w-[800px] w-full p-2 md:p-4 bg-base-100">
            <MessageContainer />
          </div>
        ) : (
          <NoChatSelected />
        )}
      </div>
    </div>
  );
};

export default Chat;
