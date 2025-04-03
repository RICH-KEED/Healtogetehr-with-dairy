import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import axios from "../lib/axios";
import useGroupMessages from "../zustand/useGroupMessages";

const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages } = useGroupMessages();
  const { authUser } = useAuthStore();

  const sendGroupMessage = async (text, groupId, image = null, audio = null) => {
    if (!authUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    if (!text && !image && !audio) {
      toast.error("Message cannot be empty");
      return;
    }

    setLoading(true);
    console.log("Sending group message with audio:", !!audio);

    try {
      const response = await axios.post(`/groups/${groupId}/messages`, {
        text,
        image,
        audio,
      });
      
      console.log("Group message sent successfully:", response.data);
      setMessages([...messages, response.data]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending group message:", error);
      toast.error("Failed to send message");
      setLoading(false);
      throw error;
    }
  };

  return { loading, sendGroupMessage };
};

export default useSendGroupMessage;
