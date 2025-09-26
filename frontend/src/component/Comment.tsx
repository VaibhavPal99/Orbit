
import { Link } from "react-router-dom";
import { ICommentProps } from "../types/types";
import { Avatar } from "@mui/material";

export const Comment = ({ reply, lastReply } : ICommentProps) => {

    function stringAvatar(name: string) {
        const nameParts = name.split(" ");
        const initials =
          nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];
        return {
          children: initials,
        };
    }
    console.log("reply in comment", reply);
  return (
    <>
      <div className="flex gap-4 py-2 my-2 w-full">
        <Link to={`/${reply.user.username}`} className="flex-shrink-0">
          <Avatar
          src={reply.user.profilePic}
          {...(!reply.user.profilePic || reply.user.profilePic === " " ? stringAvatar(reply.user.name) : {})}
          className="w-14 h-14"
        />
        </Link>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-center w-full">
            <Link to={`/${reply.user.username}`}>
              <p className="text-sm font-bold">{reply.user.username}</p>
            </Link>
          </div>
          <p>{reply.text}</p>
        </div>
      </div>

      {!lastReply && <hr className="border-gray-300" />}
    </>
  );
};


export default Comment;
