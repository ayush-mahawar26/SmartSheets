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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Collaborate on a Spreadsheet</h2>
      <input
        type="text"
        value={sheetId}
        onChange={handleSheetIdChange}
        placeholder="Enter Sheet ID"
        className="border p-2 rounded mb-4 w-1/3"
      />
      <button
        onClick={handleCollaborate}
        className="bg-blue-500 text-white text-lg py-2 px-6 rounded-lg mb-4 shadow"
      >
        Collaborate
      </button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleGoBack}
          className="bg-gray-300 text-black text-lg py-2 px-6 rounded-lg shadow"
        >
          Go Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white text-lg py-2 px-6 rounded-lg shadow"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default CollaboratePage;
