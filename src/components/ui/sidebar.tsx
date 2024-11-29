"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  // Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useChatStore } from "@/lib/store";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState([
    { id: 1, title: "React Project Discussion" },
    { id: 2, title: "Design System Review" },
    { id: 3, title: "Performance Optimization" },
  ]);
  const [visibleConversations, setVisibleConversations] = useState(5);

  const { clearUserToken, clearMessages, clearSearch, clearUserData, setIsLoggedIn } = useChatStore();


  const handleLogout = () => {
    // Clear the authentication data in the store
    clearUserToken();
    clearMessages();
    clearSearch();
    clearUserData();
    setIsLoggedIn(false)
    
    // Optional: Add any additional logout logic, like:
    // - Redirecting to login page
    // - Clearing other app state
    // - Calling a backend logout endpoint
  };

  // Check screen size and set mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-close on mobile
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const addNewConversation = () => {
    const newConversationId = conversations.length + 1;
    setConversations([
      ...conversations,
      {
        id: newConversationId,
        title: `New Conversation ${newConversationId}`,
      },
    ]);
  };

  // const handleSelectConversation = async (conversationId: string) => {
  //  // clearMessages();
  //   // if (token) {
  //   //   await fetchConversationMessages(conversationId, token);
  //   // }
  // };

  const handleSeeMore = () => {
    setVisibleConversations((prev) => prev + 5);
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen 
          bg-white shadow-lg 
          transition-all duration-300 
          z-50
          ${
            isMobile
              ? isOpen
                ? "w-64 translate-x-0"
                : "-translate-x-full"
              : isOpen
              ? "w-64"
              : "w-16"
          }
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3.5 border-b shadow-sm ">
          {isOpen && (
            <div className="flex flex-row">
              <Image
                src={"/assets/app_logo.svg"}
                alt="logo"
                width={100}
                height={100}
                className="object-cover w-8 h-auto rounded justify-center my-auto mr-3"
              />
              <h2 className="text-xl font-bold text-gray-800">Maguida</h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto p-2 bg-gray-500 hover:bg-gray-600 rounded-full"
          >
            {isOpen ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Add Conversation Button */}
        <button
          onClick={addNewConversation}
          className={`
            flex items-center 
            m-4 p-2 
            bg-gray-500 text-white 
            rounded-md 
            hover:bg-gray-600 
            transition-all
            ${!isOpen && "justify-center"}
          `}
        >
          <PlusIcon className={`h-5 w-5 ${isOpen ? "mr-2" : ""}`} />
          {isOpen && "New Conversation"}
        </button>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto">
          {isOpen && (
            <div className="mt-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase">
              Recent Conversations
            </div>
          )}
          {conversations.slice(0, visibleConversations).map((conversation) => (
            <div
              key={conversation.id}
              // onClick={() => handleSelectConversation(conversation.id)}
              className={`
                p-3
                hover:bg-gray-100
                cursor-pointer
                truncate
                border-b
                text-gray-900
                text-sm
                pl-7
                font-normal
                ${!isOpen && "flex justify-center"}
              `}
            >
              {isOpen ? (
                 <div className="flex items-center">
                 <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />{" "}
                {conversation.title}
                </div>
              ) : (
                <div className="flex items-center">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />{" "}
                  {/* Heroicon with margin-right */}
                  <span>{conversation.title.slice(0, 0)}</span>
                </div>
              )}
            </div>
          ))}

          {/* See More */}
          {conversations.length > visibleConversations && isOpen && (
            <button
              onClick={handleSeeMore}
              className="
                w-full 
                p-3 
                text-center 
                text-gray-900 
                hover:bg-gray-100 
                flex 
                items-center 
                justify-center
              "
            >
              <EllipsisHorizontalIcon className="h-5 w-5 mr-2" />
              See More Conversations
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t flex  space-x-2">
          {/* <button 
            className={`
              p-2 hover:bg-gray-100 
              rounded-md 
              text-gray-900
              ${!isOpen && 'mx-auto'}
            `}
          >
            <Cog6ToothIcon className="h-5 w-5" />
            {isOpen && <span className="ml-2">Settings</span>}
          </button> */}
         <button
      className={`
        flex items-center p-2 hover:bg-gray-100 
        rounded-md text-gray-900 
        ${!isOpen && "justify-center"}
      `}
      onClick={handleLogout}
    >
      <ArrowLeftOnRectangleIcon className="h-5 w-5" />
      {isOpen && <span className="ml-2 font-semibold">Logout</span>}
    </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
