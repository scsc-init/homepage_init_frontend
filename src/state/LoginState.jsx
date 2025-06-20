import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useLoginStore = create(
  persist(
    (set) => ({
      id: "",
      email: "",
      name: "",
      phone: "",
      student_id: "",
      major_id: null,
      role: "",
      status: "",
      jwt: "",

      setId: (id) => set({ id }),
      setEmail: (email) => set({ email }),
      setName: (name) => set({ name }),
      setPhone: (phone) => set({ phone }),
      setStudentId: (student_id) => set({ student_id }),
      setMajorId: (major_id) => set({ major_id }),
      setRole: (role) => set({ role }),
      setStatus: (status) => set({ status }),
      setJwt: (jwt) => set({ jwt }),

      logout: () =>
        set({
          id: "",
          email: "",
          name: "",
          phone: "",
          student_id: "",
          major_id: null,
          role: "",
          status: "",
          jwt: "",
        }),
    }),
    {
      name: "login-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
