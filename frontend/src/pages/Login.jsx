import React, { useState } from 'react';
import Navbar from '../components/navbar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

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
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <Navbar />
            <h1 className='text-2xl font-bold mb-4'>Login</h1>
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    className="border rounded px-4 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border rounded px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    disabled={loading}
                    >
                    {loading ? 'Logging in...' : 'Login'}    
                </button>
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    );
}

export default Login