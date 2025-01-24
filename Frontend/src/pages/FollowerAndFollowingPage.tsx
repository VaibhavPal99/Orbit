import { useState } from "react";
import { CircularProgress, Typography, Box} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Followers from "../component/Followers";
import Followings from "../component/Followings";
import { useGetUserProfile } from "../hooks/useGetUserProfile";

export const FollowerAndFollowingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const lastSegment = pathname.split("/").pop();
  const [followersOrFollowing, setFollowersOrFollowing] = useState<string>(
    lastSegment === "followers" ? "followers" : "followings"
  );

  const { user, loading } = useGetUserProfile();

  const handleFollowersClick = () => {
    setFollowersOrFollowing("followers");
    navigate(`/${user?.username}/followers`);
  };

  const handleFollowingClick = () => {
    setFollowersOrFollowing("followings");
    navigate(`/${user?.username}/followings`);
  };

  if (!user) {
    if (loading) {
      return (
        <Box className="flex justify-center items-center min-h-screen">
          <CircularProgress size="2rem" />
        </Box>
      );
    } else {
      return (
        <Box className="flex justify-center items-center min-h-screen">
          <Typography variant="h5" className="text-red-500 font-semibold">
            User not Found!
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Box className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        {/* User Profile Section */}
        <Box className="flex flex-col items-center mb-6">
          <Link to={`/${user.username}`} className="hover:underline">
            <Typography variant="h4" className="font-semibold text-gray-800 text-center">
              {user.name}
            </Typography>
          </Link>
          <Box className="flex items-center gap-2 mt-2 justify-center">
            <Link to={`/${user.username}`} className="hover:underline">
              <Typography variant="body1" className="text-gray-500">
                @{user.username}
              </Typography>
            </Link>
          </Box>
        </Box>

        {/* Followers and Following Toggle */}
        <Box className="flex justify-center mb-6">
          <Box className="relative flex w-full max-w-[480px] justify-between bg-white p-2 rounded-lg shadow-md">
            <Box
              className={`w-1/2 text-center py-2 cursor-pointer ${
                followersOrFollowing === "followers"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={handleFollowersClick}
            >
              <Typography variant="body1" className="font-medium">
                Followers
              </Typography>
            </Box>
            <Box
              className={`w-1/2 text-center py-2 cursor-pointer ${
                followersOrFollowing === "followings"
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500"
              }`}
              onClick={handleFollowingClick}
            >
              <Typography variant="body1" className="font-medium">
                Following
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Followers or Followings Content */}
        <Box>
          <Box className="flex flex-col gap-4">
            {followersOrFollowing === "followings" ? (
              <div className="ml-36"><Followings /></div>
            ) : (
              <Followers />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FollowerAndFollowingPage;
