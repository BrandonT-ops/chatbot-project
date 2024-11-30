"use client";
import ChatInterface from "@/components/ui/chatInterface";
import Header from "@/components/ui/header";
import SideBar from "@/components/ui/sidebar";
import { useChatStore } from "@/lib/store";

export default function Home() {
    const {isLoggedIn} = useChatStore();

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ChatInterface />
      {isLoggedIn && <SideBar />} 
    </main>
  );
}
