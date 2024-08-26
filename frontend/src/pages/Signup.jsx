import  BottomWarning  from "../components/BottomWarning"
import  Button  from "../components/Button"
import  Heading  from "../components/Heading"
import  InputBox  from "../components/InputBox"
import  SubHeading  from "../components/SubHeading"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"



function signup() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



    return(
      <>
      <div className="bg-slate-300 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign up"} />
            <SubHeading text={"Enter your infromation to create an account"} />
            <InputBox onChange={
              (e) => {
                setFirstName(e.target.value);
              }
            } placeholder="Enter Your FirstName" label={"First Name"} />
            <InputBox onChange={
              (e) => {
                setLastName(e.target.value);
              }
            } placeholder="Enter Your LastName" label={"Last Name"} />
            <InputBox onChange={
              (e) => {
                setUserName(e.target.value);
              }
            } placeholder="Enter Your UserName" label={"User Name"} />
            <InputBox onChange={
              (e) => {
                setPassword(e.target.value);
              }
            } placeholder="Enter Your Password" label={"Password"} />
            <div className="pt-4">
              <Button onClick={
                async () => {
                  console.log(firstName, lastName, username, password);
                  const resp = await axios.post("http://localhost:3000/signup", {
                    username,
                    firstName,
                    lastName,
                    password
                  });
                  localStorage.setItem("token", resp.data.token);
                  navigate("/");
                }
              } label={"Sign up"} />
            </div>
            <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
          </div>
        </div>
      </div>
      </>
)};

export default signup

