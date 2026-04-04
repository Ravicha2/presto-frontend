import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Alert from '../components/Alert';
import api from '../utils/api';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords not match');
            setLoading(false)
            return;
        }

        if (!name || !email || !password || !confirmPassword) {
            setError("Please complete the form")
            setLoading(false)
            return;
        }

        try {
            const response = await api.POST("/admin/auth/register", {email, password, name});
            localStorage.setItem('token', response.token);
            navigate('/dashboard');
        } catch(error) {
            console.error(error)
            setError('Something wrong')
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <Navbar />
            {error && (
                    <Alert type="error" message={error} onClose={() => setError(null)} />
            )}
            <h1 className='text-2xl font-bold mb-4'>Register</h1>
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    required={true}
                    className="border rounded px-4 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    required={true}
                    className="border rounded px-4 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required={true}
                    className="border rounded px-4 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    required={true}
                    className="border rounded px-4 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                    disabled={loading}
                    >
                    {loading ? 'Signing up...' : 'Sign up'}    
                </button>
            </form>
        </div>
    );
}

export default Register;