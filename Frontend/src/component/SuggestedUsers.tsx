import { useEffect, useState } from "react";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { SingleSuggestedUser } from "./SingleSuggestedUser";
import { Skeleton } from "@mui/material";

export const SuggestedUsers = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedUsers, setSuggestedUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/suggested`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        setSuggestedUsers(res.data); // Directly access parsed JSON data
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Suggested Users</h2>

      {/* Displaying suggested users or loading skeletons */}
      <div>
        {!loading ? (
          suggestedUsers.map((user) => (
            <SingleSuggestedUser key={user.id} user={user} />
          ))
        ) : (
          [...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4 p-4 border-b border-gray-200 rounded-md"
            >
              {/* Skeleton for Avatar */}
              <div className="flex items-center space-x-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="space-y-2">
                  <Skeleton variant="text" width={120} height={20} sx={{ fontSize: "1rem" }} />
                  <Skeleton variant="text" width={100} height={15} sx={{ fontSize: "0.875rem" }} />
                </div>
              </div>

              {/* Skeleton for Follow Button */}
              <div>
                <Skeleton variant="rectangular" width={100} height={36} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
