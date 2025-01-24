import { useEffect, useState } from "react";
import useGetBulkUsersDetails, { IUser } from "../hooks/useGetBulkUsersDetails";
import { Box, Stack, Typography } from "@mui/material";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import FollowerAndFollowingContainer from "./FollowerAndFollowingContainer";

const Followers = () => {
  const { user, loading } = useGetUserProfile();
  const { bulkUser, bulkUserLoading } = useGetBulkUsersDetails();
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState<boolean>(true);

  useEffect(() => {
    const getFollowers = async () => {
      setLoadingFollowers(true);

      try {
        if (user && bulkUser && Array.isArray(user.followers)) {
          const followerIds = user.followers.map((f) => f.followerId);
          
          const followersList = bulkUser.filter((u) =>
            followerIds.includes(u.id) &&
            u.id !== user.id &&
            u.isFrozen === false
          );
          
          setFollowers(followersList);
        }
      } catch (error) {
        console.error("Error while fetching followers");
      } finally {
        setLoadingFollowers(false);
      }
    };

    if (user && bulkUser) {
      getFollowers();
    }
  }, [user, bulkUser]);

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <Box key={i} className="flex justify-center mt-4">
        <Box className="flex items-center justify-start bg-white rounded-lg shadow-lg w-full p-4 gap-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <Box className="flex flex-col gap-2 w-full">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </Box>
        </Box>
      </Box>
    ))
  );

  return (
    <Box className="p-4 bg-gray-50 min-h-screen">
      {loadingFollowers || bulkUserLoading || loading ? (
        renderLoadingSkeleton()
      ) : (
        <>
          {followers.length === 0 ? (
            <Typography variant="h6" className="text-center text-gray-600 mt-6">
              You don't have any followers yet.
            </Typography>
          ) : (
            <Box className="max-h-[400px] overflow-y-auto mt-4 ml-36">
              <Stack spacing={3}>
                {followers.map((u) => (
                  <FollowerAndFollowingContainer key={u.id} user={u} />
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Followers;
