import React, { useState } from "react";
import { CgMoreO } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { IUserHeaderProps } from "../types/types";
import { Avatar } from "@mui/material";
import CreatePost from "./CreatePost";

export const UserHeader = ({ user }: IUserHeaderProps) => {
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const [menuOpen, setMenuOpen] = useState(false);

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    alert("Profile Link Copied");
    setMenuOpen(false);
  };

  function stringAvatar(name: string) {
    const nameParts = name.split(" ");
    if (nameParts.length == 1) {
      const first = nameParts[0][0];
      return {
        children: first,
      };
    }
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0][0];
    return {
      children: initials,
    };
  }
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500 text-lg">@{user.username}</p>
        </div>
        <div>
          {user.profilePic && (
            <Avatar
              src={user.profilePic}
              {...(!user.profilePic || user.profilePic === " "
                ? stringAvatar(user.name)
                : {})}
              className="w-16 h-16 border border-gray-300"
            />
          )}
        </div>
      </div>

      {/* Bio Section */}
      <p className="text-gray-700 text-base">{user.bio}</p>

      {/* Buttons Section */}
      <div>
        {currentUser.user.id === user.id ? (
          <Link to="/update">
            <button className="px-5 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-300">
              Update Profile
            </button>
          </Link>
        ) : (
          <button
            onClick={handleFollowUnfollow}
            disabled={updating}
            className={`px-5 py-2 text-sm rounded-md transition duration-300 ${
              following
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Followers and Followings Section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <Link
            to={`/${user.username}/followers`}
            className="text-gray-600 hover:text-blue-600 hover:underline"
          >
            <p>{Array.isArray(user?.followers) ? user.followers.length : 0} followers</p>
          </Link>
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <Link
            to={`/${user.username}/followings`}
            className="text-gray-600 hover:text-blue-600 hover:underline"
          >
            <p>{Array.isArray(user?.followings) ? user.followings.length : 0} followings</p>
          </Link>
        </div>
        
        
        {/* More Options */}
        
        <div className="relative">
          <div className=""><CreatePost></CreatePost></div>
          <CgMoreO
            size={24}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <button
                onClick={copyUrl}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Tab */}
      <div className="flex justify-center border-b border-gray-300 pb-2 cursor-pointer">
        <p className="text-lg font-medium text-blue-600">Posts</p>
      </div>
    </div>
  );
};

export default UserHeader;
