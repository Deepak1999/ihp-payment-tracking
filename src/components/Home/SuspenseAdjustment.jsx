import React, { useState } from 'react';
import '../PageCss/SuspenseAdjustment.css';
import { toast, ToastContainer } from 'react-toastify';

const SuspenseAdjustment = () => {
    const [transactionId, setTransactionId] = useState('');
    const [masterBookingId, setMasterBookingId] = useState('');

    const handleAdjust = async (e) => {
        e.preventDefault();

        const adminUserId = localStorage.getItem('adminuserid');
        const source = localStorage.getItem('loginSource');
        const jwtToken = localStorage.getItem('jwtToken');

        if (!adminUserId || !source || !jwtToken) {
            toast.error('Missing authentication');
            return;
        }

        const requestBody = {
            transactionId,
            masterBookingId
        };

        const requestHeaders = {
            'Content-Type': 'application/json',
            'adminuserid': adminUserId,
            'source': source,
            'jwttoken': jwtToken
        };

        try {
            const response = await fetch(`https://liveapi-booking.liveabuzz.com/suspense/payment/adjust`, {
                method: 'POST',
                headers: requestHeaders,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Failed to adjust payment. Please try again later.');
            }

            const data = await response.json();

            if (data.statusDescription.statusCode === 200) {
                toast.success('Payment adjustment successful.');
            } else {
                toast.error(data.statusDescription.statusMessage || 'Payment adjustment failed.');
            }

        } catch (error) {
            toast.error(error.message || 'An error occurred. Please try again later.');
        }
    };

    const handleReset = () => {
        setTransactionId('');
        setMasterBookingId('');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Suspense Payment Adjustment</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAdjust}>
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
                            {/* <div className="col-md-5 col-sm-6">
                                <label htmlFor="masterBookingId" className="form-label">Booking ID</label>
                                <input
                                    type="text"
                                    id="masterBookingId"
                                    className="form-control"
                                    value={masterBookingId}
                                    onChange={(e) => setMasterBookingId(e.target.value)}
                                    placeholder="Enter Booking ID"
                                    required
                                />
                            </div> */}

                            <div className="col-md-5 col-sm-6">
                                <label htmlFor="masterBookingId" className="form-label">Booking ID</label>
                                <select
                                    id="masterBookingId"
                                    className="form-select"
                                    value={masterBookingId}
                                    onChange={(e) => setMasterBookingId(e.target.value)}
                                    required
                                >
                                    <option value="">Select Booking ID</option>
                                    <option value="13042562187">IHP-Panchkula</option>
                                    <option value="13042582236">IHP-Chandigarh</option>
                                    <option value="13042564415">IHP-Karnal</option>
                                    <option value="13042575174">IHP-AmbalaCity</option>
                                    <option value="13042577002">IHP-AmbalaCantt</option>
                                    <option value="13042531857">IHP-YamunaNagar</option>
                                    <option value="13042555372">IHP-Patiala</option>
                                </select>

                            </div>


                            <div className="col-md-2 col-12">
                                <button type="submit" className="btn btn-success w-100">Submit</button>
                            </div>

                            {/* <div className="row w-100 m-0">
                                <div className="d-flex justify-content-end align-items-center">
                                    <button type="submit" className="btn mx-3 adjust_btn">
                                        <i className="fa-solid fa-pen-to-square"></i>&nbsp;Adjust
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={handleReset}
                                    >
                                        <i className="fa-solid fa-arrows-rotate"></i>&nbsp;Reset
                                    </button>
                                </div>
                            </div> */}

                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SuspenseAdjustment;
