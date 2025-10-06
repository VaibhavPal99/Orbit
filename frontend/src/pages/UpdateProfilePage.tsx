import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import usePreviewImg from "../hooks/usePreviewImg";
import userAtom from "../atoms/userAtom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Avatar, Button, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface UpdateUserInputs {
    username: string;
    email: string;
    password: string;
    name: string;
    bio: string;
}

export const UpdateProfilePage = () => {

    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState<UpdateUserInputs>({
        username: user.user.username,
        email: user.user.email,
        password: "",
        name: user.user.name,
        bio: user.user.bio,
    })
    const fileRef = useRef<HTMLInputElement>(null);
    const [updating, setUpdating] = useState<boolean>(false);
    const { handleImageChange, imgUrl } = usePreviewImg();

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string); // Resolve with the base64 string
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file); // Read the file as a data URL (base64)
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (updating) return;

        setUpdating(true);
        let base64File = "";
        if (fileRef.current?.files?.[0]) {
            try {
                base64File = await convertFileToBase64(fileRef.current.files[0]);
            } catch (error) {
                alert("Error: Failed to convert image to Base64");
                setUpdating(false);
                return;
            }
        }
        try {
            const res = await axios.put(`${BACKEND_URL}/api/v1/user/update`, {
                 ...inputs, profilePic: base64File
            }, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            })
            const data = res.data;

            if (data.error) {
                console.log("Error", data.error, "error");
                return;
            }
            console.log("userProfilePage",data);

            console.log("Success", "Profile updated successfully", "success");
            setUser(data);
            localStorage.setItem("user-info", JSON.stringify(data));
        } catch (error) {
            console.log("Error", "error", "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex justify-center my-6">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">User Profile Edit</h2>
                    <h6 className="font-bold text-center mb-4 text-red-900">Password is necessary for profile updation</h6>
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar
                            src={imgUrl || user.user.profilePic}
                            alt="Profile Picture"
                            sx={{ width: 56, height: 56 }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => fileRef.current && fileRef.current.click()}
                        >
                            Change Avatar
                        </Button>
                        <input
                            type="file"
                            hidden
                            ref={fileRef}
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={inputs.name}
                            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Username"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Email Address"
                            value={inputs.email}
                            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Bio"
                            value={inputs.bio}
                            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={()=> {
                                navigate(`/${user.user.username}`);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            type="submit"
                            disabled={updating}
                            startIcon={updating && <CircularProgress size={20} />}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>


        </div>
    )
}