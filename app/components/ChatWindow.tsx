"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

interface ChatWindowProps {
  conversationId: string;
  otherUserName: string;
  currentSession: Session | null;
}

export function ChatWindow({
  conversationId,
  otherUserName,
  currentSession,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);
  const isMountedRef = useRef(true);

  // Direct fetch function - not wrapped in useCallback so it always has fresh conversationId
  const performFetch = async () => {
    if (!isMountedRef.current) return;

    try {
      const response = await fetch(
        `/api/messages?conversationId=${conversationId}`
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();

      if (isMountedRef.current) {
        // Always update the messages to ensure we get latest
        setMessages(data.messages);
        lastMessageCountRef.current = data.messages.length;
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch messages"
        );
      }
    }
  };

  // Initial load and polling setup
  useEffect(() => {
    isMountedRef.current = true;
    let pollInterval = 2000; // Start with 2s

    // Initial load
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        await performFetch();
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Polling function - uses recursive setTimeout for dynamic intervals
    const poll = () => {
      if (!isMountedRef.current) return;

      pollTimeoutRef.current = setTimeout(async () => {
        if (!isMountedRef.current) return;

        await performFetch();

        // Dynamically adjust polling interval
        if (lastMessageCountRef.current === 0) {
          // No messages yet, increase interval up to 10s
          pollInterval = Math.min(pollInterval + 1000, 10000);
        } else {
          // Has messages, keep polling at 2s
          pollInterval = 2000;
        }

        // Schedule next poll
        poll();
      }, pollInterval);
    };

    // Start polling
    poll();

    return () => {
      isMountedRef.current = false;
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      setError(null);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      
      // Immediately add the message to the UI
      setMessages((prev) => [...prev, data.message]);
      lastMessageCountRef.current += 1;
      setNewMessage("");

      // Force a fetch immediately after sending to get latest messages
      setTimeout(() => {
        performFetch();
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-300">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-600 bg-slate-700">
        <h2 className="text-white font-semibold text-lg">{otherUserName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="p-4 bg-red-500 text-white rounded-lg text-sm">
            {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender.id === currentSession?.user?.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender.id === currentSession?.user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-600 text-slate-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-600 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-2 rounded-lg bg-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
