"use client";

import React, { useState } from 'react';
import ChatInterface from '@/components/ui/chatInterface';
import SearchResults from '../search/page';
import { useChatStore } from "@/lib/store";
import Header from '@/components/ui/header';
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';

const ChatPage = () => {
  const [activeView, setActiveView] = useState<'chat' | 'search'>('chat');
  const { searchResults } = useChatStore();
  const router = useRouter();

  const handleNavigation = (view: 'chat' | 'search') => {
    setActiveView(view);
    if (view === 'search') {
      router.push('/search');
    } else {
      router.push('/chat');
    }
  };

  return (
    <div className="relative -mt-12">
      <Header />
      {/* Navigation Buttons */}
      <div className="fixed top-20 right-0 z-30 w-fit flex justify-end px-4">
        {/* <button
          onClick={() => handleNavigation('chat')}
          className={`px-4 py-2 backdrop-blur-lg rounded-full shadow-xl hover:bg-blue-100 transition-all group ${
            activeView === 'chat'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button> */}
        <button
          onClick={() => handleNavigation('search')}
          className={`px-4 py-4 backdrop-blur-lg rounded-full w-fit shadow-xl hover:bg-blue-100 transition-all group ${
            activeView === 'search'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          disabled={!searchResults}
        >

          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Conditional Rendering */}
      <div className={`pt-24 ${activeView === 'chat' ? 'block' : 'hidden'}`}>
        <ChatInterface />
      </div>

      {searchResults && (
        <div className={`pt-24 ${activeView === 'search' ? 'block' : 'hidden'}`}>
          <SearchResults />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
