import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, formData, { withCredentials: true });
      console.log('Registration successful:', response.data);
      // Możesz przekierować użytkownika po rejestracji lub wyświetlić komunikat
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;
