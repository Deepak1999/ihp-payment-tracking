// import React from 'react';
// import '../PageCss/Report.css';
// const Report = () => {
//     return (
//         <div className="report-container">
//             <div className="report-content">
//                 <img
//                     src="https://i.imgur.com/qIufhof.png"
//                     alt="Coming Soon"
//                     className="report-image"
//                 />
//                 <h2 className="report-title">This Report Page is Under Development!</h2>
//                 <p className="report-subtitle">We're working hard to bring this feature to you soon. Stay tuned!</p>
//             </div>
//         </div>
//     );
// };

// export default Report;

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import '../PageCss/Report.css';

const Report = () => {
    const [district, setDistrict] = useState('');
    const [monthYear, setMonthYear] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!district || !monthYear) {
            alert('Please select both district and month/year.');
            return;
        }

        const data = [
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
            {
                BookingID: 'B001',
                DateTime: '2025-05-18 10:00',
                'Payment Source': 'Credit Card',
                'Transaction ID': 'TXN12345',
                'Client Name': 'Dummy Data',
                Amount: 1000,
                'Payment Status': 'Completed',
            },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        FileSaver.saveAs(dataBlob, `Report_${district}_${monthYear}.xlsx`);
    };

    return (
        <div className="container py-4">
            <h3 className="text-center mb-4">Generate Monthly Report</h3>
            <form onSubmit={handleSubmit}>
                <div className="row g-3 align-items-end justify-content-center">
                    <div className="col-md-4 col-12">
                        <label className="form-label">Select District</label>
                        <select
                            className="form-select"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            required
                        >
                            <option value="">Choose District...</option>
                            <option value="13042562187">IHP-Panchkula</option>
                            <option value="13042582236">IHP-Chandigarh</option>
                            <option value="13042564415">IHP-Karnal</option>
                            <option value="13042531857">IHP-Yamuna Nagar</option>
                            <option value="13042555372">IHP-Patiala</option>
                            <option value="13042575174">IHP-Ambala City</option>
                            <option value="13042577002">IHP-Ambala Cantt</option>
                        </select>
                    </div>

                    <div className="col-md-4 col-12">
                        <label className="form-label">Select Month & Year</label>
                        <input
                            type="month"
                            className="form-control"
                            value={monthYear}
                            onChange={(e) => setMonthYear(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-2 col-12 text-md-start text-center">
                        <button type="submit" className="btn btn-success w-100">
                            Download Report
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Report;
