import BottomWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [validationErrors, setValidationErrors] = useState([]); // State for individual validation errors
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const resp = await axios.post("https://smartsheets.onrender.com/user/signup", {
        useremail,
        firstName,
        lastName,
        password,
      });

      localStorage.setItem("token", resp.data.token);
      navigate("/");
    } catch (err) {
      if (err.response.data.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response.data.message || "An error occurred while signing up");
      }
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen flex items-center justify-center p-4">
      <div className="rounded-lg bg-white w-full max-w-md text-center p-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Sign Up</h1>
        <Heading label={"Sign up"} />
        <SubHeading text={"Enter your information to create an account"} />

        <div className="mt-4">
          <InputBox
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter Your First Name"
            label={"First Name"}
            value={firstName}
          />
        </div>

        <div className="mt-4">
          <InputBox
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Your Last Name"
            label={"Last Name"}
            value={lastName}
          />
        </div>

        <div className="mt-4">
          <InputBox
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter Your Email"
            label={"Email"}
            value={useremail}
            type="email" // Set input type to email
          />
        </div>

        <div className="mt-4">
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            label={"Password"}
            value={password}
            type="password" // Set input type to password
          />
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="mt-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Display validation errors if any */}
        {validationErrors.length > 0 && (
          <div className="mt-4 text-red-500 text-sm">
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-6">
          <Button onClick={handleSignup} label={"Sign up"} />
        </div>

        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  );
}

export default Signup;