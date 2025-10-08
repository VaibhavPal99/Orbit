import { Avatar, Box, Button, Typography } from "@mui/material";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { IUser } from "../hooks/useGetBulkUsersDetails";

interface IFollowerAndFollowingContainerProps {
  user: IUser;
}
export const FollowerAndFollowingContainer = ({
  user,
}: IFollowerAndFollowingContainerProps) => {
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const currentUser = useRecoilValue(userAtom);

  console.log(currentUser.user.id,user.id);
  return (
    <>
      <Box display="flex" justifyContent="space-between" width="400px">
        <Box>
          <Link to={`/${user.username}`} style={{ textDecoration: "none" }}>
            <Box display="flex" alignItems="center">
              <Avatar
                src={user.profilePic}
                alt={user.username}
                sx={{ width: 50, height: 50, cursor: "pointer" }}
              />
              <div className="flex">
              <Box ml={2}>
                
                <Typography fontWeight="bold" sx={{ cursor: "pointer" }}>
                  {user.username}
                </Typography>
                <Typography sx={{ cursor: "pointer" }}>{user.name}</Typography>
                
              </Box>
                <img
                  src="/verified.png"
                  alt="Verified"
                  style={{ width: 16, height: 16, marginLeft: 4, marginTop: 4 }}
                />
              </div>
            </Box>
          </Link>
        </Box>
        {currentUser.user.id !== user.id && (
          <Box display="flex" alignItems="center" ml={2}>
            <Button
              size="small"
              variant={following ? "outlined" : "contained"}
              color={following ? "inherit" : "primary"}
              onClick={handleFollowUnfollow}
              disabled={updating}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                ":hover": {
                  opacity: 0.8,
                },
              }}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default FollowerAndFollowingContainer;
