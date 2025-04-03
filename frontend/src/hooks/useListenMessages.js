import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, message]);
    });

    return () => socket.off("newMessage");
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
