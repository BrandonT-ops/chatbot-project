import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MessageType = {
  is_user: boolean;
  content: string;
};

export type APIResponse = {
  message?: {
    content: string;
    images?: string[];
    user_answer?: string;
    query?: string;
    send_request?: boolean;
    metadata?: Record<string, unknown>;
  };
  error?: string;
};

//for usage through out the app
export type UserToken = {
  key: string;
  google_token: string;
};

// Add a new type for user authentication data
export interface UserData {
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
}

// Define types for conversation and message data
export interface Conversation {
  id: string;
  created_at: string;
  title: string;
}

export interface ConversationMessage {
  content: string;
  is_user: boolean;
}

export type FileMetadata = {
  name: string;
  type: string;
  url?: string;
};

export interface ProductSearchResult {
  url: string;
  name: string;
  price: number;
  disponibilite: string;
  categorie: string;
  image_url: string;
  score: number;
  description: string;
}

export interface ChatProductSearchResult {
  url: string;
  name: string;
  price: number;
  disponibilite: string;
  categorie: string;
  image_url: string;
  score: number;
  description: string;
}


export interface SearchResultType {
  query: string;
  results: ProductSearchResult[];
  isLoading?: boolean; // Add loading state
}

// Define the state interface
interface ChatStore {
  //login state
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  hasSyncedMessages: boolean;
  setHasSyncedMessages: (status: boolean) => void;

  // first message
  firstMessage: string | null;
  setFirstMessage: (first_message: string | null) => void;

  // Start State
  isStartState: boolean;
  setIsStartState: (state: boolean) => void;

  messages: MessageType[] | null;
  addMessage: (conversationMessage: ConversationMessage) => void;
  // updateMessage: (id: string, updates: Partial<ConversationMessage>) => void;
  clearMessages: () => void;

  // getUserToken: () => UserToken

  searchResults: SearchResultType | null;
  setSearchResults: (results: SearchResultType | null) => void;
  setSearchLoading: (isLoading: boolean) => void;
  clearSearch: () => void;

  // chatSearchResults: ChatProductSearchResult | null;
  // setChatSearchResults: (results: ChatProductSearchResult | null ) => void;

  conversation: Conversation | null;
  setConversation: (conversationId: string) => Conversation | undefined;

  conversations: Conversation[] | null;
  setConversations: (conversations: Conversation[]) => void;

  conversationMessages: ConversationMessage[] | null;
  setConversationMessages: (messages: ConversationMessage[]) => void;

  fetchConversations: (token: string | undefined) => Promise<void>;
  fetchConversationMessages: (
    conversationId: string,
    token: string
  ) => Promise<void>;
  createConversation: (
    message: string,
    token: string
  ) => Promise<Conversation | void>;
  addMessageToConversation: (
    conversationId: string,
    message: string,
    is_user: boolean,
    token: string
  ) => Promise<void>;

  // localAddMessage: (content: string, is_user: boolean) => void;

  clearConversationMessages: () => void;

  // New authentication-related state and methods
  userData: UserData | null;
  setUserData: (authData: UserData | null) => void;
  clearUserData: () => void;

