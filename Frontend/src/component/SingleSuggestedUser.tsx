import { Alert, Avatar, Button, CircularProgress, Snackbar } from "@mui/material";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { Link } from "react-router-dom";

export interface SingleSuggestedUserProps {
  user: IUser;
}

export const SingleSuggestedUser = ({ user }: SingleSuggestedUserProps) => {
  function stringAvatar(name: string) {
    const nameParts = name.split(" ");
    const initials =
      nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];
    return {
      children: initials,
    };
  }

  const { handleFollowUnfollow, updating, following, snackbar, handleCloseSnackbar } =
    useFollowUnfollow(user);
    

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Left Section: User Info */}
      <Link to={`${user.username}`}>
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <Avatar
            src={user.profilePic}
            {...(!user.profilePic || user.profilePic === " " ? stringAvatar(user.name) : {})}
            className="w-14 h-14"
          />

          {/* User Details */}
          <div>
            <div className="font-semibold text-gray-800">{user.username}</div>
            <div className="text-sm text-gray-500">{user.name}</div>
          </div>
        </div>
      </Link>

      {/* Right Section: Follow/Unfollow Button */}
      <div className="pl-2">
        <Button
          variant="contained"
          color="primary"
          onClick={
            () => {
              handleFollowUnfollow();
            }
           
          }
          startIcon={updating ? <CircularProgress size={20} color="inherit" /> : null}
          className="text-sm"
          size="small"
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      </div>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SingleSuggestedUser;
