import BottomWarning from "../components/BottomWarning.jsx"
import  Button  from "../components/Button.jsx"
import  Heading  from "../components/Heading.jsx"
import  InputBox  from "../components/InputBox.jsx"
import  SubHeading  from "../components/SubHeading.jsx"

function Signin(){

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox placeholder="Enter Your Mail-ID" label={"Email"} />
        <InputBox placeholder="Enter Your Password" label={"Password"} />
        <div className="pt-4">
          <Button label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

export default Signin
