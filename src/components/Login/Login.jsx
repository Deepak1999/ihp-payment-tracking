import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate login success
        setIsAuthenticated(true);
        localStorage.setItem('auth', 'true'); // Persist login
        navigate('/home'); // Redirect to home page
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
                        <input type="text" className="form-control" placeholder="Username*" required />
                    </div>
                    <div className="mb-3 text-start position-relative">
                        <input type="password" className="form-control" placeholder="Password*" required />
                        <span className="position-absolute end-0 top-50 translate-middle-y me-3">
                            <i className="fas fa-eye-slash"></i>
                        </span>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">SIGN IN</button>
                    </div>
                    <span className="reset-text">Reset</span>
                </form>
            </div>
        </div>
    );
};

export default Login;
