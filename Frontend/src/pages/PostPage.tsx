import { useRecoilState, useRecoilValue } from "recoil";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import userAtom from "../atoms/userAtom";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar, CircularProgress } from "@mui/material";
import { Comment } from "../component/Comment";
import Icons from "../component/Icons";

export const PostPage = () => {
  const { loading, user } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts?.[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]); // Clear posts initially
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/post/${pid}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        const data = res.data;
        console.log("data", data);
        if (data.error) {
          console.error("Error fetching post:", data.error);
          return;
        }

        // Ensure we store the post data as an array
        setPosts([data.post]);
      } catch (e) {
        console.error("Error fetching post:", e);
      }
    };
    getPost();
  }, [pid, setPosts]);
  console.log("currentPost",currentPost);

  const handleDeletePost = async () => {
    if (!currentPost) return; // Prevent actions on undefined posts
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await axios.delete(`${BACKEND_URL}/api/v1/post/${currentPost.id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = res.data;
      if (data.error) {
        console.error("Error deleting post:", data.error);
        return;
      }

      console.log("Post deleted successfully");
      navigate(`/${user?.username}`);
    } catch (e) {
      console.error("Error deleting post:", e);
    }
  };

  function stringAvatar(name: string) {
    const nameParts = name.split(" ");
    const initials =
      nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];
    return {
      children: initials,
    };
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return <div>User not found!</div>;
  }

  if (!currentPost) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <div className="flex w-full items-center gap-3">
          <Link to={`/${user.username}`} className="flex items-center">
            <Avatar
                src={user.profilePic}
                {...(!user.profilePic || user.profilePic === " " ? stringAvatar(user.name) : {})}
                className="w-14 h-14"
            />
          </Link>
          <Link to={`/${user.username}`} className="flex items-center gap-1">
            <p className="text-sm font-bold">{user.username}</p>
            <img src="/verified.png" alt="Verified" className="w-4 h-4 mt-1" />
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <p className="text-xs text-gray-400 text-right w-36">
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </p>
          {currentUser?.id === user.id && (
            <div onClick={handleDeletePost} className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <p className="my-3">{currentPost.text}</p>

      {currentPost.img && (
        <div className="rounded-md overflow-hidden border border-gray-200">
          <img src={currentPost.img} alt="Post" className="w-full" />
        </div>
      )}

      <div className="flex gap-3 my-3">
        <Icons post={currentPost} />
      </div>

      <hr className="my-4 border-gray-300" />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply.id}
          reply={reply}
          lastReply={
            reply.id === currentPost.replies[currentPost.replies.length - 1].id
          }
        />
      ))}
    </>
  );
};
