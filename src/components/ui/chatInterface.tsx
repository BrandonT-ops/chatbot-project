"use client";

import React, { useState, useRef } from "react";
import { useChatStore, MessageType, FileMetadata } from "@/lib/store";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage, clearMessages } = useChatStore();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setPendingFiles((prev) => [...prev, ...files]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && pendingFiles.length === 0) return;

    // Prepare file metadata
    const fileMetadata: FileMetadata[] = pendingFiles.map((file) => ({
      name: file.name,
      type: file.type,
    }));

    // Create user message
    const userMessage: MessageType = {
      role: "user",
      content: input,
      files: fileMetadata,
      images: pendingFiles
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file)),
    };

    addMessage(userMessage);

    setIsTyping(true);

    try {
      // Send to Django backend
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.message) {
        // Add AI response
        const aiMessage: MessageType = {
          role: "assistant",
          content: data.message.content,
          images: data.message.images || [],
          metadata: data.message.metadata || {},
        };

        addMessage(aiMessage);
      } else {
        console.error("Invalid response structure:", data);
      }

      // Reset input and files
      setInput("");
      setPendingFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageContent = (msg: MessageType) => {
    return (
      <div className="space-y-2">
        {/* Text content */}
        {msg.content && <p className="text-gray-800 text-sm">{msg.content}</p>}

        {/* Image preview */}
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
        )}

        {/* File attachments */}
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
        )}
      </div>
    );
  };

  const handleClearChat = () => {
    clearMessages();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen pt-16 bg-white"
    >
      <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col mt-8">
        {/* Container with centered content */}
        <div className="flex-grow bg-white rounded-lg p-6">
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
          <div className="flex-grow overflow-y-auto mb-6 space-y-4">
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
                  Hi there! I&apos;m Maguida, your personal shopping
                  assistant. I can help you find the perfect product! Just
                  tell me what you&apos;re looking for.
                </p>
              </div>
            </motion.div>

            {/* Existing Messages */}
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex ${
                  msg.role === "user" ? "justify-start" : "justify-start"
                }`}
              >
                {msg.role === "user" ? (
                  // User message
                  <div className="flex items-start space-x-3 my-3">
                    <Image
                      width={100}
                      height={100}
                      alt="Pp"
                      src="assets/profile_picture.svg"
                      className="size-8 rounded-full"
                    />
                    <div className="bg-white px-1 rounded-lg flex-grow">
                      <div className="flex items-center mb-2">
                        <span className="font-semibold text-gray-800 mr-2">
                          User
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm text-justify max-w-4xl">
                        {renderMessageContent(msg)}
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
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

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

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
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
              className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition"
            >
              <PaperClipIcon className="h-5 w-5 text-gray-700" />
            </button>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Send
            </button>

            {/* Clear Chat button */}
            <button
              onClick={handleClearChat}
              className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition flex items-center"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Clear Chat
            </button>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 py-4 mt-4">
          © {new Date().getFullYear()} Richenel&apos;s AI Agency. All rights
          reserved
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
