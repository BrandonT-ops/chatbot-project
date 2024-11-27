"use client";

import React, { useState } from "react";
import { useChatStore } from "@/lib/store";
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState("");
  const { messages, addMessage } = useChatStore();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({ role: "user", content: input });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: input }],
        }),
      });

      const data = await response.json();

      // Add AI response
      addMessage(data.message);
    } catch (error) {
      console.error("Chat error:", error);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-white">
      <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col mt-8">
        {/* Container with centered content */}
        <div className="flex-grow bg-white rounded-lg p-6">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Need help finding a product ?
          </h1>

          {/* Chat Messages Container */}
          <div className="flex-grow overflow-y-auto mb-6 space-y-4">
            {/* Default AI Initial Message */}
            <div className="flex items-start space-x-3">
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
            </div>

            {/* Existing Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100 text-left"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="flex items-center space-x-2  px-12">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="text-gray-900  text-sm flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Chat with me..."
            />
            <button className="bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition">
              <PaperClipIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition flex items-center"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2" />
              Send
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 py-4 mt-4">
          © {new Date().getFullYear()} Richenel’s AI Agency. All rights reserved
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
