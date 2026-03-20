import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  searchResults: [],
  isSearching: false,
  pinnedChats: [],
  isTyping: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");

      const fetchedUsers = Array.isArray(res.data)
        ? res.data
        : res.data.users || [];
      const fetchedPins = res.data.pinnedChats || [];

      set({
        users: fetchedUsers,
        pinnedChats: fetchedPins,
      });
    } catch (error) {
      toast.error("Failed to load sidebar");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (userId === "gemini-ai-bot") return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setMessages: (newMessages) => {
    set({ messages: newMessages, isMessagesLoading: false });
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const authUser = useAuthStore.getState().authUser;
    if (selectedUser?._id === "gemini-ai-bot") {
      const userMsg = {
        _id: Date.now().toString(),
        text: messageData.text,
        senderId: authUser._id,
        createdAt: new Date().toISOString(),
      };

      set({ messages: [...messages, userMsg] });

      try {
        const res = await axiosInstance.post("/ai/gemini", {
          prompt: messageData.text,
        });

        set({ messages: [...get().messages, res.data] });
      } catch (error) {
        toast.error(error.response?.data?.message || "Gemini failed");
      }
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...get().messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  searchUsers: async (query) => {
    if (!query) return set({ searchResults: [] });
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/messages/search?query=${query}`);
      set({ searchResults: res.data });
    } catch (error) {
      toast.error("Search failed");
    } finally {
      set({ isSearching: false });
    }
  },

  pinChat: async (userId) => {
    const previousPins = get().pinnedChats;

    const isCurrentlyPinned = previousPins.includes(userId);
    const updatedPins = isCurrentlyPinned
      ? previousPins.filter((id) => id !== userId)
      : [...previousPins, userId];

    set({ pinnedChats: updatedPins });

    try {
      const res = await axiosInstance.post(`/messages/pin/${userId}`);
      set({ pinnedChats: res.data });
    } catch (error) {
      set({ pinnedChats: previousPins });
      toast.error("Failed to pin chat");
    }
  },

  removeChat: async (userId) => {
    try {
      await axiosInstance.post(`/messages/hide/${userId}`);
      set({ users: get().users.filter((u) => u._id !== userId) });

      if (get().selectedUser?._id === userId) {
        set({ selectedUser: null });
      }

      toast.success("Chat removed from view");
    } catch (error) {
      console.error("Error in removeChat:", error);
      toast.error(error.response?.data?.message || "Failed to remove chat");
    }
  },

  setSelectedUser: (user) => {
    const { users } = get();
    if (
      user &&
      user._id !== "gemini-ai-bot" &&
      !users.find((u) => u._id === user._id)
    ) {
      set({ users: [user, ...users] });
    }

    set({ selectedUser: user });

    if (user) {
      if (user._id === "gemini-ai-bot") {
        get().setMessages([
          {
            _id: "ai-welcome",
            text: "Hello! I'm your AI assisstant. How can I help you today?",
            senderId: "gemini-ai-bot",
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        get().getMessages(user._id);
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
