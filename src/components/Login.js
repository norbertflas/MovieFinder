import React, { useState } from 'react';
import axios from 'axios';
import Button from './ui/Button';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, formData, { withCredentials: true });
      console.log('Login successful:', response.data);
      setUser(response.data.user);
      // Możesz przekierować użytkownika po logowaniu lub wyświetlić komunikat
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message : 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
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
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
