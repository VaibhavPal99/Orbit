import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";


const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Send logout request
      await axios.post(
        `${BACKEND_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
          withCredentials: true, // Include cookies if necessary
        }
      );

      // Clear client-side data
      localStorage.removeItem("token"); // Remove token
      localStorage.removeItem("user-info"); // Clear additional user info
      setUser(null); // Reset user state
      console.log("Success", "Logged out successfully", "success"); // Show success toast
      navigate("/auth"); // Redirect to home page
    } catch (error) {
      console.log("Error", "Something went wrong during logout", "error"); // Show error toast
    }
  };

  return logout;
};

export default useLogout;
