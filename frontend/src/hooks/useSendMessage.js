import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";
import { useAuthStore } from "../store/useAuthStore";
import axios from "../lib/axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useConversation();
  const { authUser } = useAuthStore();

  const sendMessage = async (text, conversationId, image = null, audio = null) => {
    if (!authUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    if (!text && !image && !audio) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);
    console.log("Sending message with audio:", !!audio);

    try {
      const response = await axios.post(`/messages/send/${conversationId}`, {
        text,
        image,
        audio,
      });
      
      console.log("Message sent successfully:", response.data);
      setMessages([...messages, response.data]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setLoading(false);
      throw error;
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
