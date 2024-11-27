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

export interface ProductSearchResult {
  url: string;
  name: string;
  price: number;
  disponibilite: string;
  categorie: string;
  image_url: string;
  score: number;
}

export interface SearchResultType {
  query: string;
  results: ProductSearchResult[];
  isLoading?: boolean; // Add loading state
}

interface ChatStore {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  updateMessage: (id: string, updates: Partial<MessageType>) => void;
  clearMessages: () => void;
  
  // Separate search-related states
  searchResults: SearchResultType | null;
  setSearchResults: (results: SearchResultType | null) => void;
  setSearchLoading: (isLoading: boolean) => void;
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
  clearMessages: () => set({ messages: [] }),
  
  // Updated search-related methods
  searchResults: null,
  setSearchResults: (results) => set({ searchResults: results }),
  setSearchLoading: (isLoading) => set((state) => ({
    searchResults: state.searchResults 
      ? { ...state.searchResults, isLoading } 
      : { query: '', results: [], isLoading }
  })),
}));