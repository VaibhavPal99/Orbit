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
    followers : string[];
    followings : string[];
}

const useGetBulkUsersDetails = () => {

    const [bulkUser, setBulkUser] = useState<IUser[]>([]);
    const [loading,setLoading] = useState<boolean>();

    useEffect(()=> {
        const getBulkUsersDetails = async () => {
            try{
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/bulk`,{
                    headers: {
                        Authorization :localStorage.getItem("token")
                    }
                })
                
                setBulkUser(res.data);
            }catch(e){
                console.log("An error Occurred", e);
            }finally{
                setLoading(false);
            }
        }
        getBulkUsersDetails();
    },[])

    return {
        loading,
        bulkUser
    }
}

export default useGetBulkUsersDetails;