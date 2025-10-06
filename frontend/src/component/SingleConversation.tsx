import { Avatar } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { stringAvatar } from "../component/UserHeader";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import axios from "axios";
import { CHAT_BACKEND_URL } from "../config";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useWebSocket } from "../context/WebSocketProvider";

interface Message {
  id?: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

interface SingleConversationProps {
  selectedUser: IUser | null;
}

export const SingleConversation = ({ selectedUser }: SingleConversationProps) => {
  const currentUser = useRecoilValue(userAtom);
  const { ws, sendMessage } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) fetchMessages();
  }, [selectedUser?.id]);

  // Listen for incoming WebSocket messages
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message" || data.content) {
          if (
            selectedUser &&
            ((data.senderId === selectedUser.id && data.receiverId === currentUser.user.id) ||
              (data.senderId === currentUser.user.id && data.receiverId === selectedUser.id))
          ) {
            const newMsg: Message = {
              id: data.id || Date.now().toString(),
              content: data.content,
              senderId: data.senderId,
              receiverId: data.receiverId,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setMessages((prev) => {
              const exists = prev.some(
                (msg) =>
                  msg.id === newMsg.id ||
                  (msg.content === newMsg.content && msg.createdAt === newMsg.createdAt)
              );
              if (exists) return prev;
              return [...prev, newMsg];
            });
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, selectedUser, currentUser.user.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const res = await axios.get(`${CHAT_BACKEND_URL}/api/v1/messages/${selectedUser.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msg = {
      type: "message",
      content: newMessage,
      senderId: currentUser.user.id,
      receiverId: selectedUser.id,
    };

    // Send via WebSocket
    sendMessage(msg);

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      { ...msg, id: Date.now().toString(), createdAt: new Date().toISOString() },
    ]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });
    return grouped;
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400">
        <p className="text-xl mb-2">No conversation selected</p>
        <p className="text-sm">Select a user to start messaging</p>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center gap-3 shadow-sm">
        {selectedUser.profilePic ? (
          <Avatar src={selectedUser.profilePic} sx={{ width: 48, height: 48 }} />
        ) : (
          <Avatar {...stringAvatar(selectedUser.name)} sx={{ width: 48, height: 48 }} />
        )}
        <div>
          <h3 className="font-semibold">{selectedUser.name}</h3>
          <p className="text-sm text-gray-500">@{selectedUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-400">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet. Start the conversation!</p>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="bg-white px-3 py-1 rounded-lg shadow-sm text-xs text-gray-600">
                  {formatDate(msgs[0].createdAt)}
                </span>
              </div>
              {msgs.map((msg, idx) => {
                const isSender = msg.senderId === currentUser.user.id;
                return (
                  <div key={msg.id || idx} className={`flex mb-3 ${isSender ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        isSender ? "bg-teal-500 text-white" : "bg-white text-gray-800"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.content}</p>
                      <div className={`text-xs mt-1 ${isSender ? "text-teal-100" : "text-gray-500"}`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !ws || ws.readyState !== WebSocket.OPEN}
          className={`p-2 rounded-full transition-colors ${
            newMessage.trim() && ws && ws.readyState === WebSocket.OPEN
              ? "bg-teal-500 hover:bg-teal-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
