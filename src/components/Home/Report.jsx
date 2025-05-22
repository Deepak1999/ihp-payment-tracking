// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
// import '../PageCss/Report.css';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const Report = () => {
//     const [district, setDistrict] = useState('');
//     const [dateRange, setDateRange] = useState([null, null]);
//     const [startDate, endDate] = dateRange;
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!district || !startDate || !endDate) {
//             alert('Please select district and a valid date range.');
//             return;
//         }

//         const formatDateTime = (date, hours, minutes, seconds) => {
//             const d = new Date(date);
//             d.setHours(hours, minutes, seconds, 0);
//             return d.toISOString().split('.')[0]; // Drop milliseconds
//         };

//         const startDateTime = formatDateTime(startDate, 0, 0, 0);
//         const endDateTime = formatDateTime(endDate, 23, 59, 59);

//         const jwtToken = localStorage.getItem('jwtToken');
//         const adminUserid = localStorage.getItem('adminuserid');
//         const source = localStorage.getItem('loginSource');

//         if (!jwtToken || !adminUserid || !source) {
//             alert('Missing authentication details.');
//             return;
//         }

//         try {
//             setLoading(true);

//             const response = await fetch('https://liveapi-booking.liveabuzz.com/abuzz-booking/ihp/report', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     jwtToken,
//                     adminUserid,
//                     source
//                 },
//                 body: JSON.stringify({
//                     masterBookingId: district,
//                     startDate: startDateTime,
//                     endDate: endDateTime
//                 })
//             });

//             if (!response.ok) throw new Error(`API failed with status ${response.status}`);

//             const result = await response.json();
//             const rawData = result.ihpReport || [];

//             if (!rawData.length) {
//                 alert('No data found for the selected criteria.');
//                 return;
//             }

//             const reportData = rawData.map(item => ({
//                 'Booking ID': item.masterBookingId,
//                 'Date': new Date(item.dateTime).toLocaleString('en-IN'),
//                 'Payment Source': item.payMode,
//                 'Transaction ID': item.transactionId,
//                 'Client Name': 'BANK',
//                 'Amount': item.paidAmount,
//                 'Payment Status': item.paymentStatus === '1' ? 'Paid' : 'Failed'
//             }));

//             const ws = XLSX.utils.json_to_sheet(reportData);
//             const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
//             const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//             const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

//             FileSaver.saveAs(dataBlob, `Report_${district}_${startDateTime}_to_${endDateTime}.xlsx`);

//         } catch (error) {
//             console.error('Error:', error);
//             alert('Failed to fetch or generate report.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container py-4 position-relative">
//             {loading && (
//                 <div className="loader-overlay">
//                     <div className="spinner-border text-success" role="status" />
//                 </div>
//             )}

//             <h3 className="text-center mb-4">Generate Monthly Report</h3>
//             <form onSubmit={handleSubmit}>
//                 <div className="row g-3 align-items-end justify-content-center">
//                     <div className="col-md-4 col-12">
//                         <label className="form-label">Select District</label>
//                         <select
//                             className="form-select"
//                             value={district}
//                             onChange={(e) => setDistrict(e.target.value)}
//                             required
//                         >
//                             <option value="">Choose District...</option>
//                             <option value="1">IHP-All</option>
//                             <option value="13042562187">IHP-Panchkula</option>
//                             <option value="13042582236">IHP-Chandigarh</option>
//                             <option value="13042564415">IHP-Karnal</option>
//                             <option value="13042531857">IHP-Yamuna Nagar</option>
//                             <option value="13042555372">IHP-Patiala</option>
//                             <option value="13042575174">IHP-Ambala City</option>
//                             <option value="13042577002">IHP-Ambala Cantt</option>
//                         </select>
//                     </div>

//                     <div className="col-md-4 col-12">
//                         <label className="form-label">Select Date Range</label>
//                         <DatePicker
//                             selectsRange
//                             startDate={startDate}
//                             endDate={endDate}
//                             onChange={(update) => setDateRange(update)}
//                             isClearable
//                             placeholderText="Select a date range"
//                             className="form-control"
//                         />
//                     </div>

//                     <div className="col-md-2 col-12 text-md-start text-center">
//                         <button type="submit" className="btn btn-success w-100" disabled={loading}>
//                             {loading ? 'Downloading...' : 'Download Report'}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Report;


import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import '../PageCss/Report.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { usePagination, useTable } from 'react-table';

const Report = () => {
    const [district, setDistrict] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);

    const formatDateTime = (date, hours, minutes, seconds) => {
        const d = new Date(date);
        d.setHours(hours, minutes, seconds, 0);
        return d.toISOString().split('.')[0]; // Drop milliseconds
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!district || !startDate || !endDate) {
            alert('Please select district and a valid date range.');
            return;
        }

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
                setReportData([]);
                return;
            }

            const formattedData = rawData.map(item => ({
                masterBookingId: item.masterBookingId,
                responseDateTime: item.responseDateTime,
                payMode: item.payMode,
                transactionId: item.transactionId,
                remitterName: 'BANK',
                totalAmount: item.paidAmount,
                paymentStatus: item.paymentStatus
            }));

            setReportData(formattedData);

            // Prepare and download Excel
            const excelData = formattedData.map(item => ({
                'Booking ID': item.masterBookingId,
                'Date': new Date(item.responseDateTime).toLocaleString('en-IN'),
                'Payment Source': item.payMode,
                'Transaction ID': item.transactionId,
                'Client Name': item.remitterName,
                'Amount': item.totalAmount,
                'Payment Status': item.paymentStatus === '1' ? 'Paid' : 'Failed'
            }));

            const ws = XLSX.utils.json_to_sheet(excelData);
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

    const columns = useMemo(() => [
        { Header: 'Booking ID', accessor: 'masterBookingId' },
        {
            Header: 'Date',
            accessor: 'responseDateTime',
            Cell: ({ value }) => {
                const date = new Date(value);
                return date.toLocaleString('en-IN');
            }
        },
        { Header: 'Payment Source', accessor: 'payMode' },
        { Header: 'Transaction ID', accessor: 'transactionId' },
        { Header: 'Client Name', accessor: 'remitterName' },
        {
            Header: 'Amount',
            accessor: 'totalAmount',
            Cell: ({ value }) => `₹ ${parseFloat(value).toLocaleString()}`
        },
        {
            Header: 'Payment Status',
            accessor: 'paymentStatus',
            Cell: ({ value }) => {
                const status = value === '1' || value === 1 ? 'Paid' : 'Failed';
                const color = value === '1' || value === 1 ? 'green' : 'red';
                return <span style={{ color, fontWeight: 'bold' }}>{status}</span>;
            }
        }
    ], []);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex },
        prepareRow,
    } = useTable(
        { columns, data: reportData, initialState: { pageSize: 10 } },
        usePagination
    );

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

            <div className="table-responsive mt-4">
                <table {...getTableProps()} className="table table-bordered table-striped">
                    <thead className="table-success">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                        {page.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center">
                                    No payment records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination d-flex justify-content-between align-items-center mt-3">
                <button onClick={previousPage} disabled={!canPreviousPage} className="btn btn-outline-success">
                    Previous
                </button>
                <span>
                    Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
                </span>
                <button onClick={nextPage} disabled={!canNextPage} className="btn btn-outline-success">
                    Next
                </button>
            </div>
        </div>
    );
};

export default Report;
