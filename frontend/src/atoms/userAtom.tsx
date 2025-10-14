import { atom } from "recoil";
import { IUserUser } from "../types/types";

export const userAtom = atom<IUserUser>({
    key : "userAtom",
    default : JSON.parse(localStorage.getItem("user-info") as string),
})

export default userAtom;