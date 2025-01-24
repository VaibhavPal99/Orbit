    import { useRecoilValue } from "recoil";
    import { IUser } from "./useGetBulkUsersDetails";
    import userAtom from "../atoms/userAtom";
    import { useState } from "react";
    import { BACKEND_URL } from "../config";
    import axios from "axios";


    export const useFollowUnfollow = (user : IUser) => {
        
        const currentUser = useRecoilValue(userAtom);
      
        const [updating, setUpdating] = useState<boolean>(false);
        const [following, setFollowing] = useState<boolean>(
            Array.isArray(user.followers) &&
            user.followers.some(follower => follower.followerId === currentUser.user.id)
        );

        
        const [snackbar, setSnackbar] = useState({
            open: false,
            message: `Followed ${user.name}`,
            severity: 'success' as 'success' | 'error' | 'info' | 'warning', // Type assertion
        })
        
        const handleCloseSnackbar = () => {
            setSnackbar({
                ...snackbar, open : false
            });
        };

        const handleFollowUnfollow = async () => {
            
            if (!currentUser) {
                return;
            }
              
            if (updating) {
                return;
            }
            setUpdating(true);
            try {
                const res = await axios.post(
                    `${BACKEND_URL}/api/v1/user/follow/${user.id}`,
                    {}, // Body if needed
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
        
                // Check if the response status is success (e.g., status 200)
                if (res.status === 200 || res.data.success) {
                    console.log("Follow/Unfollow success", res.data);
        
                    // Follow/Unfollow logic based on the current state
                    if (following) {
                        setSnackbar({
                            open: true,
                            message: `Unfollowed ${user.name}`,
                            severity: 'success',
                        });
                    } else {
                        setSnackbar({
                            open: true,
                            message: `Followed ${user.name}`,
                            severity: 'success',
                        });
                    }
        
                    setFollowing(!following);
                } else {
                    // Handle unexpected response
                    setSnackbar({
                        open: true,
                        message: "Failed to Follow/Unfollow User",
                        severity: 'error',
                    });
                }
            } catch (e) {
                console.error("An error occurred: ", e); // Log error details
                setSnackbar({
                    open: true,
                    message: "Failed to Follow/Unfollow User",
                    severity: 'error',
                });
            } finally {
                setUpdating(false);
            }
        };
        
        return {
            handleFollowUnfollow,
            updating,
            following,
            snackbar,
            handleCloseSnackbar,
        };
    };

    export default useFollowUnfollow;