"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  //  useEffect
} from "react";
import {
  useChatStore,
  // MessageType,
  ConversationMessage,
} from "@/lib/store";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
  UserIcon,
  //TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Define API response type
interface APIResponse {
  message?: {
    content: string;
    images?: string[];
    metadata?: Record<string, unknown>;
  };
  error?: string;
}

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { addMessage, conversationMessages } = useChatStore();
  const {
    addMessageToConversation,
    createConversation,
    conversation,
    userData,
    // fetchConversationMessages,
    userToken,
    setIsStartState,
    setFirstMessage,
    fetchConversations,
     firstMessage,
     isStartState,
    // clearMessages,
  } = useChatStore();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError(`Unsupported file type: ${file.name}`);
        return false;
      }

      if (file.size > maxSize) {
        setError(`File too large: ${file.name} (max 5MB)`);
        return false;
      }

      return true;
    });

    setPendingFiles((prev) => [...prev, ...validFiles]);
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Create user message
    const userMessage: ConversationMessage = {
      is_user: true,
      content: input,
    };

    setIsTyping(true);
    setError(null);
    if(isStartState){
      setFirstMessage(input);
      setIsStartState(false);
    }

    try {
      // Start typing indicator
      setIsTyping(true);
  
      // API call for message response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationMessages ? [...conversationMessages, userMessage] : [userMessage],
          metadata: {
            fileCount: pendingFiles.length,
            inputLength: input.length,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: APIResponse = await response.json();
      console.log(data);
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      const aiMessage: ConversationMessage = {
        is_user: false,
        content: data.message!.content,
      };
  
      // Sync with backend if userToken exists
      if (userToken?.key) {
        if (!conversation && firstMessage) {
          await createConversation(firstMessage, userToken.key);
          setIsStartState(false);
        }
        // else if(conversation && !isStartState){
            
        // }
  
        // Add user message to state and send API call to update backend
        await addMessageToConversation(conversation!.id, input, true, userToken.key);
  
        // Add AI response to backend as well
        await addMessageToConversation(conversation!.id, aiMessage.content, false, userToken.key);
      } else {
        addMessage(userMessage);
        addMessage(aiMessage);
      }
  
      // Stop typing indicator after AI response
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false); // Stop typing indicator on error
    }  finally {
      // Reset input and pending files, and stop typing indicator

      setInput("");
      setPendingFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input element
      }
      setIsTyping(false);
    }
  }, [
    input,
    pendingFiles,
    addMessageToConversation,
    conversation,
    conversationMessages,
    addMessage,
    createConversation,
    userToken,
    isStartState,
    setIsStartState,
    setFirstMessage,
    //clearMessages,
    
    firstMessage
  ]);

  const renderMessageContent = (msg: ConversationMessage) => {
    return (
      <div className="space-y-2">
        {/* Text content */}
        {msg.content && <p className="text-gray-800 text-sm">{msg.content}</p>}

        {/* Image preview
        {msg.images && msg.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={img}
                  alt={`Uploaded image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg"
                />
              </motion.div>
            ))}
          </div>
        )} */}

        {/* File attachments
        {msg.files && msg.files.length > 0 && (
          <div className="space-y-1">
            {msg.files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg"
              >
                <DocumentIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm">{file.name}</span>
              </motion.div>
            ))}
          </div>
        )} */}
      </div>
    );
  };

  // useEffect(() => {
  //   const conversationId = conversation?.id; // Replace with actual conversation ID
  //   const userTokening = userToken?.key; // Replace with the logged-in user's token
  
  //   if (userTokening) {
  //     syncMessagesToBackend(conversationId ?? "", userToken.key);
  //     fetchConversations(conversationId);
  //   }
  // }, []);

  // const syncMessagesToBackend = async (
  //   conversationId: string ,
  //   userToken: string
  // ) => {
  //   const state = useChatStore.getState(); 
  //   const messages = state.conversationMessages || []; // Get stored messages

  //   if (state.hasSyncedMessages) {
  //     console.log("Messages already synced.");
  //     return;
  //   }
  
  //   for (const message of messages) {
  //     try {
  //       // Send each message to the backend
  //       await state.addMessageToConversation(
  //         conversationId,
  //         message.content,
  //         message.is_user,
  //         userToken
  //       );
  //       console.log("Message synced:", message);
  //     } catch (error) {
  //       console.error("Error syncing message:", message, error);
  //     }
  //   }
  //   state.setHasSyncedMessages(true);
  // };
  

  // useEffect(() => {
  //   if (messageContainerRef.current) {
  //     messageContainerRef.current.scrollTo({
  //       top: messageContainerRef.current.scrollHeight,
  //       behavior: "smooth",
  //     });
  //   }
  // }, [conversationMessages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen pt-16 bg-white"
    >
      <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col mt-8">
        {/* Container with centered content */}

        <div className="flex-grow bg-white rounded-lg p-6 flex flex-col">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            Need help finding a product?
          </motion.h1>

          {/* Chat Messages Container */}
          <div
            ref={messageContainerRef}
            className="flex-grow overflow-y-auto mb-6 space-y-4 p-4 bg-white rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            {/* {isStartState ? ( */}
            {/* // Render only the Default AI Initial Message */}
            {/* <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <Image
                  width={100}
                  height={100}
                  alt="Pp"
                  src="assets/chat_icon.svg"
                  className="size-8 rounded-full"
                />
                <div className="bg-white px-1 rounded-lg flex-grow ">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-800 mr-2">
                      Maguida
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm text-justify max-w-4xl">
                    Hi there! I&apos;m Maguida, your personal shopping
                    assistant. I can help you find the perfect product! Just
                    tell me what you&apos;re looking for.
                    { }
                  </p>
                </div>
              </motion.div> */}
            {/* ) : ( */}
            {/* // Render Default AI Message + Existing Messages */}

            {/* State syncing is harash */}
            {/* Default AI Initial Message */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start space-x-3"
            >
              <Image
                width={100}
                height={100}
                alt="Pp"
                src="assets/chat_icon.svg"
                className="size-8 rounded-full"
              />
              <div className="bg-white px-1 rounded-lg flex-grow ">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800 mr-2">
                    Maguida
                  </span>
                </div>
                <p className="text-gray-600 text-sm text-justify max-w-4xl">
                  Hi there! I&apos;m Maguida, your personal shopping assistant.
                  I can help you find the perfect product! Just tell me what
                  you&apos;re looking for.
                </p>
              </div>
            </motion.div>

            {/* Existing Messages */}

            {conversationMessages && conversationMessages.length > 0 ? (
              <>
                {conversationMessages!.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${
                      msg.is_user ? "justify-start" : "justify-start"
                    }`}
                  >
                    {msg.is_user ? (
                      // User message
                      <div className="flex items-start space-x-3 my-3">
                        {userData?.profilePicture ? (
                          <div className="relative">
                            {userData?.profilePicture ? (
                              <Image
                                width={100}
                                height={100}
                                alt={
                                  userData?.firstname
                                    ? `${userData.firstname
                                        .charAt(0)
                                        .toUpperCase()}`
                                    : "Profile Picture"
                                }
                                src={userData?.profilePicture}
                                className="size-8 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="size-8 p-1 text-gray-400 bg-gray-200 rounded-full" />
                            )}
                          </div>
                        ) : (
                          <UserIcon className="size-8 p-1 text-gray-400 bg-gray-200  rounded-full" />
                        )}
                        <div className="bg-white px-1 rounded-lg flex-grow">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-gray-800 mr-2">
                              {userData?.firstname || "User"}
                            </span>
                          </div>
                          <div className="text-gray-600 text-sm text-justify max-w-4xl">
                            {renderMessageContent(msg)}
                            {/* {msg.content} */}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // AI message
                      <div className="flex items-start space-x-3">
                        <Image
                          width={100}
                          height={100}
                          alt="Maguida Chat Icon"
                          src="assets/chat_icon.svg"
                          className="size-8 rounded-full"
                        />
                        <div className="bg-white px-1 rounded-lg flex-grow">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-gray-800 mr-2">
                              Maguida
                            </span>
                          </div>
                          <div className="text-gray-600 text-sm text-justify max-w-4xl">
                            {renderMessageContent(msg)}
                            {/* {msg.content} */}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                {/* Loading ... */}
              </div>
            )}

            {/* )} */}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <Image
                  width={100}
                  height={100}
                  alt="Maguida Chat Icon"
                  src="assets/chat_icon.svg"
                  className="size-8 rounded-full"
                />
                <div className="bg-white px-1 rounded-lg flex-grow">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold text-gray-800 mr-2">
                      Maguida
                    </span>
                  </div>
                  <div className="text-gray-600 text-sm text-justify max-w-4xl">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <span>Typing...</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </div>

          {/* File Preview */}
          {pendingFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {pendingFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${file.name}`}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                      <DocumentIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2 max-w-3xl mx-auto"
            >
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx,.txt,.png,.svg,.jpg,.jpeg"
              />

              {/* Text input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="text-gray-900 text-sm flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Chat with me..."
              />

              {/* File upload button */}
              <button
                onClick={triggerFileInput}
                disabled
                className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition"
              >
                <PaperClipIcon className="h-5 w-5 text-gray-700" />
              </button>

              {/* Clear Chat button
              <button
                onClick={handleClearChat}
                className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition flex items-center"
              >
                <TrashIcon className="h-5 w-5" />
              </button> */}

              {/* Send button */}
              <button
                onClick={handleSendMessage}
                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition flex items-center"
              >
                <PaperAirplaneIcon className="h-5 w-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </motion.div>
            {/* Copyright */}
            <div className="text-center text-gray-500 py-4 mt-4 text-xs">
              © {new Date().getFullYear()} Richenel&apos;s AI Agency. All rights
              reserved.{" "}
              <Link
                href="/conditions"
                className="text-gray-900 hover:underline"
              >
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
