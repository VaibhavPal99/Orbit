import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { BACKEND_URL } from "../config";
import { UserHeader } from "../component/UserHeader";
import Post from "../component/Post";

export const UserPage: React.FC = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;

      try {
        setFetchingPosts(true);

        const res = await axios.get(
          `${BACKEND_URL}/api/v1/post/user/${username}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = res.data;

        if (data.error) {
          console.error("An error has occurred while fetching posts.");
          setPosts([]);
        } else {
          setPosts(Array.isArray(data.posts) ? data.posts : []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, setPosts, user]);

  if (!user) {
    return loading ? (
      <div className="flex justify-center items-center h-32">
        <CircularProgress />
      </div>
    ) : (
      <div className="text-center text-red-500 text-lg font-semibold">
        User not found!
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <UserHeader user={user} />
      </div>
      <div className="space-y-6">
        {!fetchingPosts && posts?.length === 0 && (
          <h1 className="text-center text-gray-500 text-lg font-medium">
            User has no posts.
          </h1>
        )}
        {fetchingPosts && (
          <div className="flex justify-center items-center h-20">
            <CircularProgress />
          </div>
        )}
        {Array.isArray(posts) &&
          posts.map((post) => (
            <div key={post.id} className="w-full">
              <Post post={post} userId={post.PostedById} />
            </div>
          ))}
      </div>
    </div>
  );
};
