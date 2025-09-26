import { LoginUserInput } from "@vaibhavpal99/common_social3";
import { ChangeEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { authScreenAtom } from "../atoms/authAtom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";

export const Login = () => {
  const [userInputs, setUserInputs] = useState<LoginUserInput>({
    username: "",
    password: "",
  });
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        userInputs
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user-info", JSON.stringify(response.data));
      setUser(response.data);
      navigate("/");
    } catch (e) {
      //alert user for the failed request
    }
  }

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border border-gray-300 transform transition duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
          Welcome Back 🎉
        </h2>
        <LabelledInput
          label="Username"
          placeholder="JohnDoe"
          onChange={(e) =>
            setUserInputs({ ...userInputs, username: e.target.value })
          }
        />
        <LabelledInput
          label="Password"
          type="password"
          placeholder="••••••"
          onChange={(e) =>
            setUserInputs({ ...userInputs, password: e.target.value })
          }
        />

        <div className="text-sm text-gray-600 mt-2 text-center">
          Don't have an account?
          <button
            className="text-blue-600 hover:text-blue-800 underline ml-1"
            onClick={() => setAuthScreen("signup")}
          >
            Signup
          </button>
        </div>

        <button
          type="button"
          onClick={sendRequest}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold rounded-lg px-4 py-2 mt-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform hover:scale-105"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition transform hover:scale-105 bg-gray-50"
        placeholder={placeholder}
        required
      />
    </div>
  );
}