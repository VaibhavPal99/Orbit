
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { IUserHeaderProps } from "../types/types";
import { Avatar } from "@mui/material";
import CreatePost from "./CreatePost";
import { FaUserEdit} from "react-icons/fa";
import { MdOutlineFollowTheSigns } from "react-icons/md";

export const UserHeader = ({ user }: IUserHeaderProps) => {
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

  function stringAvatar(name: string) {
    const nameParts = name.split(" ");
    return {
      children:
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0][0],
    };
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto mt-10 space-y-6 text-white">
      {/* Profile Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          {user.profilePic ? (
            <Avatar
              src={user.profilePic}
              {...(!user.profilePic || user.profilePic === " "
                ? stringAvatar(user.name)
                : {})}
              className="w-20 h-20 border-4 border-white shadow-lg"
            />
          ) : (
            <Avatar
              {...stringAvatar(user.name)}
              className="w-20 h-20 bg-white text-indigo-600 font-bold text-3xl border-4 border-white shadow-lg"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-lg opacity-80">@{user.username}</p>
          </div>
        </div>

        {/* Add Post Button (Only for the Current User) */}
        {currentUser.user.id === user.id && (
          <div className="pt-4 mt-10"><CreatePost /></div>
        )}
      </div>

      {/* Bio Section */}
      <p className="text-lg opacity-90 italic text-center">{user.bio}</p>

      {/* Follow & Edit Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <Link
            to={`/${user.username}/followers`}
            className="flex items-center space-x-2 text-lg hover:underline"
          >
            <span className="font-bold">
              {Array.isArray(user?.followers) ? user.followers.length : 0}
            </span>
            <span className="opacity-80">Followers</span>
          </Link>
          <Link
            to={`/${user.username}/followings`}
            className="flex items-center space-x-2 text-lg hover:underline"
          >
            <span className="font-bold">
              {Array.isArray(user?.followings) ? user.followings.length : 0}
            </span>
            <span className="opacity-80">Following</span>
          </Link>
        </div>

        {/* Follow/Unfollow or Edit Profile Button */}
        {currentUser.user.id === user.id ? (
          <Link to="/update">
            <button className="flex items-center px-5 py-2 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:bg-gray-200 transition">
              <FaUserEdit className="mr-2" />
              Edit Profile
            </button>
          </Link>
        ) : (
          <button
            onClick={handleFollowUnfollow}
            disabled={updating}
            className={`flex items-center px-5 py-2 text-white font-semibold rounded-full shadow-md transition ${
              following
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <MdOutlineFollowTheSigns className="mr-2" />
            {following ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Posts Tab */}
      <div className="flex justify-center border-t border-white/20 pt-3 cursor-pointer">
        <p className="text-xl font-semibold">Posts</p>
      </div>
    </div>
  );
};

export default UserHeader;
