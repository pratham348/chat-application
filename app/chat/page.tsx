"use client";

import { useState, useEffect } from "react";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserList } from "@/app/components/UserList";
import { ChatWindow } from "@/app/components/ChatWindow";

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [otherUserName, setOtherUserName] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setIsLoadingChat(true);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otherUserId: userId }),
      });

      if (!response.ok) throw new Error("Failed to create/get conversation");

      const data = await response.json();
      setConversation(data.conversation);

      // Get the other user's name
      const otherUser = data.conversation.participants.find(
        (p: any) => p.id !== session?.user?.id
      );
      if (otherUser) {
        setOtherUserName(otherUser.name);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Failed to open conversation");
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true });
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar - User List */}
      <div className="w-full md:w-80 bg-slate-800 border-r border-slate-600 flex flex-col">
        <div className="p-4 border-b border-slate-600 flex items-center justify-between">
          <h1 className="text-white font-bold text-xl">Chat</h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="p-4 bg-slate-700 border-b border-slate-600">
          <div className="text-sm text-slate-300">Logged in as</div>
          <div className="text-white font-medium">{session?.user?.name}</div>
        </div>

        <div className="flex-1">
          <UserList
            currentSession={session}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectUser}
            isLoading={isLoadingChat}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-800 hidden md:flex flex-col">
        {conversation ? (
          <ChatWindow
            conversationId={conversation.id}
            otherUserName={otherUserName}
            currentSession={session}
          />
        ) : selectedUserId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-300">Loading chat...</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <p className="text-lg font-medium mb-2">Welcome to Chat</p>
              <p className="text-sm">Select a user from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Chat Modal */}
      {selectedUserId && conversation && (
        <div className="fixed inset-0 md:hidden z-50 bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-600 flex items-center justify-between bg-slate-800">
            <button
              onClick={() => {
                setSelectedUserId(null);
                setConversation(null);
              }}
              className="text-white text-lg"
            >
              ← Back
            </button>
            <h2 className="text-white font-semibold">{otherUserName}</h2>
            <div className="w-8"></div>
          </div>
          <ChatWindow
            conversationId={conversation.id}
            otherUserName={otherUserName}
            currentSession={session}
          />
        </div>
      )}
    </div>
  );
}
