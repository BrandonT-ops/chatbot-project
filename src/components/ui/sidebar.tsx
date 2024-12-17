"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useChatStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [visibleConversations, setVisibleConversations] = useState(5);
  // const [isSeeMore, setIsSeeMore] = useState(true);
  // const [isAtEnd, setIsAtEnd] = useState(false);

  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  const {
    clearUserToken,
    clearMessages,
    clearSearch,
    clearUserData,
    setIsLoggedIn,
    setConversation,
    setFirstMessage,
    setHasSyncedMessages,
    setConversationMessages,
  } = useChatStore();
  const {
    setSearchResults,
    userToken,
    clearConversationMessages,
    setIsStartState,
    fetchConversations,
    conversations,
    fetchConversationMessages,
  } = useChatStore();

  const handleLogout = () => {
    // Clear the authentication data in the store
    clearUserData();
    clearUserToken();
    clearMessages();
    clearSearch();
    clearConversationMessages();
    setIsLoggedIn(false);
    setFirstMessage(null);
    setHasSyncedMessages(false);
    setIsStartState(true);
    clearConversationMessages();
    setConversation(null);
    setFirstMessage(null);
    setSearchResults(null);
    setConversationMessages(null);
    router.push("/");
  };

  // Check screen size and set mobile view
  useEffect(() => {
    fetchConversations(userToken?.key);
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
  }, [fetchConversations, userToken]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectConversation = async (conversationId: string) => {
    clearMessages();
    clearConversationMessages();
    setSelectedConversation(conversationId);

    setConversation(conversationId);

    if (userToken) {
      try {
        const fetchData = async () => {
          try {
            const data = await fetchConversationMessages(
              conversationId,
              userToken.key
            );
            if (data) {
              setConversationMessages(data);
            }
          } catch (error) {
            console.error("Failed to fetch conversation messages:", error);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Error fetching conversation messages:", error);
      }
    }
  };

  const addNewConversation = async () => {
    try {
      setIsStartState(true);
      clearConversationMessages();
      setConversation(null);
      setFirstMessage(null);
      setSearchResults(null);
      setFirstMessage(null);
      setHasSyncedMessages(false);
      setIsStartState(true);
      setConversation(null);
      setFirstMessage(null);
      setSearchResults(null);
      setConversationMessages(null);
      router.push("/");
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const totalConversations = conversations!.length;

  const handleSeeMore = () => {
    setVisibleConversations((prev) => {
      // If currently showing all or more than total, reset to initial state
      if (prev >= totalConversations) {
        return 5;
      }
      // Otherwise, increase by 5 but don't exceed total conversations
      return Math.min(prev + 5, totalConversations);
    });
  };
  
  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 "
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`
          relative h-screen 
          bg-white shadow-lg 
          transition-all duration-300 
          z-20
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
              <h2 className="text-md justify-center items-center flex font-bold text-gray-800">
                Maguida
              </h2>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="ml-auto p-2 bg-gradient-to-r from-[#652574] to-[#C34E19] hover:opacity-50 duration-300 transition-colors rounded-full"
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
            m-6 p-2 
            bg-[#ED6A1B] text-white 
            rounded-md 
            hover:bg-orange-600
            
            transition-all
            ${!isOpen && "justify-left mr-2"}
          `}
        >
          <PlusCircleIcon className={`h-5 w-5  ${isOpen ? "mr-2" : " "}`} />
          {isOpen && "New Conversation"}
        </button>

        {/* Conversation List */}
        <div className="flex-grow overflow-y-auto">
          {isOpen && (
            <div className="mt-4 px-4 py-2 text-xs font-bold text-gray-500 uppercase flex items-center justify-center mb-4">
              Recent Conversations
            </div>
          )}
          {conversations && conversations.length > 0 ? (
            conversations.slice(0, visibleConversations).map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className={`
                p-3
                hover:bg-[#FDF4FF]
                cursor-pointer
                truncate
                border-b
                text-gray-900
                text-sm
                pl-7
                font-normal
                ${
                  selectedConversation === conversation.id ? "bg-[#FDF4FF]" : ""
                }
                ${!isOpen && "flex justify-center"}
              `}
              >
                {isOpen ? (
                  <div className="flex items-center space-x-2  px-4 ">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                    <span className="text-sm font-normal truncate ">
                      {conversation.title}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
                    <span>{conversation.title.slice(0, 0)}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              {isOpen ? (
                <div className="p-3 text-gray-500 text-xs text-center">
                  None yet, Start a new conversation!
                </div>
              ) : null}
            </>
          )}

          {/* See More */}
          {conversations!.length > 5 && (
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
              <span className="text-sm font-medium truncate">
                {visibleConversations >= totalConversations
                  ? "See Less"
                  : "See More"}
              </span>
            </button>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 flex  space-x-2">
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
