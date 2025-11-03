import { Avatar } from "@mui/material";
import { stringAvatar } from "../component/UserHeader";
import { IUserHeaderProps } from "../types/types";
import SearchPage from "./SearchPage";
import { useEffect, useState } from "react";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import axios from "axios";
import { CHAT_BACKEND_URL } from "../config";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import { SingleConversation } from "../component/SingleConversation";

interface ChatUserWithMessage extends IUser {
    lastMessage?: string;
    timestamp?: string;
}

export const ChatPage = (user: IUserHeaderProps) => {
    const currentUser = useRecoilValue(userAtom);
    const [chatUsers, setChatUsers] = useState<ChatUserWithMessage[]>([]);
    const [activeChatUser, setActiveChatUser] = useState<IUser | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${CHAT_BACKEND_URL}/api/v1/messages/conversations`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });

                const data = res.data;

                // Combine users with their last messages in a single map
                const usersWithMessages = data.map((conversation: any) => {
                    const otherUser = conversation.participants.find((p: IUser) => p.id !== currentUser.user.id);
                    const lastMsg = conversation.messages[conversation.messages.length - 1];

                    return {
                        ...otherUser,
                        lastMessage: lastMsg?.content || "No messages yet",
                        timestamp: formatTimestamp(lastMsg?.createdAt),
                    };
                });
                setChatUsers(usersWithMessages);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [currentUser.user.id]);


    const formatTimestamp = (timestamp: string | undefined) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            // Today - show time
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return date.toLocaleDateString("en-US", { weekday: "short" });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    const handleUserSelect = (selectedUser: IUser) => {
        if (selectedUser.id === currentUser.user.id) {
            return;
        }
        const userExists = chatUsers.some((u) => u.id === selectedUser.id);
        if (!userExists) {
            const newChatUser: ChatUserWithMessage = {
                ...selectedUser,
                lastMessage: "",
                timestamp: "",
            };
            setChatUsers((prev) => [newChatUser, ...prev]);
        }

        setActiveChatUser(selectedUser);
    };

    const handleChatUserClick = (chatUser: ChatUserWithMessage) => {
        setActiveChatUser(chatUser);
    };

    return (
        <>
            <div className="grid grid-cols-4 h-[calc(100vh-76px)] overflow-hidden min-h-0">
                <div className="col-span-1 border-r border-gray-300 flex flex-col bg-white min-h-0">
                    {/* Header Section */}
                    <div className="p-4 border-b border-gray-300">
                        <div className="flex items-center space-x-3">
                            {user.user.profilePic ? (
                                <Avatar
                                    src={user.user.profilePic}
                                    {...(!user.user.profilePic || user.user.profilePic === " "
                                        ? stringAvatar(user.user.name)
                                        : {})}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        fontSize: 20,
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    }}
                                />
                            ) : (
                                <Avatar
                                    {...stringAvatar(user.user.name)}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        fontSize: 20,
                                    }}
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-base font-semibold truncate">{user.user.name}</p>
                                <p className="text-sm text-gray-500 truncate">@{user.user.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="p-3 border-b border-gray-300">
                        <SearchPage page="chatPage" onUserSelect={handleUserSelect} />
                    </div>

                    {/* Messages Header */}
                    <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-700">Messages</p>
                    </div>

                    {/* Chat Users List */}
                    <div className="flex-1 overflow-y-auto">
                        {chatUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                                <p className="text-center">No conversations yet</p>
                                <p className="text-sm text-center mt-2">Search for users to start chatting</p>
                            </div>
                        ) : (
                            chatUsers.map((singleUser) => (
                                <div
                                    key={singleUser.id}
                                    onClick={() => handleChatUserClick(singleUser)}
                                    className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeChatUser?.id === singleUser.id ? "bg-gray-100" : ""
                                        }`}
                                >
                                    {/* User Avatar */}
                                    <div className="relative flex-shrink-0">
                                        {singleUser.profilePic ? (
                                            <Avatar
                                                src={singleUser.profilePic}
                                                {...(!singleUser.profilePic || singleUser.profilePic === " "
                                                    ? stringAvatar(singleUser.name)
                                                    : {})}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    fontSize: 18,
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                {...stringAvatar(singleUser.name)}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    fontSize: 18,
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                                                {singleUser.name}
                                            </h3>
                                            <span className="text-xs ml-2 flex-shrink-0 text-gray-500">
                                                {singleUser.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm text-gray-600 truncate">
                                                {singleUser.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="col-span-3 h-full overflow-hidden min-h-0 bg-gray-50ul">
                    {activeChatUser ? (
                            <div className="col-span-3 h-full overflow-hidden">
                                <SingleConversation selectedUser={activeChatUser} />
                            </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};