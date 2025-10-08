import { useRecoilState } from "recoil";
import SuggestedUsers from "../component/SuggestedUsers";
import useGetBulkUsersDetails from "../hooks/useGetBulkUsersDetails";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { PostType } from "../types/types";
import { CircularProgress } from "@mui/material";
import Post from "../component/Post";
import postsAtom from "../atoms/postsAtom";


export const Home = () => {
    const { bulkUser } = useGetBulkUsersDetails();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchFeedPosts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/post/feed`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const data = res.data;
            if (data.error) {
                console.error("An error occurred while fetching the feed");
                return;
            }
            
            const filteredPosts = data.filter((post: PostType) =>
                bulkUser.some((user) => user.following.id === post.PostedById && !user.following.isFrozen)
            );
            setPosts(filteredPosts);
        } catch (e) {
            console.error("Error fetching posts:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (bulkUser.length > 0) {
            fetchFeedPosts();
        }
    }, [bulkUser]);


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row-reverse gap-6">
                    {/* Suggested Users Section - Sticky */}
                    <div className="lg:w-1/4 flex-shrink-0 sticky top-12">
                        <div className="p-6 h-full">
                            <SuggestedUsers />
                        </div>
                    </div>

                    {/* Posts Section - Scrollable */}
                    <div className="flex-1 p-6 h-[80vh] overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <CircularProgress className="text-gray-500" />
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16">
                                <h1 className="text-3xl font-semibold text-gray-700">
                                    Follow some users to see the feed
                                </h1>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {posts.map((post) => (
                                    <Post key={post.id} post={post} userId={post.PostedById} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
