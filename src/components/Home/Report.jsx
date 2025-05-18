import React from 'react';
import '../PageCss/Report.css'; // Adjust the path as necessary
const Report = () => {
    return (
        <div className="report-container">
            <div className="report-content">
                <img
                    src="https://i.imgur.com/qIufhof.png" // This is a "Coming Soon" illustration
                    alt="Coming Soon"
                    className="report-image"
                />
                <h2 className="report-title">This Report Page is Under Development!</h2>
                <p className="report-subtitle">We're working hard to bring this feature to you soon. Stay tuned!</p>
            </div>
        </div>
    );
};

export default Report;
