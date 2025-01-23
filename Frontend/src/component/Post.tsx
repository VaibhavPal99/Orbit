import { Link, useNavigate } from "react-router-dom";
import { MouseEventHandler, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Icons from "./Icons";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import { UserPagePostProps } from "../types/types";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar, Box } from "@mui/material";

const Post = ({ post, userId }: UserPagePostProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/profile/${userId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = res.data;
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    getUser();
  }, [userId]);

  if (!user) return null;

  const handleDeletePost: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/v1/post/${post.id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (error) {
      // Error handling
    }
  };

  return (
    <Link to={`/${user.username}/post/${post.id}`} className="block mb-4">
      <div className="flex gap-3 py-5">
        {/* Left Section */}
        <div className="flex flex-col items-center">
          <Avatar
            alt={user.name}
            src={user.profilePic}
            className="cursor-pointer"
            sx={{
              width: 48,
              height: 48,
              border: "2px solid #ddd",
            }}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box sx={{ width: "1px", background: "#ddd", flexGrow: 1, my: 2 }}></Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              justifyContent: "center",
            }}
          >
            {/* Emoji Display */}
            <span className="text-sm">🚀</span>
          </Box>
        </div>

        {/* Right Section */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1">
              <span
                className="font-bold text-sm cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user.username}
              </span>
              <span className="text-blue-500">✔️</span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </span>
              {currentUser?.id === user.id && (
                <button
                  className="text-red-500 text-xs"
                  onClick={handleDeletePost}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Post Content */}
          {post.text && <p className="text-sm">{post.text}</p>}
          {post.img && (
            <div className="rounded overflow-hidden border border-gray-300">
              <img src={post.img} alt="Post" className="w-full" />
            </div>
          )}

          {/* Icons */}
          <div className="flex gap-3 mt-1">
            <Icons post={post} />
            
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Post;
