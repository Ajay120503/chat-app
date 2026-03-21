import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],

  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error("Failed to load groups");
    }
  },

  createGroup: async (data) => {
    try {
      const res = await axiosInstance.post("/groups/create", data);

      set({
        groups: [...get().groups, res.data],
      });

      toast.success("Group created");
    } catch (error) {
      toast.error("Failed to create group");
    }
  },

  getGroupMessages: async (groupId) => {
    try {
      const res = await axiosInstance.get(`/groups/messages/${groupId}`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error("Failed to load messages");
    }
  },

  sendGroupMessage: async ({ text, image, file }) => {
  const { selectedGroup, groupMessages } = get();

  try {
    const res = await axiosInstance.post(
      `/groups/send/${selectedGroup._id}`,
      { text, image, file }
    );

    set({
      groupMessages: [...groupMessages, res.data],
    });
  } catch (error) {
    toast.error("Failed to send message");
  }
},

  subscribeToGroupMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newGroupMessage", (message) => {
      set({
        groupMessages: [...get().groupMessages, message],
      });
    });
  },

  addMembersToGroup: async (groupId, members) => {
  try {
    const res = await axiosInstance.post("/groups/add-members", {
      groupId,
      members,
    });

    // Update groups list
    const updatedGroups = get().groups.map((group) =>
      group._id === groupId ? res.data : group
    );

    set({ groups: updatedGroups });

    toast.success("Members added successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to add members");
  }
},

  setSelectedGroup: (group) => set({ selectedGroup: group }),
}));

