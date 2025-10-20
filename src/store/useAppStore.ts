import { create } from "zustand";

type TodoState = {
  normalTodos: number;
  challengingTodos: number;
  addNormalTodo: () => void;
  setNormalTodo: (total: number) => void;
  deleteNormalTodo: () => void;
  setChallengingTodo: (total: number) => void;
  deleteChallengingTodo: () => void;
  addChallengingTodo: (total:number) => void;
};
type AuthState = {
  isLoggedIn:boolean,
  fetchLogin: () => void,
  fetchLogout: () => void,
}

export const useAuthStore = create<AuthState>((set)=>({
  isLoggedIn:false,
  fetchLogin:() =>
    set(() => ({
      isLoggedIn:true
    })),
  fetchLogout:() =>
    set(() => ({
      isLoggedIn:false
    })),
}))

export const useTodoStore = create<TodoState>((set) => ({
  normalTodos: 0,
  challengingTodos: 0,
  addNormalTodo: () =>
    set((state) => ({
      normalTodos: state.normalTodos + 1
    })),
  setNormalTodo: (total) =>
    set(() => ({
      normalTodos: total,
    })),
  deleteNormalTodo: () =>
    set((state) => ({
      normalTodos: state.normalTodos - 1,
    })),
  setChallengingTodo: (total) =>
    set(() => ({
      challengingTodos: total,
    })),
  deleteChallengingTodo: () =>
    set((state) => ({
      challengingTodos: state.challengingTodos - 1,
    })),
  addChallengingTodo: (total) =>
    set((state) => ({
      challengingTodos: state.challengingTodos + total
    })),
}));
