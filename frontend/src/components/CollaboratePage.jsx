import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CollaboratePage = () => {
  const [sheetId, setSheetId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSheetIdChange = (e) => {
    setSheetId(e.target.value);
  };

  const handleCollaborate = () => {
    fetch(`http://localhost:3000/sheet/${sheetId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => {
        if (response.status === 404) {
          setErrorMessage('Sheet ID not available');
        } else if (response.status === 200) {
          navigate(`/testing/${sheetId}`);
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error fetching sheet:', error);
        setErrorMessage('An error occurred. Please try again.');
      });
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/signin'); // Redirect to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Collaborate on a Spreadsheet
      </h2>
      <input
        type="text"
        value={sheetId}
        onChange={handleSheetIdChange}
        placeholder="Enter Sheet ID"
        className="border p-2 rounded mb-4 w-full max-w-md"
      />
      <button
        onClick={handleCollaborate}
        className="bg-blue-500 text-white text-lg py-2 px-6 rounded-lg mb-4 shadow w-full max-w-md"
      >
        Collaborate
      </button>
      
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      <div className="flex flex-col md:flex-row gap-4 mt-6 w-full max-w-md">
        <button
          onClick={handleGoBack}
          className="bg-gray-300 text-black text-lg py-2 px-6 rounded-lg shadow w-full"
        >
          Go Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-lg py-2 px-6 rounded-lg shadow w-full"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default CollaboratePage;