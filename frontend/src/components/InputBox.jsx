import React from 'react';

const InputBox = ({ label, placeholder, onChange, type = "text" }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="text-left text-gray-700 font-semibold mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default InputBox;