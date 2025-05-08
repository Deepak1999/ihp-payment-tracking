import React from 'react';
import '../Navbar/Navbar.css';

const LogoutPopup = ({ show, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="modal show fade" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header" style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}>
                        <h5 className="modal-title" id="logoutModalLabel">Confirm Logout</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={onCancel}
                            style={{ backgroundColor: 'white' }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to logout?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-green" onClick={onConfirm}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutPopup;
