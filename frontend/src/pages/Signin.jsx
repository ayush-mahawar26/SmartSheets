import BottomWarning from "../components/BottomWarning.jsx";
import Button from "../components/Button.jsx";
import Heading from "../components/Heading.jsx";
import InputBox from "../components/InputBox.jsx";
import SubHeading from "../components/SubHeading.jsx";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [useremail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const resp = await axios.post("https://smartsheets.onrender.com/user/signin", {
        useremail,
        password,
      });

      localStorage.setItem("token", resp.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "An error occurred while signing in");
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex items-center justify-center p-4">
      <div className="rounded-lg bg-white w-full max-w-md text-center p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Sign In</h1>
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />

        <div className="mt-4">
          <InputBox
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter Your Email"
            label={"Email"}
            value={useremail}
          />
        </div>

        <div className="mt-4">
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            label={"Password"}
            value={password}
            type="password"
          />
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="pt-6">
          <Button onClick={handleSignIn} label={"Sign in"} />
        </div>

        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  );
}

export default Signin;