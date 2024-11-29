"use client"
import ChatInterface from "@/components/ui/chatInterface"; 
import Header from "@/components/ui/header";
import SideBar from "@/components/ui/sidebar";
//  import { useState } from "react";

export default function Home() {
  // const [token, ] = useState('your-auth-token');
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ChatInterface />
      <SideBar />
    </main>
  );
}
