import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  groupMessages: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       query: {
//         userId: authUser._id,
//       },
//     });
//     socket.connect();

//     set({ socket: socket });

//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });

//     socket.on("newGroupMessage", (message) => {
//   const { groupMessages } = get();

//   if (!groupMessages.find((m) => m._id === message._id)) {
//     set({
//       groupMessages: [...groupMessages, message],
//     });
//   }
// });
//   },
//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
  //   },
  connectSocket: () => {
  const { authUser } = get();

  if (!authUser || get().socket?.connected) return;

  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
  });

  socket.connect();

  set({ socket });

  // Online users
  socket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds || [] });
  });

  // Group messages
  // socket.on("newGroupMessage", (message) => {
  //   const { groupMessages } = get();

  //   const messages = groupMessages || []; // safety

  //   const exists = messages.find((m) => m._id === message._id);

  //   if (!exists) {
  //     set({
  //       groupMessages: [...messages, message],
  //     });
  //   }
    // });
  socket.off("newGroupMessage").on("newGroupMessage", (message) => {
  const { groupMessages } = get();

  const messages = groupMessages || [];

  if (!messages.find((m) => m._id === message._id)) {
    set({
      groupMessages: [...messages, message],
    });
  }
});
},
}));