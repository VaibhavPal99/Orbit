import { atom } from "recoil";

export const userAtom = atom({
    key : "userAtom",
    default : JSON.parse(localStorage.getItem("user-info") as string),
})

export default userAtom;