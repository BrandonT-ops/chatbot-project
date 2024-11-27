"use client";

import React, { useState, useRef } from "react";
import { useChatStore, MessageType, FileMetadata } from "@/lib/store";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage, searchResults } = useChatStore();

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

    try {
      // Prepare form data for backend
      const formData = new FormData();
      formData.append("message", input);
      pendingFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Send to Django backend
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Add AI response
      const aiMessage: MessageType = {
        role: "assistant",
        content: data.message,
        images: data.images,
        metadata: data.metadata,
      };

      addMessage(aiMessage);

      // Reset input and files
      setInput("");
      setPendingFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Chat error:", error);
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

  const renderSearchResults = () => {
    if (!searchResults) return null;

    if (searchResults.isLoading) {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Searching for {searchResults.query}...
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border rounded-lg p-4 shadow-sm animate-pulse"
                >
                  <div className="h-48 bg-gray-300 rounded-t-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Search Results for {searchResults.query}
          </h2>
          {searchResults.results.length === 0 ? (
            <p className="text-gray-600">No results found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.results.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <Image
                    src={product.image_url || "/api/placeholder/200/200"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                    unoptimized
                  />
                  <div className="mt-2">
                    <h3 className="font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">{product.price} FCFA</p>
                    <p
                      className={`text-sm ${
                        product.disponibilite === "Out of Stock !"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.disponibilite}
                    </p>
                    <Link href={product.url} passHref>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition inline-block text-center"
                      >
                        View Details
                      </a>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const writeNothing = () => {
    if (!searchResults) return null;
    return <div></div>;
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
            {searchResults
              ? `Search Results for "${searchResults.query}"`
              : "Need help finding a product?"}
          </motion.h1>

          {/* Chat Messages Container */}
          <div className="flex-grow overflow-y-auto mb-6 space-y-4">
            {searchResults ? (
              renderSearchResults()
            ) : (
              <>
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
              </>
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
          {searchResults ? (
            writeNothing()
          ) : (
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
            </motion.div>
          )}
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
