import { atom } from "recoil";

export const authScreenAtom = atom({
    key : "authScreenAtom",
    default : "signup"
})

export default authScreenAtom;