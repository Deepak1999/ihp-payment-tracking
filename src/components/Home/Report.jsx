import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import '../PageCss/Report.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Report = () => {
    const [district, setDistrict] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!district || !startDate || !endDate) {
            alert('Please select district and a valid date range.');
            return;
        }

        const formatDateTime = (date, hours, minutes, seconds) => {
            const d = new Date(date);
            d.setHours(hours, minutes, seconds, 0);
            return d.toISOString().split('.')[0]; // Drop milliseconds
        };

        const startDateTime = formatDateTime(startDate, 0, 0, 0);
        const endDateTime = formatDateTime(endDate, 23, 59, 59);

        const jwtToken = localStorage.getItem('jwtToken');
        const adminUserid = localStorage.getItem('adminuserid');
        const source = localStorage.getItem('loginSource');

        if (!jwtToken || !adminUserid || !source) {
            alert('Missing authentication details.');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch('https://liveapi-booking.liveabuzz.com/abuzz-booking/ihp/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    jwtToken,
                    adminUserid,
                    source
                },
                body: JSON.stringify({
                    masterBookingId: district,
                    startDate: startDateTime,
                    endDate: endDateTime
                })
            });

            if (!response.ok) throw new Error(`API failed with status ${response.status}`);

            const result = await response.json();
            const rawData = result.ihpReport || [];

            if (!rawData.length) {
                alert('No data found for the selected criteria.');
                return;
            }

            const reportData = rawData.map(item => ({
                'Booking ID': item.masterBookingId,
                'Date': new Date(item.dateTime).toLocaleString('en-IN'),
                'Payment Source': item.payMode,
                'Transaction ID': item.transactionId,
                'Client Name': 'BANK',
                'Amount': item.paidAmount,
                'Payment Status': item.paymentStatus === '1' ? 'Paid' : 'Failed'
            }));

            const ws = XLSX.utils.json_to_sheet(reportData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

            FileSaver.saveAs(dataBlob, `Report_${district}_${startDateTime}_to_${endDateTime}.xlsx`);

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch or generate report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 position-relative">
            {loading && (
                <div className="loader-overlay">
                    <div className="spinner-border text-success" role="status" />
                </div>
            )}

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
                            <option value="1">IHP-All</option>
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
                        <label className="form-label">Select Date Range</label>
                        <DatePicker
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable
                            placeholderText="Select a date range"
                            className="form-control"
                        />
                    </div>

                    <div className="col-md-2 col-12 text-md-start text-center">
                        <button type="submit" className="btn btn-success w-100" disabled={loading}>
                            {loading ? 'Downloading...' : 'Download Report'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Report;
