import { useRecoilState, useRecoilValue } from "recoil";
import { IconsProps } from "../types/types";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar } from "@mui/material";

const MAX_CHAR = 500;

const Icons = ({ post }: IconsProps) => {
    const user = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [liked, setLiked] = useState<boolean>(
        post.likes.some((like) => like.userId === user?.id)
    );
    const [isLiking, setIsLiking] = useState<boolean>(false);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const [reply, setReply] = useState<string>("");
    const [showModal, setShowModal] = useState(false);

    const handleLikeAndUnlike = async (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (!user) {
            console.log("You must be logged in to like a post");
            return;
        }

        if (isLiking) return;
        setIsLiking(true);
        try {
            const res = await axios.put(
                `${BACKEND_URL}/api/v1/post/like/${post.id}`,
                {},
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            const data = await res.data;
            if (data.error) {
                console.log("Error occurred while liking the post!");
                return;
            }

            const updatedPosts = posts.map((p) => {
                if (p.id === post.id) {
                    const updatedLikes = liked
                        ? p.likes.filter((id) => id !== user.id)
                        : [...p.likes, user.id];
                    return { ...p, likes: updatedLikes };
                }
                return p;
            });
            setPosts(updatedPosts);
            setLiked(!liked);
        } catch (e) {
            console.error("Error", e);
        }
        setIsLiking(false);
    };

    const handleReply = async () => {
        if (!user) {
            console.log("You must be logged in to reply to a post");
            return;
        }

        if (isReplying) return;
        setIsReplying(true);

        try {
            
            const res = await axios.put(
                `${BACKEND_URL}/api/v1/post/reply/${post.id}`,
                { text : reply },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            const data = res.data;
            if (data.error) {
                console.log("An error occurred while replying to a post!");
                return;
            }
            const updatedPosts = posts.map((p) => {
                if (p.id === post.id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);
            setReply("");
        } catch (e) {
            console.error("Error", e);
        }
        setIsReplying(false);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        if (inputText.length > MAX_CHAR) {
            setReply(inputText.slice(0, MAX_CHAR));
            setRemainingChar(0);
        } else {
            setReply(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex gap-3 my-2 cursor-pointer" onClick={(e) => e.preventDefault()}>
                    {/* Like Icon */}
                    <svg
                        aria-label="Like"
                        className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "fill-none text-gray-500"}`}
                        role="img"
                        viewBox="0 0 24 22"
                        onClick={handleLikeAndUnlike}
                    >
                        <path
                            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                            stroke="currentColor"
                            strokeWidth="2"
                        ></path>
                    </svg>

                    {/* Comment Icon */}
                    <svg
                        aria-label="Comment"
                        className="h-5 w-5 text-gray-500"
                        role="img"
                        viewBox="0 0 24 24"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent parent click behavior
                            e.preventDefault();  // Prevent navigation
                            setShowModal(true);
                        }}
                    >
                        <title>Comment</title>
                        <path
                            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        ></path>
                    </svg>
                </div>

                {/* Replies and Likes Count */}
                <div className="flex">
                    {post.replies.slice(0, 3).map((reply, index) => (
                        <Avatar
                            key={index}
                            alt={reply.username}
                            src={reply.userProfilePic}
                            sx={{
                                width: 24,
                                height: 24,
                                border: "2px solid white",
                            }}
                        />
                    ))}
                    <div className="flex gap-2 items-center text-sm text-gray-500 pl-2">
                        <span>{post.replies.length} Replies</span>
                        <span className="h-1 w-1 bg-gray-500 rounded-full"></span>
                        <span>{post.likes.length} Likes</span>
                    </div>
                </div>

                {/* Modal */}
                {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)} // Close modal on clicking outside
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when interacting inside
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={() => setShowModal(false)}
                        >
                            &times;
                        </button>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mt-2 text-gray-800 "
                            placeholder="Reply"
                            value={reply}
                            onClick={(e) => e.preventDefault()} // Prevent navigation
                            onChange={handleTextChange}
                        ></textarea>
                        <p className="text-right text-xs text-gray-500 mt-1">
                            {remainingChar}/{MAX_CHAR}
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 disabled:bg-blue-300"
                                onClick={(e)=> {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleReply();
                                    setShowModal(false); 
                                }}
                                disabled={isReplying}
                            >
                                Reply
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowModal(false); 
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Icons;
