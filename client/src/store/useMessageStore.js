import { create } from "zustand";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

export const useMessageStore = create((set) => ({
    messages: [],
    loading: true,


    sendMessage: async (receiverId, content) => {
        try {
            const authUser = useAuthStore.getState().authUser;

            // Mockup the message for optimistic UI update
            const tempMessage = { _id: Date.now(), sender: authUser._id, content };
            set((state) => ({
                messages: [...state.messages, tempMessage],
            }));

            // Send the message via the backend API
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/send`,
                { receiverId, content },
                { withCredentials: true }
            );

            console.log("Message sent", res.data);
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }
    },


    getMessages: async (userId) => {
        try {
            set({ loading: true });
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages/conversation/${userId}`, {
                withCredentials: true,
            });
            set({ messages: res.data.messages });
        } catch (error) {
            console.log(error);
            set({ messages: [] });
        } finally {
            set({ loading: false });
        }
    },

    subscribeToMessages: () => {
        const socket = getSocket();
        socket.on("newMessage", ({ message }) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });
    },


    unsubscribeFromMessages: () => {
        const socket = getSocket();
        socket.off("newMessage");
    },
}));