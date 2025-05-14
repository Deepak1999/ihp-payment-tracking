import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ihpLogo from '../Images/ihp_logo.png';
import LogoutPopup from '../Popup/LogoutPopup';

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = () => {
        console.log("Logged out!");
        setShowLogout(false);
        localStorage.removeItem('auth');
        localStorage.removeItem('adminuserid');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('loginSource');
        window.location.href = '/';
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <img className="img-fluid ihp_logo" src={ihpLogo} alt="IHP Logo" />
                    <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarTabs">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTabs">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link tab-link" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link tab-link" to="/payment">Payment</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link tab-link" to="/spnc-adj">Suspense Adjustment</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link tab-link" to="/report">Report</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link tab-link" to="/suspense">Suspense Payments</Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link tab-link" to="/" onClick={() => setShowLogout(true)}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <LogoutPopup
                show={showLogout}
                onConfirm={handleLogout}
                onCancel={() => setShowLogout(false)}
            />
        </>
    );
};

export default Navbar;
