import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast, ToastContainer } from 'react-toastify';


const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://api1.liveabuzz.com/account/web/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: email,
                    passwd: password,
                    source: 5,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.statusDescription?.statusCode === 200 && data.statusDescription?.statusMessage === 'Success') {
                const user = data.adminUser;
                localStorage.setItem('jwtToken', user.admUserTokenDetails.jwtToken);
                localStorage.setItem('loginSource', user.loginSource);
                localStorage.setItem('adminuserid', user.id);
                localStorage.setItem('auth', 'true');

                setIsAuthenticated(true);
                navigate('/home');
            } else {
                toast.error(data.statusDescription?.statusMessage || 'Login failed. Please try again.');
            }
        } catch (error) {
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card text-center">
                <div className="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" className="bi bi-lock-fill" viewBox="0 0 16 16">
                        <path d="M8 1a3 3 0 0 0-3 3v3H3.5A1.5 1.5 0 0 0 2 8.5v6A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12.5 7H11V4a3 3 0 0 0-3-3zm-2 6V4a2 2 0 1 1 4 0v3H6z" />
                    </svg>
                </div>
                <div className="login-title">Login</div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username*"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start position-relative">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password*"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                            <i className="fas fa-eye-slash"></i>
                        </span>
                    </div>

                    {error && <div className="text-danger mb-2">{error}</div>}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">SIGN IN</button>
                    </div>
                    <span className="reset-text">Reset</span>
                </form>
            </div>
            <ToastContainer />

        </div>
    );
};

export default Login;
