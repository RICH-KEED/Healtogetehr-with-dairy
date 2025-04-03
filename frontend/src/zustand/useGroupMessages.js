import { create } from "zustand";
import axios from "../lib/axios";

const useGroupMessages = create((set) => ({
  selectedGroup: null,
  messages: [],
  loading: false,
  error: null,
  
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setMessages: (messages) => set({ messages }),

  getMessages: async (groupId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/groups/${groupId}/messages`);
      set({ messages: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useGroupMessages;
