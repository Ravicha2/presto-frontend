import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';

// login page
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.POST("/admin/auth/login", {email, password});
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch(error) {
      console.error(error)
      setError('Email or Password incorrect')
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center h-14 bg-linear-to-t from-sky-500 to-indigo-500'>
      <Navbar />
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <form className='flex flex-col gap-2 w-md' onSubmit={handleSubmit}>
        <p>Email</p>
        <input
          type="email"
          placeholder="example@email.com"
          className="border rounded px-4 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />
        <p>Password</p>
        <input
          type="password"
          placeholder="Password1234"
          className="border rounded px-4 py-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 my-4 rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}    
        </button>
      </form>
    </div>
  );
}

export default Login