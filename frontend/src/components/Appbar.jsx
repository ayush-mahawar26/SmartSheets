import "./Appbar.css";
import smartsheets from "../assets/smartsheets.png";
import { useNavigate } from "react-router-dom";

function Appbar() {

  const navigate = useNavigate();

    const handleHome = () => {
      navigate('/');
    };

  return (
    <>
      <div className="navbar h-44">
        {/* logo */}
        <div className="div1">
          <img
            onClick={handleHome}
            src={smartsheets}
            alt="smartsheets"
            className="cursor-pointer h-16 w-32 mt-10 ml-8"
          />
        </div>

        {/* profile */}
        <div className="div2">
          <button className="rounded-full h-16 w-16 bg-[#EAF1FF] flex justify-center mt-10">
            <div className="flex flex-col justify-center h-full text-xl">
              👤
            </div>
          </button>
        </div>

        {/* tabs */}
        <div className="div3 flex gap-6">
          <button className="flex flex-col h-full mr-8 mt-6">File</button>
          <button className="flex flex-col h-full mr-8 mt-6">Edit</button>
          <button className="flex flex-col h-full mr-8 mt-6">View</button>
          <button className="flex flex-col h-full mr-8 mt-6">Insert</button>
        </div>

        {/* search */}
        <div className="div4">
          <input
            className="rounded-full h-10 w-[35rem] bg-[#EAF1FF] mt-5 placeholder-center"
            placeholder="   Search"
          />
        </div>

        {/* tabs */}
        <div className="div5 flex gap-6">
          <button className="flex flex-col h-full mr-6 mt-6">Collaborate</button>
          <button className="flex flex-col h-full mr-6 mt-6">Comments</button>
          <button className="flex flex-col h-full mt-6">Share</button>
        </div>

        {/* main functions */}
        <div className="div6"></div>
      </div>
    </>
  );
}

export default Appbar;