import { create } from "zustand";
import axios from "../lib/axios";

const useConversation = create((set) => ({
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,
  
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),

  getMessages: async (conversationId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/messages/${conversationId}`);
      set({ messages: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useConversation;
