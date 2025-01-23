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
          // Ensure posts are stored as an array
          setPosts(Array.isArray(data.posts) ? data.posts : []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]); // Fallback to empty array
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, setPosts, user]);

  if (!user) {
    return loading ? (
      <div>
        <CircularProgress />
      </div>
    ) : (
      <div>User not found!</div>
    );
  }

  console.log("Posts Type:", typeof posts, "Posts:", posts);

  return (
    <div>
      <div>
        <UserHeader user={user} />
      </div>
      <div>
        {!fetchingPosts && posts?.length === 0 && <h1>User has no posts.</h1>}
        {fetchingPosts && (
          <div>
            <CircularProgress />
          </div>
        )}
        {Array.isArray(posts) &&
          posts.map((post) => (
            <Post key={post.id} post={post} userId={post.PostedById} />
          ))}
      </div>
    </div>
  );
};
