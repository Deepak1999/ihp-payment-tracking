import React, { useState } from 'react';
import '../PageCss/SuspenseAdjustment.css';

const SuspenseAdjustment = () => {
    const [transactionId, setTransactionId] = useState('');
    const [bookingId, setBookingId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Transaction ID:', transactionId);
        console.log('Booking ID:', bookingId);
        // Your API logic goes here
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Suspense Payment Adjustment</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5 col-sm-6">
                                <label htmlFor="transactionId" className="form-label">Transaction ID</label>
                                <input
                                    type="text"
                                    id="transactionId"
                                    className="form-control"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Enter Transaction ID"
                                    required
                                />
                            </div>
                            <div className="col-md-5 col-sm-6">
                                <label htmlFor="bookingId" className="form-label">Booking ID</label>
                                <input
                                    type="text"
                                    id="bookingId"
                                    className="form-control"
                                    value={bookingId}
                                    onChange={(e) => setBookingId(e.target.value)}
                                    placeholder="Enter Booking ID"
                                    required
                                />
                            </div>
                            <div className="col-md-2 col-12">
                                <button type="submit" className="btn btn-success w-100">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SuspenseAdjustment;
