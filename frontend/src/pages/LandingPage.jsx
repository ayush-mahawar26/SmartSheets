import React, { useState, useEffect } from 'react';
import smartsheets from "../assets/smartsheets.png";
import { useNavigate } from "react-router-dom";
import demoPage from "../assets/demoPage.png";
import { v4 as uuid } from 'uuid';
import FileCard from '../components/FileCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [sheets, setSheets] = useState([]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/user/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setIsLoggedIn(true);
          setUserDetails(data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }

    // Fetch sheets data
    fetch('http://localhost:3000/sheet/all', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setSheets(data);
      })
      .catch(error => {
        console.error('Error fetching sheets:', error);
      });
  }, []);

  const handleNewSpreadsheet = () => {
    if (isLoggedIn) {
      const sheetId = uuid();
      navigate(`/testing/${sheetId}`);
    } else {
      navigate('/signin');
    }
  };

  const handleFileClick = (sheetId) => {
    navigate(`/testing/${sheetId}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#EAF1FF] flex flex-col items-center justify-center fixed top-0 left-0 h-full shadow-lg">
        <div className="mb-8">
          <img src={smartsheets} alt="Smartsheets" className="w-80 mt-8" />
        </div>
        <h2 className="text-xl text-gray-800 mb-6">
          {userDetails ? `Welcome back, ${capitalizeFirstLetter(userDetails.firstName)}!` : 'Welcome back!'}
        </h2>
        <button className="bg-blue-500 text-white text-lg py-2 px-6 rounded-lg mb-4 shadow" onClick={handleNewSpreadsheet}>
          New Spreadsheet
        </button>
        <button className="bg-blue-200 text-black text-lg py-2 px-14 w-52 rounded-lg shadow">
          Collaborate
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-[#F9FBFD] ml-[33%] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Existing Files</h2>

        <div className="grid grid-cols-1 gap-6">
          {sheets.map(sheet => (
            <FileCard
              key={sheet._id}
              title={sheet.sheetName}
              lastModified={new Date(sheet.updatedAt).toLocaleDateString()}
              image={demoPage}
              onClick={() => handleFileClick(sheet.sheetid)} // Pass the sheetId to the click handler
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
