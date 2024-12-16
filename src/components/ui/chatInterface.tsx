"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  ChangeEvent,
} from "react";
import {
  useChatStore,
  // MessageType,
  ConversationMessage,
  SearchResultType,
} from "@/lib/store";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
  UserIcon,
  // TrashIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  //InformationCircleIcon,
  // ShoppingCartIcon,
  //  MagnifyingGlassIcon,
  //TrashIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";

// Define API response type
interface APIResponse {
  message?: {
    content: string;
    images?: string[];
    user_answer: string;
    query: string;
    send_request: boolean;
    metadata?: Record<string, unknown>;
  };
  error?: string;
}
interface UploadedFile {
  name: string;
  url: string;
}

const ChatInterface: React.FC = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setFilePath] = useState<string | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { addMessage, conversationMessages } = useChatStore();
  const [apiError, setApiError] = useState(false);
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const {
    addMessageToConversation,
    createConversation,
    conversation,
    userData,
    // setHasSyncedMessages,
    // hasSyncedMessages,
    setConversationMessages,
    fetchConversationMessages,
    userToken,
    setIsStartState,
    // setFirstMessage,
    // clearConversationMessages,
    // fetchConversations,
    setSearchResults,
    // firstMessage,
    isStartState,
    setConversation,
    // searchResults,
    // clearMessages,
    isLoggedIn,
  } = useChatStore();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionText: string;
    onAction?: () => void; // Changed from null to optional
  }>({
    isOpen: false,
    title: "",
    message: "",
    actionText: "",
    onAction: undefined, // Use undefined instead of null
  });

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "File upload failed");
          return;
        }

        const data = await response.json();
        setFilePath(data.filename);
        setError(null);
      } catch (error) {
        console.log(error);
        setError("An error occurred while uploading the file");
      }
    }

    event.target.value = ""; // Reset the input to allow re-adding the same file
  };
  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const redirectToLogin = () => {
    router.push("login");
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() && pendingFiles.length === 0) return; // Prevent sending empty messages and no files

    // Ensure the user is logged in if sending attachments
    if (pendingFiles.length > 0 && !isLoggedIn) {
      setModalState({
        isOpen: true,
        title: "Login Required",
        message: "Please log in to send messages with attachments.",
        actionText: "Log in",
        onAction: redirectToLogin,
      });
      return;
    }

    // Initial State Setter
    if (isStartState && isLoggedIn && !conversation) {
      // setFirstMessage(input);
      setIsStartState(true);
    }

    setInput("");
    setApiError(false);
    setIsTyping(true);

    // Create a FormData object to send the files
    const formData = new FormData();
    pendingFiles.forEach((file) => {
      formData.append("files", file); // Append each file to FormData
    });

    // Upload the files to the server and get the URLs

    try {
      if (pendingFiles.length > 0) {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          setApiError(true);
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}`
          );
        }

        const uploadData = await uploadResponse.json();

        // Update images and files with the URLs from the server response
        if (uploadData.files) {
          uploadData.files.forEach((uploadedFile: UploadedFile) => {
            if (uploadedFile.url) {
              if (images.includes(uploadedFile.name)) {
                // Update image URLs
                userMessage.images!.push(uploadedFile.url);
              } else {
                // Update non-image file URLs
                const file = userMessage.files!.find(
                  (f) => f.name === uploadedFile.name
                );
                if (file) {
                  file.url = uploadedFile.url;
                }
              }
            }
          });
        }
      }

      const images = pendingFiles
        .filter((file) => file.type.startsWith("image/"))
        .map((imageFile) => imageFile.name); // We will update this with the URLs after upload

      const files = pendingFiles
        .filter((file) => !file.type.startsWith("image/"))
        .map((file) => ({
          name: file.name,
          url: "", // This will be updated with the URL from the server
        }));

      const isJson = images.length > 0 || files.length > 0;

      const userMessage: ConversationMessage = {
        is_user: true,
        content: input,
        images,
        files,
        is_json: isJson,
      };

      setError(null);

      // Conversation Creation code
      if (userToken?.key) {
        // console.log(isStartState);
        if (isStartState) {
          setConversation(null);
          setConversationMessages(null);
        }

        // console.log(conversationMessages);

        if (
          (conversation === null || conversationMessages === null) &&
          isStartState
        ) {
          // console.log("Creating conversation...");
          setConversation(null);
          setConversationMessages(null);
          const newConversation = await createConversation(
            input,
            userToken.key
          );

          if (newConversation) {
            setConversation(newConversation.id); // Assuming `id` is the string you want to set
            setIsStartState(false);
          } else {
            console.error("Failed to create a new conversation.");
          }

          if (!newConversation) {
            console.error("Failed to create a new conversation.");
            return; // Abort if conversation creation fails
          }

          await addMessageToConversation(
            newConversation.id,
            input,
            true,
            userToken.key
          );
          // console.log("A new one was made here");
          // console.log(conversation);
        } else if (conversation) {
          // console.log("here is the culprit");
          // console.log(conversation);
          await addMessageToConversation(
            conversation.id,
            input,
            true,
            userToken.key
          );
        }
      }

      // Check if the user is logged in when sending attachments
      if (pendingFiles.length > 0 && !isLoggedIn) {
        setModalState({
          isOpen: true,
          title: "Login Required",
          message: "Please log in to send messages with attachments.",
          actionText: "Log in",
          onAction: redirectToLogin,
        });
        return;
      }

      if (!isLoggedIn) {
        try {
          const decideResponse = await fetch("/api/decide", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify({ messages: [userMessage] }),
          });

          if (!decideResponse.ok) {
            setApiError(true);
            throw new Error(`HTTP error! Status: ${decideResponse.status}`);
          }

          const decideData = await decideResponse.json();
          const { needs_assistance } = decideData;

          if (needs_assistance) {
            setIsTyping(true);
          }

          if (!needs_assistance) {
            const trimmedTerm = input.trim();

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

            try {
              // Redirect to the search page with the search term as a query parameter
              router.push(`/search?term=${encodeURIComponent(trimmedTerm)}`);

              const response = await fetch(
                `${apiEndpoint}/shop/search/?query=${encodeURIComponent(
                  trimmedTerm
                )}`
              );

              if (!response.ok) {
                setApiError(true);
                throw new Error(
                  `Search request failed with status: ${response.status}`
                );
              }

              const data = await response.json();

              if (Array.isArray(data) && data.length > 0) {
                setSearchResults({
                  query: trimmedTerm,
                  results: data,
                  isLoading: false, // Remove loading state
                });
              }
            } catch (error) {
              console.error("Search error:", error);
              setSearchResults({
                query: trimmedTerm,
                results: [],
                isLoading: false, // Remove loading state
              });
            }

            return;
          } else if (needs_assistance && !isLoggedIn) {
            setModalState({
              isOpen: true,
              title: "Login Required",
              message: "Please log in to request assistance.",
              actionText: "Log in",
              onAction: redirectToLogin,
            });
          }
        } catch (error) {
          console.error("Error with decision endpoint:", error);
          setApiError(true);
          return;
        }
      }

      try {
        let recentMessages: ConversationMessage[] = [];

        if (conversation!.id && userToken!.key) {
          const fetchedMessages = await fetchConversationMessages(
            conversation!.id,
            userToken!.key
          ); // Get the messages

          if (fetchedMessages) {
            setConversationMessages(fetchedMessages);
            const allMessages = fetchedMessages; // Use the fetched messages directly
            recentMessages = allMessages.slice(-10); // Get the last 10 messages
          }
        }

        if (userToken?.key) {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // messages: [userMessage],
              messages: [...recentMessages, userMessage],
              metadata: {
                fileCount: pendingFiles.length,
                inputLength: input.length,
              },
              images: userMessage.images, // Include image URLs
              files: userMessage.files, // Include file metadata
            }),
          });

          if (!response.ok) {
            setError("API Error try again");
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data: APIResponse = await response.json();
          // console.log("AI Response:", data);

          if (data.error) {
            throw new Error(data.error);
          }

          if (data.message?.send_request) {
            // console.log("Triggering search for:", data.message.query);
            setIsTyping(false);
            setIsSearching(true);
            const token = userToken!.key;

            try {
              const searchResponse = await fetch(
                `${apiEndpoint}/shop/search/?query=${encodeURIComponent(
                  data.message.query
                )}`,   {
                  headers: { Authorization: `Token ${token}` },
                }
              );

              if (!searchResponse.ok) {
                setApiError(true);
                throw new Error(
                  `Search API failed with status: ${searchResponse.status}`
                );
              }

              if (searchResponse.ok) {
                const searchData = await searchResponse.json();

                const chatSearch: SearchResultType = {
                  query: data.message.query,
                  results: searchData,
                  isLoading: false,
                };

                setSearchResults(chatSearch);

                if (userToken!.key) {
                  await addMessageToConversation(
                    conversation!.id,
                    chatSearch, // Pass search results
                    false,
                    userToken.key,
                    true // is_json = true
                  );
                }
              } else {
                console.error("Search API failed:", searchResponse.status);
              }
            } catch (searchError) {
              console.error("Error during search:", searchError);
              setApiError(true);
            }
          } else {
            const aiMessage: ConversationMessage = {
              is_user: false,
              content: data.message!.user_answer,
            };

            if (userToken!.key) {
              await addMessageToConversation(
                conversation!.id,
                aiMessage.content,
                false,
                userToken.key,
                false // is_json = false
              );
            }
          }
        }

        setIsTyping(false); // Stop typing indicator
        setIsSearching(false);
      } catch (error) {
        setApiError(true);
        console.error("Error:", error);
        setIsTyping(false);
      } finally {
        setPendingFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear file input
        }
        setIsTyping(false);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError(true);
      setIsTyping(false);
    }
  }, [
    input,
    pendingFiles,
    addMessageToConversation,
    fetchConversationMessages,
    conversation,
    setSearchResults,
    conversationMessages,
    addMessage,
    setConversation,
    createConversation,
    setConversationMessages,
    userToken,
    isStartState,
    setIsStartState,
    apiEndpoint,
  ]);

  const renderMessageContent = (msg: ConversationMessage) => {
    if (
      !msg.content ||
      (msg.images &&
        msg.images.length === 0 &&
        msg.files &&
        msg.files.length === 0)
    ) {
      return; // If the message is empty, return nothing (null)
    }

    // Check if the message contains search results (JSON with elements)
    const isJsonContent = msg.is_json && typeof msg.content === "object";

    if (isJsonContent) {
      const searchResults = msg.content as SearchResultType;
      return (
        <div className="bg-white px-4 py-6 rounded-lg shadow-md flex-grow mt-4">
          {searchResults.results && searchResults.results.length > 0 ? (
            <>
              <div className="flex items-center mb-4">
                <span className="font-semibold text-gray-800 text-lg">
                  Search Results
                </span>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {searchResults.results.slice(0, 3).map((result, index) => (
                  <Link
                    key={index}
                    href={`/product?url=${encodeURIComponent(result.url)}`}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-transform cursor-pointer"
                    >
                      <div className="h-48 w-full flex items-center justify-center bg-gray-50 p-4">
                        <Image
                          src={`/api/proxy/image-proxy?url=${encodeURIComponent(
                            result.image_url
                          )}`}
                          alt={result.name}
                          width={250}
                          height={250}
                          className="object-contain max-h-full max-w-full"
                          unoptimized
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">
                          {result.name}
                        </h3>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-green-600 font-bold text-sm">
                            FCFA {formatPrice(result.price)}
                          </span>
                          <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
              <a
                href={`/search?term=${encodeURIComponent(searchResults.query)}`}
                className="text-blue-500 text-sm mt-4 block text-center"
              >
                See More
              </a>
            </>
          ) : searchResults?.isLoading ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-gray-500 text-sm">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center py-4">
              <ExclamationCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-gray-500 text-sm">No results found</span>
            </div>
          )}
        </div>
      );
    }

    // Render standard message content (text, images, files)
    return (
      <div className="space-y-2">
        {/* Text content */}
        {typeof msg.content === "string" && !msg.is_json && (
          <p className="text-gray-800 text-sm">{msg.content}</p>
        )}

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
                  unoptimized
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

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversationMessages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const formatPrice = (price: number) => {
    // Convert to string and split decimal if exists
    const [integerPart, decimalPart] = price.toString().split(".");

    // Add spaces for thousands
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    // Combine back with decimal if it exists
    return decimalPart
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col flex-auto px-0 pt-24 md:pt-32 bg-white md:px-40"
    >
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        actionText={modalState.actionText}
        onClose={closeModal}
        onAction={modalState.onAction}
      />
      {/* Container with centered content */}
      <div  ref={messageContainerRef} className="flex-auto bg-white overflow-y-auto -mt-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100  rounded-lg p-6">
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
         
          className="mb-6  space-y-4 p-4 bg-white rounded-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-16" // Add padding-bottom
        >
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
                Hi there! I&apos;m Maguida, your personal shopping assistant. I
                can help you find the perfect product! Just tell me what
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

          {/* Searching Indicator */}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start space-x-3"
            >
              <Image
                width={60}
                height={60}
                alt="Maguida Chat Icon"
                src="assets/chat_icon.svg"
                className="rounded-full"
              />
              <div className="bg-white px-4 py-2 rounded-lg shadow-md flex-grow">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800">Maguida</span>
                </div>
                <div className="text-gray-600 text-sm text-justify max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span>Searching for the best results...</span>
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: 0.4,
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {apiError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              There was an error processing your request. Please try again.
            </div>
          )}
        </div>
      </div>
      <div className="flex-none bottom-0 left-0 w-full bg-white shadow-lg p-4 border-t">
        {/* File Preview */}
        {pendingFiles.length > 0 && (
          <div className="mb-4 flex flex-row gap-2 overflow-x-auto py-2 px-1 pb-48 md:pb-32">
            {pendingFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative shrink-0"
              >
                {file.type.startsWith("image/") ? (
                  <div className="relative group">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${file.name}`}
                      width={100}
                      height={100}
                      className="
                  rounded-lg 
                  object-cover 
                  sm:w-36
                  sm:h-36
                  w-28
                  h-28 
                  transition-all 
                  duration-300 
                  group-hover:brightness-75
                  group-hover:scale-105
                  shadow-md
                "
                    />
                    <div
                      className="
                absolute 
                top-0 
                right-0 
                m-1 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity 
                duration-300
              "
                    >
                      <button
                        onClick={() => removeFile(index)}
                        className="
                    bg-red-500 
                    text-white 
                    rounded-full 
                    p-1 
                    hover:bg-red-600 
                    transition
                  "
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                    <DocumentIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex md:flex-row md:items-center sm:gap-4 gap-2 max-w-3xl mx-auto"
        >
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,.doc,.docx,.txt,.png,.svg,.jpg,.jpeg"
          />
          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="text-gray-900 text-sm flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
            placeholder="Chat with me..."
          />

          {/* Button container */}
          <div className="flex flex-row justify-end md:flex-row gap-2 items-center md:w-auto w-fit">
            {/* File upload button */}
            {/* <button
              onClick={triggerFileInput}
              className="bg-gray-200 p-3  rounded-lg hover:bg-gray-300 transition flex-shrink-0"
            >
              <PaperClipIcon className="h-5 w-5 text-gray-700" />
            </button> */}
            <button
              onClick={triggerFileInput}
              disabled={true}
              className="p-3 rounded-lg transition flex-shrink-0 
             bg-gray-200 hover:bg-gray-300 text-gray-700 
             disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>

            {/* Clear Chat button */}
            {/* <button
                  onClick={handleClearChat}
                  className="bg-white text-red-500 p-3 rounded-lg border hover:bg-red-50 transition flex-shrink-0 flex items-center"
                >
                  <TrashIcon className="h-5 w-5" />
                </button> */}

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              className="bg-black text-white p-3 rounded-lg hover:bg-gray-700 transition flex-shrink-0 flex items-center"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-0 sm:mr-2 text-white fill-current" />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        </motion.div>
        {/* Copyright */}
        <div className="text-center text-gray-500 py-4 mt-1 text-xs sm:block hidden">
          © {new Date().getFullYear()} Richenel&apos;s AI Agency. All rights
          reserved. By using this app you accept the&nbsp;
          <Link href="/conditions" className="text-gray-900 hover:underline">
            Terms and Conditions&nbsp;
          </Link>
          and also adhere to the&nbsp;
          <Link href="/terms" className="text-gray-900 hover:underline">
            Privacy Policy
          </Link>
        </div>

        <div className="text-center text-gray-500 py-4 mt-1 text-xs sm:hidden block">
          © {new Date().getFullYear()} Richenel&apos;s AI Agency. All
          rights&nbsp;reserved.
          <Link href="/conditions" className="text-gray-900 hover:underline">
            Terms and Conditions&nbsp;
          </Link>
          <Link href="/terms" className="text-gray-900 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
