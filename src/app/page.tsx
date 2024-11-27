import ChatInterface from "@/components/ui/chatInterface"; 
import Header from "@/components/ui/header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ChatInterface />
    </main>
  );
}
