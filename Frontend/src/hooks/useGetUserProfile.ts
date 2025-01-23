import { useEffect, useState } from "react"
import { IUser } from "./useGetBulkUsersDetails"
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const useGetUserProfile = () => {

    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {username} = useParams();
    
    useEffect(() => {
        const getUser = async () => {
            try{
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/profile/${username}`,{
                    headers : {
                        Authorization : localStorage.getItem("token"),
                    },
                })
                const data = res.data;
                if(data.error){
                    console.log("An error has occurred whille processing your request");
                    return;
                }
                if(data.isFrozen){
                    setUser(null);
                    return;
                }

                setUser(data);
            }catch(e){
                console.log("User page not fetched");
            }
            setLoading(false);
        }
        getUser();

    },[username]);

    return {
        loading,
        user
    }
}