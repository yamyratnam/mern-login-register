import React, { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState('');  // Corrected the state variable for the user's name
  const [secretAnswer, setSecretAnswer] = useState('');

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
      toast.success('Logout successful. See ya!');
      navigate('/');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const handleSecretAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/update-secret-answer', {
        name: user.name,  // Use user.name instead of name in the request body
        secretAnswer,
      });
      setUser(data); // Update the user context with the new data
      toast.success('Secret answer updated successfully.');
    } catch (error) {
      console.error('Error updating secret answer:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <>
          <h2>Hi {user.name}</h2>
          <form onSubmit={handleSecretAnswerSubmit}>
            <label>Enter Name:</label>
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Enter Secret Answer:</label>
            <input
              type="text"
              placeholder="Enter your secret answer"
              value={secretAnswer}
              onChange={(e) => setSecretAnswer(e.target.value)}
            />
            <button type="submit">Update Secret Answer</button>
          </form>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
