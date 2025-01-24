import { SignupUserInput } from "@vaibhavpal99/common_social3";
import { ChangeEvent,useState } from "react";
import { useSetRecoilState } from "recoil";
import {authScreenAtom} from "../atoms/authAtom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";

export const Signup = () => {
    const [userInputs,setUserInputs] = useState<SignupUserInput>({
        name : "",
        username : "",
        email : "",
        password : ""
    })
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const navigate = useNavigate();
    const setUser = useSetRecoilState(userAtom);
    
   async function sendRequest(){
    try{

        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,userInputs);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user-info", JSON.stringify(response.data));
        setUser(response.data);
        navigate("/");

    }catch(e){
        //alert user for the failed request
        

    }
   }
    
    return (
    <div className="h-screen flex  justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="text-3xl font-extrabold"> 
                    Welcome User
                </div>
                <LabelledInput label = "Name" placeholder="John Doe" onChange={(e)=> {
                    setUserInputs({
                        ...userInputs,
                        name : e.target.value,
                    })
                }}></LabelledInput>

                <LabelledInput label = "Username" placeholder="JohnDoe" onChange={(e)=> {
                    setUserInputs({
                        ...userInputs,
                        username : e.target.value,
                    })
                }}></LabelledInput>

                <LabelledInput label = "Email" placeholder="johndoe@abc.com" onChange={(e)=> {
                    setUserInputs({
                        ...userInputs,
                        email : e.target.value,
                    })
                }}></LabelledInput>

                <LabelledInput label = "Password" type = {"password"} placeholder="123456" onChange={(e)=> {
                    setUserInputs({
                        ...userInputs,
                        password : e.target.value,
                    })
                }}></LabelledInput>

                <div>
                    Already a User?
                    <button className="pl-2 underline" color={"blue.400"} onClick={()=> {
                        setAuthScreen("login");
                    }}>Login</button>
                </div> 
                <button type="button" onClick={sendRequest} className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Sign up</button>
            </div>
        </div>
    </div>
    )
}

interface LabelledInputType {
    label : string;
    placeholder : string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?:string;
}

function LabelledInput({label, placeholder, onChange, type} : LabelledInputType){

    return <div>
        <div>
            <label  className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <input onChange={onChange} type={type || "text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    </div>

}