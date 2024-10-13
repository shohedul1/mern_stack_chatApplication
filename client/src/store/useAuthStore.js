import { create } from "zustand";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";
import axios from "axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    checkingAuth: true,
    loading: false,

    signup: async (signupData) => {
        try {
            set({ loading: true });

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, signupData, {
                withCredentials: true,
            });
            set({ authUser: res.data.user });
            initializeSocket(res.data.user._id);

            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    login: async (loginData) => {
        try {
            set({ loading: true });
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, loginData, {
                withCredentials: true, // Allows cookies to be included
            });

            set({ authUser: res.data.user });
            initializeSocket(res.data.user._id);
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            // Send the logout request with credentials
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
                {}, // You can send an empty object if needed
                {
                    withCredentials: true, // Important for cookie management
                }
            );

            if (res.status === 200) {
                // Clear the authUser state
                set({ authUser: null });
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },


    checkAuth: async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                withCredentials: true,
            });
            initializeSocket(res.data.user._id);
            set({ authUser: res.data.user });
        } catch (error) {
            set({ authUser: null });
            console.log(error);
        } finally {
            set({ checkingAuth: false });
        }
    },

    setAuthUser: (user) => set({ authUser: user }),
}));