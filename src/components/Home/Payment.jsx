import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import '../Navbar/Navbar.css';

const Payment = () => {
    // Sample data (replace with real API data later)
    const data = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            bookingId: `100${i + 1}`,
            date: '12-02-21',
            source: 'UPI',
            transactionId: `TXN${1748569 + i}`,
            amount: 'Rs 75,000',
            status: 'Success',
        }));
    }, []);

    const columns = useMemo(() => [
        { Header: 'Booking ID', accessor: 'bookingId' },
        { Header: 'Date', accessor: 'date' },
        { Header: 'Payment Source', accessor: 'source' },
        { Header: 'Transaction ID', accessor: 'transactionId' },
        { Header: 'Amount', accessor: 'amount' },
        { Header: 'Payment Status', accessor: 'status' },
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
        {
            columns,
            data,
            initialState: { pageSize: 7 },
        },
        usePagination
    );

    return (
        <div className="container tab-content">
            <div className="container mt-4">

                <div className="mb-2 row justify-content-end">
                    <div className="col-md-3 col-6">
                        <label htmlFor="paymentType" className="form-label sel_lbl">Select BookingID</label>
                        <select className="form-select" id="paymentType">
                            <option value="">Select</option>
                            <option value="1">IHP-Panchkula</option>
                            <option value="2">IHP-Chandigarh</option>
                            <option value="3">IHP-Karnal</option>
                            <option value="4">IHP-Yamuna Nagar</option>
                            <option value="5">IHP-Patiala</option>
                            <option value="6">IHP-Ambala City</option>
                            <option value="7">IHP-Ambala Cantt</option>
                        </select>
                    </div>
                    <div className="col-md-1 col-2 d-flex align-items-end search_div">
                        <button className="btn btn-green mt-3 mt-md-0 w-50">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

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
                        </tbody>
                    </table>
                </div>

                <div className="pagination d-flex justify-content-between align-items-center mt-3">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-outline-primary">
                        Previous
                    </button>
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-outline-primary">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
