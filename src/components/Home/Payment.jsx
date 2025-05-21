import React, { use, useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import '../Navbar/Navbar.css';
import ApiBaseUrl from '../ApiBaseUrl/ApiBaseUrl';

const Payment = () => {
    const [searchInput, setSearchInput] = useState('');
    const [bookingData, setBookingData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchBookingData = async () => {
        const userId = localStorage.getItem('adminuserid');
        const jwtToken = localStorage.getItem('jwtToken');
        const source = localStorage.getItem('loginSource');

        if (!userId || !jwtToken || !source || !selectedBookingId) {
            setError('Please select a valid district.');
            return;
        }

        setError('');
        setLoading(true);

        const payload = {
            jwtToken,
            source,
            search: [{ key: 'masterBookingId', value: selectedBookingId }],
        };

        try {
            const response = await fetch(`${ApiBaseUrl}/web/bookings/v1/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok && result?.statusDescription?.statusCode === 200) {
                const paidPayments = result.bookingsInfo?.flatMap(
                    info => info?.bookingDetails?.paidPayments || []
                );

                const sortedPayments = [...paidPayments].sort((a, b) => b.dateTime - a.dateTime);

                setBookingData(sortedPayments);
                fetchPaymentReport(sortedPayments);
            } else {
                setError(result.statusDescription?.statusMessage || 'Failed to fetch booking data.');
                setBookingData([]);
            }
        } catch (err) {
            setError('Something went wrong while fetching data.');
        } finally {
            setLoading(false);
        }
    };


    const fetchPaymentReport = async (paidPayments) => {
        const userId = localStorage.getItem('adminuserid');
        const jwtToken = localStorage.getItem('jwtToken');
        const source = localStorage.getItem('loginSource');

        if (!userId || !jwtToken || !source) {
            setError('Missing required credentials.');
            return;
        }

        try {
            const updatedPayments = await Promise.all(
                paidPayments.map(async (payment) => {
                    const transactionId = payment.transactionId;

                    const payload = {
                        jwtToken,
                        source,
                        transactionId,
                    };

                    const response = await fetch(`${ApiBaseUrl}/web/system/v1/data/paymentsreport/${userId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    const result = await response.json();

                    if (response.ok && result?.statusDescription?.statusCode === 200) {
                        const bankResp = result?.bookingsInfo?.[0]?.bookingDetails?.btPayments?.[0]?.bankResp;
                        return {
                            ...payment,
                            remitterName: bankResp?.remitterName || 'N/A',
                        };
                    } else {
                        console.error('Payment report error:', result?.statusDescription?.statusMessage);
                        return {
                            ...payment,
                            remitterName: 'Error',
                        };
                    }
                })
            );

            setBookingData(updatedPayments);
        } catch (err) {
            console.error('Error fetching payment report:', err);
        }
    };

    const filteredData = useMemo(() => {
        if (!searchInput) return bookingData;
        return bookingData.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchInput.toLowerCase())
            )
        );
    }, [bookingData, searchInput]);

    const columns = useMemo(() => [
        { Header: 'Booking ID', accessor: 'masterBookingId' },
        {
            Header: 'Date',
            accessor: 'responseDateTime',
            Cell: ({ value }) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
                let status = '';
                let color = '';

                switch (value) {
                    case '1':
                    case 1:
                        status = 'Success';
                        color = 'green';
                        break;
                    case '2':
                    case 2:
                        status = 'Pending';
                        color = 'orange';
                        break;
                    case '3':
                    case 3:
                        status = 'Failed';
                        color = 'red';
                        break;
                    default:
                        status = 'Unknown';
                        color = 'gray';
                }

                return <span style={{ color, fontWeight: 'bold' }}>{status}</span>;
            }
        },
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
        { columns, data: filteredData, initialState: { pageSize: 10 } },
        usePagination
    );

    return (
        <div className="container tab-content">
            <div className="container mt-4">
                <div className="mb-2 row justify-content-end">
                    <div className="col-md-3 col-6">
                        <label htmlFor="paymentType" className="form-label sel_lbl">Select Districts</label>
                        <select
                            className="form-select"
                            id="paymentType"
                            value={selectedBookingId}
                            onChange={(e) => setSelectedBookingId(e.target.value)}
                        >
                            <option value="">Select....</option>
                            <option value="13042562187">IHP-Panchkula</option>
                            <option value="13042582236">IHP-Chandigarh</option>
                            <option value="13042564415">IHP-Karnal</option>
                            <option value="13042531857">IHP-Yamuna Nagar</option>
                            <option value="13042555372">IHP-Patiala</option>
                            <option value="13042575174">IHP-Ambala City</option>
                            <option value="13042577002">IHP-Ambala Cantt</option>
                        </select>
                    </div>
                    <div className="col-md-1 col-2 d-flex align-items-end search_div">
                        <button className="btn btn-green mt-3 mt-md-0 w-50" onClick={fetchBookingData}>
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <div className="col-md-3 col-6 d-flex justify-content-end">
                    <input
                        type="text"
                        className="form-control search_input mb-2"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    // <div className="table-responsive scrollable-table">
                    //     <table {...getTableProps()} className="table table-bordered table-striped mt-0">
                    //         <thead className="table-success">
                    //             {headerGroups.map(headerGroup => (
                    //                 <tr {...headerGroup.getHeaderGroupProps()}>
                    //                     {headerGroup.headers.map(column => (
                    //                         <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    //                     ))}
                    //                 </tr>
                    //             ))}
                    //         </thead>
                    //         <tbody {...getTableBodyProps()}>
                    //             {page.map(row => {
                    //                 prepareRow(row);
                    //                 return (
                    //                     <tr {...row.getRowProps()}>
                    //                         {row.cells.map(cell => (
                    //                             <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    //                         ))}
                    //                     </tr>
                    //                 );
                    //             })}
                    //             {page.length === 0 && (
                    //                 <tr>
                    //                     <td colSpan={columns.length} className="text-center">
                    //                         No payment records found.
                    //                     </td>
                    //                 </tr>
                    //             )}
                    //         </tbody>
                    //     </table>
                    // </div>
                    <div className="table-responsive">
                        <table {...getTableProps()} className="table table-bordered table-striped mt-0">
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


                )}

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
        </div>
    );
};

export default Payment;
