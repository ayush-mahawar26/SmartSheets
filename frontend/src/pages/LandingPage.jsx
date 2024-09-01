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
  const [ownedSheets, setOwnedSheets] = useState([]);
  const [collaboratedSheets, setCollaboratedSheets] = useState([]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://smartsheets.onrender.com/user/me', {
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

    fetch('https://smartsheets.onrender.com/sheet/owned', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setOwnedSheets(data);
      })
      .catch(error => {
        console.error('Error fetching owned sheets:', error);
      });

    fetch('https://smartsheets.onrender.com/sheet/collaborated', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setCollaboratedSheets(data);
      })
      .catch(error => {
        console.error('Error fetching collaborated sheets:', error);
      });
  }, []);

  const handleNewSpreadsheet = () => {
    if (isLoggedIn) {
      const sheetId = uuid();
      navigate(`/sheet/${sheetId}`);
    } else {
      navigate('/signin');
    }
  };

  const handleFileClick = (sheetId) => {
    navigate(`/sheet/${sheetId}`);
  };

  const handleCollaborateClick = () => {
    navigate('/collaborate');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate('/signin');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-[#EAF1FF] flex flex-col items-center justify-center md:fixed top-0 left-0 h-full shadow-lg p-6">
        <img src={smartsheets} alt="Smartsheets" className="w-40 md:w-80 mb-8" />
        <h2 className="text-lg md:text-xl text-gray-800 mb-6">
          {userDetails ? `Welcome back, ${capitalizeFirstLetter(userDetails.firstName)}!` : 'Welcome back!'}
        </h2>

        <div className="flex flex-col items-center space-y-4 w-full">
          <button className="bg-blue-500 text-white text-base md:text-lg py-2 px-6 rounded-lg shadow w-full" onClick={handleNewSpreadsheet}>
            New Spreadsheet
          </button>
          <button className="bg-blue-200 text-black text-base md:text-lg py-2 px-14 rounded-lg shadow w-full" onClick={handleCollaborateClick}>
            Collaborate
          </button>

          {!isLoggedIn ? (
            <button className="bg-green-500 text-white text-base md:text-lg py-2 px-14 rounded-lg shadow w-full" onClick={handleSignIn}>
              Sign In
            </button>
          ) : (
            <button className="bg-red-500 text-white text-base md:text-lg py-2 px-14 rounded-lg shadow w-full" onClick={handleSignOut}>
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 bg-[#F9FBFD] md:ml-[33%] overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          All Available Sheets
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Your Sheets</h2>

        {ownedSheets.length === 0 ? (
          <p className="text-gray-600 text-lg md:text-2xl text-center mt-20">No files available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedSheets.map(sheet => (
              <FileCard
                key={sheet._id}
                title={sheet.sheetName}
                lastModified={new Date(sheet.updatedAt).toLocaleDateString()}
                image={demoPage}
                onClick={() => handleFileClick(sheet.sheetid)}
              />
            ))}
          </div>
        )}

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 mt-10">Collaborated Sheets</h2>

        {collaboratedSheets.length === 0 ? (
          <p className="text-gray-600 text-lg md:text-2xl text-center mt-20">No collaborated files available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaboratedSheets.map(sheet => (
              <FileCard
                key={sheet._id}
                title={sheet.sheetName}
                lastModified={new Date(sheet.updatedAt).toLocaleDateString()}
                image={demoPage}
                onClick={() => handleFileClick(sheet.sheetid)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
