import { atom } from "recoil";
import { PostType } from "../types/types";

export const postsAtom = atom({

    key : "postsAtom",
    default : [] as PostType[],

})

export default postsAtom;

