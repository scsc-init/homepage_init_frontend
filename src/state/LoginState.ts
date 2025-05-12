import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LoginState {
  session_token: string;
  login_token: string;

  name: string;
  id: string;
}

export interface LoginActions {
  setSessionToken: (session_token: string) => void;
  setLoginToken: (login_token: string) => void;
  setName: (name: string) => void;
  setId: (id: string) => void;
  logout: () => void;
}

export const useLoginStore = create<LoginState & LoginActions>()(
  persist(
    (set) => ({
      session_token: "",
      login_token: "",
      name: "",
      id: "",
      setSessionToken: (session_token) => set({ session_token }),
      setLoginToken: (login_token) => set({ login_token }),
      setName: (name) => set({ name }),
      setId: (id) => set({ id }),
      logout: () =>
        set({ session_token: "", login_token: "", name: "", id: "" }),
    }),
    {
      name: "login-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
