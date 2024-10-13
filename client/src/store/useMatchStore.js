import { create } from "zustand";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import axios from "axios";

export const useMatchStore = create((set) => ({
    matches: [],
    isLoadingMyMatches: false,
    isLoadingUserProfiles: false,
    userProfiles: [],
    swipeFeedback: null,


    getMyMatches: async () => {
        try {
            set({ isLoadingMyMatches: true });
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matches`, {
                withCredentials: true,
            });
            console.log('res', res);
            set({ matches: res.data.matches });
        } catch (error) {
            set({ matches: [] });
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ isLoadingMyMatches: false });
        }
    },


    getUserProfiles: async () => {
        try {
            set({ isLoadingUserProfiles: true });
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/matches/user-profiles`, {
                withCredentials: true,
            });
            set({ userProfiles: res.data.users });
        } catch (error) {
            set({ userProfiles: [] });
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ isLoadingUserProfiles: false });
        }
    },

    swipeLeft: async (user) => {
        try {
            set({ swipeFeedback: "passed" });
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/matches/swipe-left/` + user._id, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to swipe left");
        } finally {
            setTimeout(() => set({ swipeFeedback: null }), 1500);
        }
    },
    swipeRight: async (user) => {
        try {
            set({ swipeFeedback: "liked" });
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/matches/swipe-right/` + user._id, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to swipe right");
        } finally {
            setTimeout(() => set({ swipeFeedback: null }), 1500);
        }
    },


    subscribeToNewMatches: () => {
        try {
            const socket = getSocket();

            socket.on("newMatch", (newMatch) => {
                set((state) => ({
                    matches: [...state.matches, newMatch],
                }));
                toast.success("You got a new match!");
            });
        } catch (error) {
            console.log(error);
        }
    },

    unsubscribeFromNewMatches: () => {
        try {
            const socket = getSocket();
            socket.off("newMatch");
        } catch (error) {
            console.error(error);
        }
    },
}));