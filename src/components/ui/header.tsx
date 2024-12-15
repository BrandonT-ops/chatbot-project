"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  // HeartIcon,
  // ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowLeftOnRectangleIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useChatStore } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Search Results", href: "/search", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleConversations, setVisibleConversations] = useState(5);
  const {
    setFirstMessage,
    setHasSyncedMessages,
    setSearchResults,
    clearConversationMessages,
    userData,
    clearUserData,
    clearUserToken,
    clearMessages,
    clearSearch,
    setIsLoggedIn,
    isLoggedIn,
    userToken,
    fetchConversations,
    conversations,
    fetchConversationMessages,
    setConversation,
    setIsStartState,
  } = useChatStore();
  //let isLoggedIn = !!userData; // Check if the user is logged in
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const searchParams = useSearchParams();
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      setSearchResults(null);
      return;
    }

    // Set loading state before fetching
    setSearchResults({
      query: trimmedTerm,
      results: [],
      isLoading: true, // Add loading state
    });

    // Navigate to the search page with the search term as a query parameter
    router.push(`/search?term=${encodeURIComponent(trimmedTerm)}`);

    try {
      const response = await fetch(
        `${apiEndpoint}/shop/search/?query=${encodeURIComponent(trimmedTerm)}`
      );

      if (!response.ok) {
        throw new Error(
          `Search request failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      // console.log(data);

      // Check if the response is an array
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults({
          query: trimmedTerm,
          results: data,
          isLoading: false, // Remove loading state
        });
      } else {
        setSearchResults({
          query: trimmedTerm,
          results: [],
          isLoading: false, // Remove loading state
        });
      }
    } catch (error) {
      console.error("Search error:", error);

      // Handle error state
      setSearchResults({
        query: trimmedTerm,
        results: [],
        isLoading: false, // Remove loading state
      });
    }
  };

  useEffect(() => {
    const term = searchParams.get("term") || ""; // Get the `term` from URL
    const trimmedTerm = term.trim();

    if (trimmedTerm) {
      // Use a flag to track if initial search has been performed
      setSearchTerm(trimmedTerm); // Update the input field

      const performSearch = async () => {
        try {
          const response = await fetch(
            `${apiEndpoint}/shop/search/?query=${encodeURIComponent(
              trimmedTerm
            )}`
          );

          if (!response.ok) {
            throw new Error(
              `Search request failed with status: ${response.status}`
            );
          }

          const data = await response.json();
          setSearchResults({
            query: trimmedTerm,
            results: Array.isArray(data) ? data : [],
            isLoading: false, // Always set to false after search completes
          });
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults({
            query: trimmedTerm,
            results: [],
            isLoading: false, // Set to false even on error
          });
        }
      };

      performSearch();
    }
  }, [searchParams, apiEndpoint, setSearchResults]); // Reduced dependencies

  const handleSignOut = () => {
    clearUserData();
    clearUserToken();
    clearMessages();
    clearSearch();
    setIsLoggedIn(false);
    clearConversationMessages();
    setFirstMessage(null);
    setHasSyncedMessages(false);
    router.push("/");
  };

  // Conversation selection handler
  const handleSelectConversation = async (conversationId: string) => {
    clearMessages();
    clearConversationMessages();

    setConversation(conversationId);

    if (userToken) {
      try {
        fetchConversationMessages(conversationId, userToken.key);
      } catch (error) {
        console.error("Error fetching conversation messages:", error);
      }
    }
  };

  // Add new conversation handler
  const addNewConversation = async () => {
    try {
      setIsStartState(true);
      clearMessages();
      clearConversationMessages();
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  // See more conversations handler
  const handleSeeMore = () => {
    setVisibleConversations((prev) => prev + 5);
  };

  // Fetch conversations when component mounts
  useEffect(() => {
    if (userToken) {
      fetchConversations(userToken.key);
    }
  }, [userToken, fetchConversations]);

  const handleRedirect = () => {
    router.push("/login"); // Navigate to the login page
  };
  return (
    <>
      <Disclosure
        as="nav"
        className="bg-white border-b-2 border-gray-200 flex-none w-full top-0 fixed"
      >
        <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-24">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            {/* Logo and text section */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              {!userToken && (
                <div className="flex shrink-0 items-center">
                  <Image
                    width={100}
                    height={100}
                    alt="Maguida logo"
                    src="assets/app_logo.svg"
                    className="h-8 w-auto"
                  />
                  <span className="ml-2 text-gray-900 font-semibold">
                    Maguida
                  </span>
                </div>
              )}
            </div>


            {/* Buttons and profile by the right */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {isLoggedIn ? (
                <>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div className="flex items-center">
                      <MenuButton className="relative flex items-center rounded-full bg-black text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        {/* Profile Picture */}
                        {userData?.profilePicture ? (
                          <Image
                            width={36}
                            height={36}
                            alt="Profile Picture"
                            src={
                              userData?.profilePicture ||
                              userData?.firstname?.charAt(0).toUpperCase() ||
                              "?"
                            }
                            className="h-9 w-9 rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-9 w-9 text-gray-400 bg-gray-200 rounded-full" />
                        )}
                        {/* User Name */}
                        <span className="ml-2 mr-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {userData?.firstname}
                        </span>
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <MenuItem>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </>
              ) : (
                <div className="flex justify-center items-center w-full px-1 sm:px-3 md:px-3">
                <button
                  onClick={handleRedirect}
                  className="
                    flex 
                    items-center 
                    justify-center 
                    w-full 
                    max-w-xs 
                    px-3
                    py-2 
                    bg-gradient-to-r from-[#652574] to-[#C34E19] 
                    text-white 
                    text-xs 
                    sm:text-sm 
                    font-medium 
                    rounded-lg 
                    shadow-md 
                  
                    transition 
                    duration-300 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-offset-2 
                    focus:ring-gray-500
                    group
                  "
                >
                  <UserPlusIcon 
                    className="
                      h-5
                      w-5 
                      sm:h-6
                      sm:w-6 
                      sm:mr-2 
                      mr-0
                      group-hover:scale-100
                      transition
                      duration-200
                    " 
                  />
                  {/* <span className="sm:hidden block ml-2">Sign in</span> */}
                  <span className="sm:block hidden">Sign in with Google</span>
                </button>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Search Bar for Mobile */}
            <div className="px-2 pb-3">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="size-5 text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!e.target.value.trim()) {
                      setSearchResults(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e);
                    }
                  }}
                  className="w-full placeholder:text-sm bg-[#F0F2F5] text-gray-900 pl-10 pr-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </form>
            </div>

            {/* Navigation for non-logged in users */}
            {!isLoggedIn && (
              <>
                {navigation.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                <div className="px-2">
                  {/* <div className="flex justify-center items-center">
                    <button
                      onClick={handleRedirect}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 21v-2a4 4 0 00-3-3.87M12 3v4m-4-4v4m12 7l-4 4m0 0l-4-4m4 4V3"
                        />
                      </svg>
                      Sign in with Google
                    </button>
                  </div> */}
                </div>
              </>
            )}

            {/* Sidebar-like content for logged-in users */}
            {isLoggedIn && (
              <div>
                {/* Add Conversation Button */}
                <button
                  onClick={addNewConversation}
                  className="flex items-center w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-900"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Conversation
                </button>

                {/* Conversation List */}
                <div className="mt-2 px-2 text-xs font-bold text-gray-500 uppercase">
                  Recent Conversations
                </div>
                {conversations && conversations.length > 0 ? (
                  conversations
                    .slice(0, visibleConversations)
                    .map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() =>
                          handleSelectConversation(conversation.id)
                        }
                        className="w-full text-left p-3 hover:bg-gray-100 border-b text-gray-900 text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          <span className="truncate">{conversation.title}</span>
                        </div>
                      </button>
                    ))
                ) : (
                  <div className="p-3 text-gray-500 text-xs text-center">
                    None yet, Start a new conversation!
                  </div>
                )}

                {/* See More */}
                {conversations!.length > visibleConversations && (
                  <button
                    onClick={handleSeeMore}
                    className="w-full p-3 text-center text-gray-900 hover:bg-gray-100 flex items-center justify-center"
                  >
                    See more
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left p-3 hover:bg-gray-100 text-gray-900 flex items-center"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                  Logout
                </button>

                {/* Additional logged-in user actions */}
                <div className="flex space-x-2 p-3">
                  {/* <button
                    type="button"
                    className="flex-1 rounded-md bg-[#F0F2F5] p-2 text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <HeartIcon aria-hidden="true" className="size-5 mx-auto" />
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-md bg-[#F0F2F5] p-2 text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-5 mx-auto"
                    />
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>

      {/* Modal for accepting terms */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">
                Terms & Privacy
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                Before you continue, please review and accept our{" "}
                <a
                  href="/conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
                .
              </p>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={isTermsChecked}
                  onChange={() => setIsTermsChecked(!isTermsChecked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms-checkbox"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I have read and agree to the Terms and Privacy Policy
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isTermsChecked) {
                    setShowModal(false);
                  }
                }}
                disabled={!isTermsChecked}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const HeaderWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Header />
  </Suspense>
);
export default HeaderWithSuspense;
