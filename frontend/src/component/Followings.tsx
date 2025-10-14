import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useGetBulkUsersDetails, { IBulkUser} from "../hooks/useGetBulkUsersDetails";
import FollowerAndFollowingContainer from "./FollowerAndFollowingContainer";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
// import { useRecoilValue } from "recoil";

const Followings = () => {
  const { user, loading } = useGetUserProfile();
  const { bulkUser, bulkUserLoading } = useGetBulkUsersDetails();
  const [following, setFollowing] = useState<IBulkUser[]>([]);
  const [loadingFollowings, setLoadingFollowings] = useState<boolean>(true);
  // const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getFollowings = async () => {
      setLoadingFollowings(true);

      try {
        if (user && bulkUser) {
          const followingsList = bulkUser.filter((u) =>
            user.followings.some((f) => f.followingId === u.following.id) &&
            u.following.id !== user.id &&
            u.following.isFrozen === false
          );

          setFollowing(followingsList);
        }
      } catch (error) {
        console.error("Error while fetching followings", error);
      } finally {
        setLoadingFollowings(false);
      }
    };
    getFollowings();
  }, [setFollowing, user, bulkUser]);

  if (!loadingFollowings && following.length === 0) {
    return (
      <Typography variant="h6" className=" text-gray-600 mt-6">
        You are not following anyone.
      </Typography>
    );
  }

  return (
    <>
      {(loadingFollowings || bulkUserLoading || loading) &&
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
        ))}
      {(!loadingFollowings || !bulkUserLoading || !loading) && (
        <Box className="max-h-[400px] overflow-y-auto mt-4">
          <Stack spacing={3}>
            {following &&
              following.map((u) => (
                <FollowerAndFollowingContainer key={u.following.id} user={u.following} />
              ))}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Followings;
