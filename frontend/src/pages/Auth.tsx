import { useRecoilValue } from "recoil";
import { Login } from "../component/Login";
import { Signup } from "../component/Signup";
import {authScreenAtom} from "../atoms/authAtom";



export const Auth = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <Login /> : <Signup />}</>;
};

// export default Auth;