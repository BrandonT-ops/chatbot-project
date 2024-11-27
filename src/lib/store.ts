import { create } from 'zustand';


export type MessageType = {
  id?: string;
  role: 'user' | 'assistant';
  content?: string;
  images?: string[];
  files?: FileMetadata[];
  metadata?: Record<string, unknown>;
}

export type FileMetadata = {
  name: string;
  type: string;
  url?: string;
}

interface ChatStore {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  updateMessage: (id: string, updates: Partial<MessageType>) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now().toString() }]
  })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),
  clearMessages: () => set({ messages: [] })
}));