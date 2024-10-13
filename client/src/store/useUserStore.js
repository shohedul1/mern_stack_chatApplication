import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";

export const useUserStore = create((set) => ({
    loading: false,

    updateProfile: async (data) => {
        try {
            set({ loading: true });
            const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/update`, data, {
                withCredentials: true,
            });
            useAuthStore.getState().setAuthUser(res.data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log(error)
            // toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
}));