  userToken: UserToken | null;
  setUserToken: (userToken: UserToken | null) => void;
  clearUserToken: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({

      hasSyncedMessages: false, // Flag to track if messages have been synced
      setHasSyncedMessages: (value: boolean) => set({ hasSyncedMessages: value }),

      isStartState: true,
      setIsStartState: (isStartState) => set({ isStartState: isStartState }),

      firstMessage: null,
      setFirstMessage: (firstMessage) => set({ firstMessage }),

      messages: [],
      addMessage: (conversationMessage: ConversationMessage) =>
        set((state) => ({
          conversationMessages: state.conversationMessages
            ? [
                ...state.conversationMessages,
                {
                  content: conversationMessage.content,
                  is_user: conversationMessage.is_user,
                },
              ]
            : [
                {
                  content: conversationMessage.content,
                  is_user: conversationMessage.is_user,
                },
              ],
        })),

      clearMessages: () => set({ messages: [] }),

      isLoggedIn: false, // Default to false
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),

      userData: null,
      setUserData: (authData: UserData | null) => set({ userData: authData }),
      clearUserData: () => set({ userData: null }),

      userToken: null,
      setUserToken: (userToken: UserToken | null) =>
        set({ userToken: userToken }),
      clearUserToken: () => set({ userToken: null }),

      searchResults: null,
      setSearchResults: (results: SearchResultType | null) =>
        set({ searchResults: results }),
      setSearchLoading: (isLoading: boolean) =>
        set((state) => ({
          searchResults: state.searchResults
            ? { ...state.searchResults, isLoading }
            : { query: "", results: [], isLoading },
        })),
      clearSearch: () => set({ searchResults: null }),

      conversations: [],
      setConversations: (conversations: Conversation[]) =>
        set({ conversations }),

      conversationMessages: [],
      setConversationMessages: (messages: ConversationMessage[]) =>
        set({ conversationMessages: messages }),

      conversation: null,
      setConversation: (conversationId: string) => {
        const state = get();
        const foundConversation = state.conversations?.find(
          (conv) => conv.id === conversationId
        );

        if (foundConversation) {
          set({ conversation: foundConversation });
          return foundConversation;
        }

        return undefined;
      },

      fetchConversations: async (token: string | undefined ) => {
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
        try {
          const response = await fetch(`${apiEndpoint}/chatbot/chat/`, {
            headers: { Authorization: `Token ${token}` },
          });
          const data: Conversation[] = await response.json();
          set({ conversations: data });
          // console.log(data);
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      },

      fetchConversationMessages: async (
        conversationId: string,
        token: string
      ) => {
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
        try {
          const response = await fetch(
            `${apiEndpoint}/chatbot/chat/${conversationId}`,
            {
              headers: { Authorization: `Token ${token}` },
            }
          );
          const data: ConversationMessage[] = await response.json();
          set({ conversationMessages: data });
          console.log(data);
        } catch (error) {
          console.error("Error fetching conversation messages:", error);
        }
      },

      createConversation: async (message: string, token: string) => {
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
        try {
          const response = await fetch(`${apiEndpoint}/chatbot/chat/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message }),
          });

          if (!response.ok) {
            throw new Error(
              `Erreur ${response.status}: ${response.statusText}`
            );
          }

          const data: Conversation = await response.json();
          console.log(data);

          set((state) => ({
            firstMessage: message,
            conversations: [...(state.conversations || []), data],
            conversation: data,
          }));
          return data;
        } catch (error) {
          console.error("Error creating conversation:", error);
        }
      },

      addMessageToConversation: async (
        conversationId: string,
        message: string,
        is_user: boolean,
        token: string
      ) => {
        const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
      
        // Optimistically update the state immediately
        set((state) => ({
          conversationMessages: [
            ...(state.conversationMessages || []),
            { content: message, is_user: is_user },
          ],
        }));
      
        try {
          const response = await fetch(
            `${apiEndpoint}/chatbot/chat/${conversationId}/`,
            {
              method: "POST",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: message, is_user: is_user }),
            }
          );
      
          const data: ConversationMessage = await response.json();
          console.log(data);
        
        } catch (error) {
          console.error("Error adding message to conversation:", error);
          // Optionally handle the error state (e.g., revert optimistically added message)
        }
      },
      

      clearConversationMessages: () => set({ conversationMessages: null }),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        messages: state.messages,
        searchResults: state.searchResults,
        conversation: state.conversation,
        conversations: state.conversations,
        conversationMessages: state.conversationMessages,
        userData: state.userData,
        userToken: state.userToken,
        isLoggedIn: state.isLoggedIn,
        firstMessage: state.firstMessage,
        hasSyncedMessages: state.hasSyncedMessages
      }),
    }
  )
);
