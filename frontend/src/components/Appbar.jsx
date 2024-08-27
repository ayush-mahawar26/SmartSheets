import { useState } from "react";
import "./Appbar.css";
import smartsheets from "../assets/smartsheets.png";
import Grid from "./Grid";

function Appbar() {
  return (
    <>
      <div className="navbar h-44">
        {/* logo */}
        <div className="div1">
          <img
            src={smartsheets}
            alt="smartsheets"
            className="h-12 w-24 mt-10 ml-8"
          />
        </div>

        {/* profile */}
        <div className="div2">
          <div className="rounded-full h-16 w-16 bg-[#EAF1FF] flex justify-center mt-10">
            <div className="flex flex-col justify-center h-full text-xl">
              👤
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="div3 flex gap-6">
          <div className="flex flex-col h-full mr-8 mt-6">File</div>
          <div className="flex flex-col h-full mr-8 mt-6">Edit</div>
          <div className="flex flex-col h-full mr-8 mt-6">View</div>
          <div className="flex flex-col h-full mr-8 mt-6">Insert</div>
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
          <div className="flex flex-col h-full mr-6 mt-6">Collaborate</div>
          <div className="flex flex-col h-full mr-6 mt-6">Comments</div>
          <div className="flex flex-col h-full mt-6">Share</div>
        </div>

        {/* main functions */}
        <div className="div6"></div>
      </div>

      <Grid />
    </>
  );
}

export default Appbar;