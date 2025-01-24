import { useState } from "react";


const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      console.log("Invalid file type", "Pleas select an image file", "error");
      setImgUrl("");
    }
  };
  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;