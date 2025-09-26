import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { LuMessagesSquare } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";

export const Header = () => {
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  
  return (
    <>
      {user && (
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg sticky top-0 z-50 flex items-center justify-between px-8 py-4">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-white text-3xl font-semibold tracking-tight hover:text-gray-300 cursor-pointer">
              Orbit
            </div>
          </div>

          {/* Center: Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex flex-col items-center text-white hover:text-blue-400 transition-all duration-200"
            >
              <AiFillHome className="text-2xl" />
              <span className="text-xs mt-1">Home</span>
            </Link>

            <Link
              to="/search"
              className="flex flex-col items-center text-white hover:text-blue-400 transition-all duration-200"
            >
              <FiSearch className="text-2xl" />
              <span className="text-xs mt-1">Search</span>
            </Link>

            <Link
              to="/chat"
              className="flex flex-col items-center text-white hover:text-blue-400 transition-all duration-200"
            >
              <LuMessagesSquare className="text-2xl" />
              <span className="text-xs mt-1">Messages</span>
            </Link>

            <Link
              to="/settings"
              className="flex flex-col items-center text-white hover:text-blue-400 transition-all duration-200"
            >
              <FiSettings className="text-2xl" />
              <span className="text-xs mt-1">Settings</span>
            </Link>

            <Link
              to={`/${user.user.username}`}
              className="flex flex-col items-center text-white hover:text-blue-400 transition-all duration-200"
            >
              <RxAvatar className="text-2xl" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>

          {/* Right: Logout */}
          <div>
            <button
              className="flex flex-col items-center text-red-500 hover:text-red-400 transition-all duration-200"
              title="Log Out"
              onClick={logout}
            >
              <FiLogOut className="text-2xl" />
              <span className="text-xs mt-1">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
