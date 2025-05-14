import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
// import '../Navbar/Navbar.css';
import { toast, ToastContainer } from 'react-toastify';

const Suspense = () => {

    const [logsData, setLogsData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return date.toLocaleString('en-GB', options).replace(',', '');
    };

    const fetchSuspenseClearanceData = async () => {
        try {
            setLoading(true); // ✅ 2. Set loading true when API starts
            const jwtToken = localStorage.getItem('jwtToken');
            const source = localStorage.getItem('loginSource');
            const userId = localStorage.getItem('adminuserid');

            if (!jwtToken || !source || !userId) {
                throw new Error('Missing required information from localStorage');
            }

            const body = JSON.stringify({ jwtToken, source, userId });

            const response = await fetch(`https://liveapi-booking.liveabuzz.com/suspense/get/suspense/details`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });

            if (!response.ok) {
                throw new Error('Failed to fetch logs data');
            }

            const data = await response.json();
            const { statusDescription } = data;
            if (statusDescription?.statusCode === 200 && statusDescription?.statusMessage === 'Success') {
                setLogsData(data.bankResponseLog || []);
            } else {
                toast.error(`API Error: ${statusDescription?.statusMessage}`);
            }
        } catch (error) {
            toast.error(`Error fetching logs: ${error.message}`);
        } finally {
            setLoading(false); // ✅ 3. Set loading false when API finishes
        }
    };

    useEffect(() => {
        fetchSuspenseClearanceData();
    }, []);

    const columns = useMemo(() => [
        { Header: 'Client Code', accessor: 'clientCode' },
        // { Header: 'Master Booking ID', accessor: 'masterBookingId' },
        {
            Header: 'Amount',
            accessor: 'amount',
            Cell: ({ value }) => `₹ ${parseFloat(value).toFixed(2)}`
        },
        { Header: 'Pay Method', accessor: 'payMethod' },
        { Header: 'Payee Name', accessor: 'remitterName' },
        { Header: 'UTR Number', accessor: 'remitterUtr' },
        { Header: 'Date & Time', accessor: 'dateTime', Cell: ({ value }) => formatDate(value) },
    ], []);

    const filteredData = useMemo(() => {
        if (!searchInput) return logsData;
        return logsData.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchInput.toLowerCase())
            )
        );
    }, [logsData, searchInput]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        state: { pageIndex }
    } = useTable(
        { columns, data: filteredData, initialState: { pageSize: 5 } }, // ✅ fixed here too
        usePagination
    );


    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Suspense Transactions</h5>
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

                {loading ? (
                    <div className="text-center my-4">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="card-body table-responsive">
                        <table {...getTableProps()} className="table table-striped table-bordered">
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
                                        <td colSpan={columns.length} className="text-center">No records found.</td>
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
            <ToastContainer />
        </div>
    );
};

export default Suspense;
