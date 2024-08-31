import React, { useState,useEffect } from 'react';
import smartsheets from "../assets/smartsheets.png";
import { useNavigate } from "react-router-dom";
import demoPage from "../assets/demoPage.png";
import { v4 as uuid } from 'uuid';

const LandingPage = () => {

    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      setIsLoggedIn(!!token); // Set isLoggedIn to true if the token exists
    }, []);

    const handleNewSpreadsheet = () => {
      if (isLoggedIn) {
        const sheetId = uuid();
        navigate(`/testing/${sheetId}`); 
      } else {
        navigate('/signin'); // Redirect to login if not logged in
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#EAF1FF] flex flex-col items-center justify-center rounded-r-lg shadow-lg">
        <div className="mb-8">
            <img src={smartsheets} alt="Smartsheets" className="w-80" />
        </div>
        <h2 className="text-xl text-gray-800 mb-6">Welcome back Chirag!</h2>
        <button className="bg-blue-500 text-white text-lg py-2 px-6 rounded-lg mb-4 shadow" onClick={handleNewSpreadsheet}>
          New Spreadsheet
        </button>
        <button className="bg-blue-200 text-black text-lg py-2 px-14 w-52 rounded-lg shadow">
          Collaborate
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-[#F9FBFD]">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Existing Files</h2>

        <div className="grid grid-cols-1 gap-6">
          {/* File 1 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Database</h3>
              <span className="text-sm text-gray-500">Last Modified - 28/08/2024</span>
            </div>
            <img src={demoPage} alt="People Spreadsheet" className="h-60 rounded-lg" />

          </div>

          {/* File 2 */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">People</h3>
              <span className="text-sm text-gray-500">Last Modified - 26/08/2024</span>
            </div>
            <img src={demoPage} alt="People Spreadsheet" className="h-60 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;