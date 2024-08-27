import BottomWarning from "../components/BottomWarning.jsx"
import  Button  from "../components/Button.jsx"
import  Heading  from "../components/Heading.jsx"
import  InputBox  from "../components/InputBox.jsx"
import  SubHeading  from "../components/SubHeading.jsx"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Signin(){

  const [useremail, setuseremail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={
              (e) => {
                setuseremail(e.target.value);
              }
            } placeholder="Enter Your Mail-ID" label={"Email"} />
        <InputBox onChange={
              (e) => {
                setPassword(e.target.value);
              }
            } placeholder="Enter Your Password" label={"Password"} />
        <div className="pt-4">
          <Button onClick={
                async () => {
                  console.log( useremail, password);
                  const resp = await axios.post("http://localhost:3000/user/signin", {
                    useremail,
                    password
                  });
                  localStorage.setItem("token", resp.data.token);
                  navigate("/");
                }
              } label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

export default Signin
