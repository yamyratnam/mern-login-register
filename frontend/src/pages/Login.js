import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [resetData, setResetData] = useState({
    email: '',
    secretAnswer: '',
    resetToken: '',
    newPassword: '',
  });

  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post('/login', {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success('Login successful. Welcome!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const forgotPassword = async () => {
    const { email, secretAnswer } = resetData;
    try {
      const { data } = await axios.post('/forgot-password', {
        email,
        secretAnswer,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setResetData({ ...resetData, resetToken: data.resetToken });
        toast.success('Reset token generated. Please copy the token.');
        setShowForgotPasswordForm(false); // Close the form after successful token generation
      }
    } catch (error) {
      console.error('Error initiating password reset:', error);
    }
  };

  const resetPassword = async () => {
    const { email, resetToken, newPassword } = resetData;
    try {
      const { data } = await axios.post('/reset-password', {
        email,
        resetToken,
        newPassword,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setResetData({});
        toast.success(data.success);
        toast.success('Reset successful. Welcome!');
        // Redirect to the login page or any other page
        navigate('/login');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>

      {/* Forgot Password Form */}
      {showForgotPasswordForm && (
        <div>
          <h3>Forgot Password</h3>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email..."
            value={resetData.email}
            onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
          />
          <label>Secret Answer</label>
          <input
            type="text"
            placeholder="Enter secret answer..."
            value={resetData.secretAnswer}
            onChange={(e) => setResetData({ ...resetData, secretAnswer: e.target.value })}
          />
          <button type="button" onClick={forgotPassword}>
            Generate Reset Token
          </button>
        </div>
      )}

      {/* Reset Password Form */}
      {resetData.resetToken && (
        <div>
          <h3>Reset Password</h3>
          <p>Reset Token: {resetData.resetToken}</p>

          {/* Show Reset Password Form Button */}
          <button onClick={() => setShowResetForm(true)}>Reset Password</button>

          {/* Reset Password Form */}
          {showResetForm && (
            <form onSubmit={resetPassword}>
              <label>Enter Reset Token:</label>
              <input
                type="text"
                placeholder="Enter reset token..."
                value={resetData.resetToken}
                onChange={(e) => setResetData({ ...resetData, resetToken: e.target.value })}
              />
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password..."
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
              />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      )}


      {/* Button to Toggle Forgot Password Form */}
      <button onClick={() => setShowForgotPasswordForm(!showForgotPasswordForm)}>
        {showForgotPasswordForm ? 'Cancel' : 'Forgot Password?'}
      </button>
    </div>
  );
}
