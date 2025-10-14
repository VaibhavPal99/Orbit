import { IUser } from "../hooks/useGetBulkUsersDetails";

export interface IUserUser{
    user : IUser
}

export interface PostType {

    id : string,
    text : string,
    replies : IReply[],
    PostedById : string,
    postedBy : {
        username : string,
        profilePic : string,
    },
    likes : LikeType[],
    img : string,
    createdAt : string,
}

export interface LikeType {
    userId: string;
    postId: string;
    createdAt: string;
}



export interface IReply {
    userId: string;
    text: string;
    userProfilePic: string;
    username: string;
    id: string;
}

export interface IconsProps {
    post: PostType;
}

export interface UserPagePostProps {
    post: PostType;
    userId: string;
}

export interface IUserHeaderProps {
    user: IUser;
}

export interface IReply {
    text: string;
    postId : string;
    id: string;
    user : IUser;
}
  
export interface ICommentProps {
    reply: {
        text: string;
        postId : string;
        id: string;
        user : IUser;
    };
    lastReply: boolean;
}
  


  