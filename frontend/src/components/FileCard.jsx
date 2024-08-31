import React from 'react';

const FileCard = ({ title, lastModified, image, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <span className="text-sm text-gray-500">Last Modified - {lastModified}</span>
      </div>
      <img src={image} alt={`${title} Spreadsheet`} className="h-60 rounded-lg" />
    </div>
  );
};

export default FileCard;
