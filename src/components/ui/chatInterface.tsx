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

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage } = useChatStore();

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

  // const renderMessageContent = (msg: MessageType) => {
  //   return (
  //     <div className="space-y-2">
  //       {/* Text content */}
  //       {msg.content && <p className="text-gray-800 text-sm">{msg.content}</p>}

  //       {/* Image preview */}
  //       {msg.images && msg.images.length > 0 && (
  //         <div className="flex flex-wrap gap-2">
  //           {msg.images.map((img, index) => (
  //             <Image
  //               key={index}
  //               src={img}
  //               alt={`Uploaded image ${index + 1}`}
  //               width={100}
  //               height={100}
  //               className="object-cover rounded-lg"
  //             />
  //           ))}
  //         </div>
  //       )}

  //       {/* File attachments */}
  //       {msg.files && msg.files.length > 0 && (
  //         <div className="space-y-1">
  //           {msg.files.map((file, index) => (
  //             <div
  //               key={index}
  //               className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg"
  //             >
  //               <DocumentIcon className="h-5 w-5 text-gray-500" />
  //               <span className="text-sm">{file.name}</span>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col py-4 md:py-8">
        {/* Main Content Container */}
        <div className="flex-grow bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-14 lg:mt-10 lg:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Need help finding a product?
          </h1>

          {/* Chat Messages Container */}
          <div className="flex-grow overflow-y-auto mb-4 sm:mb-6 space-y-3 sm:space-y-4">
            {/* Initial AI Message */}
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Image
                width={32}
                height={32}
                alt="Maguida Chat Icon"
                src="/assets/chat_icon.svg"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-white px-2 sm:px-3 rounded-lg flex-grow">
                <div className="flex items-center mb-1 sm:mb-2">
                  <span className="font-semibold text-gray-800 text-sm sm:text-base mr-2">
                    Maguida
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm text-justify">
                  Hi there! I&apos;m Maguida, your personal shopping assistant. 
                  I can help you find the perfect product! Just tell me what you&apos;re looking for.
                </p>
              </div>
            </div>

            {/* Messages List */}
            {messages.slice(1).map((msg, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                <Image
                  width={32}
                  height={32}
                  alt="Profile"
                  src="/assets/profile_picture.svg"
                  className="w-8 h-8 rounded-full"
                />
                <div className="bg-white px-2 sm:px-3 rounded-lg flex-grow">
                  <div className="flex items-center mb-1 sm:mb-2">
                    <span className="font-semibold text-gray-800 text-sm sm:text-base mr-2">
                      {msg.role === 'user' ? 'User' : 'Maguida'}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm text-justify">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* File Preview */}
          {pendingFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {pendingFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${file.name}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-20 h-20"
                    />
                  ) : (
                    <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                      <DocumentIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span className="text-xs sm:text-sm">{file.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Section */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="text-gray-900 text-xs sm:text-sm flex-grow p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Chat with me..."
            />

            <button
              onClick={triggerFileInput}
              className="bg-gray-200 p-2 sm:p-3 rounded-lg hover:bg-gray-300 transition"
            >
              <PaperClipIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
            </button>

            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Send</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs sm:text-sm py-4 mt-4">
          © {new Date().getFullYear()} Richenel&apos;s AI Agency. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
