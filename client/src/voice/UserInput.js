import React, { useState } from 'react';

const UserInput = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh
    onSubmit(inputValue); // Pass the input value back to parent
    setInputValue(""); // Clear the input field
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your speech..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UserInput;
