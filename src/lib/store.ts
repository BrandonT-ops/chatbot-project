import { create } from 'zustand';

interface ChatStore {
  messages: Array<{role: 'user' | 'assistant', content: string}>;
  addMessage: (message: {role: 'user' | 'assistant', content: string}) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  clearMessages: () => set({ messages: [] })
}));