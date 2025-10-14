import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";  // Import FaPlus
import { BsFillImageFill } from "react-icons/bs"; // Add this line to fix the import issue
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, TextareaAutosize } from "@mui/material";
import usePreviewImg from "../hooks/usePreviewImg";
import axios from "axios";
import { BACKEND_URL } from "../config";

const MAX_CHAR = 500;

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [postText, setPostText] = useState<string>("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef<HTMLInputElement>(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

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

  const handleCreatePost = async () => {

    setLoading(true);
    let base64File = "";

    // If an image file is selected, convert it to Base64
    if (imageRef.current?.files?.[0]) {
      try {
        base64File = await convertFileToBase64(imageRef.current.files[0]);
      } catch (error) {
        alert("Error: Failed to convert image to Base64");
        setLoading(false);
        return;
      }
    }
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/post/create`, {
        postedBy: user.user.id,
        text: postText,
        file: base64File,
      }, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      const data = await res.data;
      if (data.error) {
        alert("Error: " + data.error); // Replace toast with alert
        return;
      }

      alert("Success: Post created successfully"); // Replace toast with alert
      if (username === user.user.username) {
        setPosts([data, ...posts]);
      }
      setOpen(false);
      setPostText("");
      setImgUrl("");
      setRemainingChar(MAX_CHAR);

    } catch (error) {
      alert("Error: Failed to create a post"); // Replace toast with alert
    } finally {
      setLoading(false);
    }
  };
  

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  return (
    <>
      {username === user.user.username && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-10 right-5 bg-gray-300 p-3 rounded-full"
        >
          <FaPlus size={24} style={{ color: "#ff6347" }}/> {/* Replace AddIcon with FaPlus */}
        </Button>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          {imgUrl && (
            <div className="relative mt-5 w-full">
              <img
                src={imgUrl}
                alt="Selected img"
                className="mb-2 rounded-lg"
              />
              <IconButton
                onClick={() => setImgUrl("")}
                className="absolute top-2 right-2 bg-gray-800 text-white"
              >
                X
              </IconButton>
            </div>
          )}
          <div className="space-y-3">
            <TextareaAutosize
              placeholder="Write your thoughts"
              onChange={handleTextChange}
              value={postText}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between items-center text-xs font-bold text-gray-800">
              <span>{remainingChar}/{MAX_CHAR}</span>
              <Input
                type="file"
                hidden
                inputRef={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                className="cursor-pointer"
                size={16}
                onClick={() => imageRef.current && imageRef.current.click()}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCreatePost}
            disabled={loading}
            className="bg-blue-500 text-white"
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreatePost;
