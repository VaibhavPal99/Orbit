import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface IUser{
    id : string;
    name : string;
    username : string;
    email : string;
    password : string;
    profilePic : string;
    bio : string;
    isFrozen : boolean;
    createdAt : string;
    followers : { id: string; followerId: string; followingId: string }[];
    followings : { id: string; followerId: string; followingId: string }[];
}

const useGetBulkUsersDetails = () => {

    const [bulkUser, setBulkUser] = useState<IUser[]>([]);
    const [bulkUserLoading,setBulkUserLoading] = useState<boolean>();

    useEffect(()=> {
        const getBulkUsersDetails = async () => {
            try{
                setBulkUserLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/bulk`,{
                    headers: {
                        Authorization :localStorage.getItem("token")
                    }
                })
                
                setBulkUser(res.data);
            }catch(e){
                console.log("An error Occurred", e);
            }finally{
                setBulkUserLoading(false);
            }
        }
        getBulkUsersDetails();
    },[])

    return {
        bulkUserLoading,
        bulkUser
    }
}

export default useGetBulkUsersDetails;