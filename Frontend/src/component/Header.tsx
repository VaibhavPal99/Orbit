import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RxAvatar } from "react-icons/rx";
import { LuMessagesSquare } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export const Header = () => {
  const user = useRecoilValue(userAtom);
  
  
  return (
    <>
      {user && (
        <div className="bg-white shadow-md border-b sticky top-0 z-50 flex items-center justify-between px-6 py-3">
          {/* Left: Logo */}
          <div className="flex items-center">
            <div className="text-blue-700 text-3xl font-bold">
              ChatterSpace
            </div>
          </div>

          {/* Center: Navigation Icons */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <AiFillHome className="text-xl" />
              <span className="text-xs">Home</span>
            </Link>

            <Link
              to="/search"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FiSearch className="text-xl" />
              <span className="text-xs">Search</span>
            </Link>

            <Link
              to="/chat"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <LuMessagesSquare className="text-xl" />
              <span className="text-xs">Messages</span>
            </Link>

            <Link
              to="/settings"
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FiSettings className="text-xl" />
              <span className="text-xs">Settings</span>
            </Link>

            <Link
              to={`/${user.user.username}`}
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <RxAvatar className="text-xl" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>

          {/* Right: Logout */}
          <div>
            <button
              className="flex flex-col items-center text-red-500 hover:text-red-600 transition-colors"
              title="Log Out"
            >
              <FiLogOut className="text-xl" />
              <span className="text-xs">Log Out</span>
            </button>
          </div>
        </div>
      )}  
    </>
  );
};

export default Header;
