import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: typeof window !== "undefined" ? localStorage.getItem("chat-theme") || "coffee" : "coffee",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chat-theme", theme);
    }
    set({ theme });
  },
}));
