import { useEffect, useState } from "react";
import { Avatar, CircularProgress, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { IUser } from "../hooks/useGetBulkUsersDetails";
import axios from "axios";
import { BACKEND_URL } from "../config";

const SearchPage = ({ page, onUserSelect }: { page: string; onUserSelect? : (user : IUser) => void}) => {
  const currentUser = useRecoilValue(userAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (!filter.trim()) {
      setUsers([]); // Clear results if filter is empty
      return;
    }

    const fetchFilteredUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/search`, {
          params: { filter },
          headers: {
            Authorization: localStorage.getItem("token") ?? "",
          },
        });

        let data = res.data;
        if (data.error) {
          console.error("Error fetching users.");
          return;
        }
        console.log(data);
        data = data.filter(
          (user: IUser) =>
            user.id !== currentUser.id && user.isFrozen === false
        );
   
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFilteredUsers, 500); // Debounce API calls
    return () => clearTimeout(timeoutId);
  }, [filter, currentUser]);


  return (
    <div className={`max-w-lg mx-auto ${page == "searchPage" ? "mt-10 p-4" : ""}`}>
      {/* Search Input */}
      <form className="relative">
        {/* <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" /> */}
        <TextField
          fullWidth
          variant="outlined"
          size="medium"
          placeholder="Search for a user"
          onChange={(e) => setFilter(e.target.value)}
        />
        {loading && (
          <CircularProgress
            size={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
        )}
      </form>

      {/* Divider */}
      <div className="border-t border-gray-300 my-4"></div>

      {/* User List */}
      {page === "searchPage" ? (
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {users.length > 0 ? (
              users.map((user) => (
                <Link key={user.id} to={`/${user.username}`} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                  <Avatar src={user.profilePic} alt={user.username} sx={{ width: 50, height: 50 }} />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{user.username}</span>
                    <span className="text-gray-600">{user.name}</span>
                  </div>
                </Link>
              ))
            ) : loading ? (
              <div className="text-center mt-4">
                <CircularProgress />
              </div>
            ) : (
              <p className="text-gray-500 text-center">No users found</p>
            )}
          </div>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-6">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} onClick={() => onUserSelect?.(user)}  className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg">
                  <Avatar src={user.profilePic} alt={user.username} sx={{ width: 50, height: 50 }} />
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{user.username}</span>
                    <span className="text-gray-600">{user.name}</span>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className="text-center mt-4">
                <CircularProgress />
              </div>
            ) : filter.trim() !== "" ? (
              <p className="text-gray-500 text-center">No users found</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
