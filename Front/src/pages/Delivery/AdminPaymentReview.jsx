import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/delivery/AdminPaymentReview.css';

const AdminPaymentReview = () => {
    const [bankSlips, setBankSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBankSlips();
    }, [statusFilter]);

    const fetchBankSlips = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/bank-slips/list?status=${statusFilter}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) throw new Error('Failed to fetch bank slips');

            let data = await response.json();
            
            // Sort by upload date in descending order (newest first)
            data = data.sort((a, b) => {
                return new Date(b.uploadDate) - new Date(a.uploadDate);
            });
            
            setBankSlips(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSlip = async (slipId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bank-slips/${slipId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (!response.ok) throw new Error('Failed to fetch bank slip details');

            const slipData = await response.json();
            setSelectedSlip(slipData);
            setViewerOpen(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCloseViewer = () => {
        setViewerOpen(false);
        setSelectedSlip(null);
        setError(null);
    };

    const updatePaymentStatus = async (slipId, status, reason = '') => {
        setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:8080/api/bank-slips/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ slipId, status, reason })
            });

            if (!response.ok) throw new Error(`Failed to ${status.toLowerCase()} payment`);

            alert(`Payment ${status.toLowerCase()} successfully`);
            setViewerOpen(false);
            fetchBankSlips();
            
            updateOrderStatusCountsInLocalStorage(status);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const sendEmailNotification = async (url, payload) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: new URLSearchParams(payload)
        });

        if (!response.ok) throw new Error('Failed to send email');
    };

    const handleApprove = async () => {
        if (!selectedSlip) return;

        await updatePaymentStatus(selectedSlip.id, 'VERIFIED');

        try {
            await sendEmailNotification(`http://localhost:8080/email/confirm-payment`, {
                userEmail: selectedSlip.userEmail
            });
            console.log('Confirmation email sent');
        } catch (error) {
            console.error('Email Error:', error.message);
        }
    };

    const handleReject = async () => {
        if (!selectedSlip) return;

        const reason = prompt('Please enter a reason for rejection:');
        if (!reason) return;

        await updatePaymentStatus(selectedSlip.id, 'REJECTED', reason);

        try {
            await sendEmailNotification(`http://localhost:8080/email/reject-payment`, {
                userEmail: selectedSlip.userEmail
            });
            console.log('Rejection email sent');
        } catch (error) {
            console.error('Email Error:', error.message);
        }
    };

    const updateOrderStatusCountsInLocalStorage = async (newStatus) => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/status-counts`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (!response.ok) throw new Error('Failed to fetch order status counts');
            
            const statusCounts = await response.json();
            
            localStorage.setItem('orderStatusCounts', JSON.stringify(statusCounts));
            
            window.dispatchEvent(new CustomEvent('orderStatusUpdated', { 
                detail: { statusCounts } 
            }));
            
        } catch (error) {
            console.error('Failed to update order status counts:', error);
        }
    };

    const handleShippingStatusChange = async (newStatus) => {
        if (!selectedSlip) return;
        setIsUpdating(true);

        try {
            const response = await fetch(`http://localhost:8080/api/bank-slips/update-shipping-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ slipId: selectedSlip.id, shippingStatus: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update shipping status');

            await sendEmailNotification(`http://localhost:8080/email/send-shipping-status`, {
                userEmail: selectedSlip.userEmail,
                shippingStatus: newStatus
            });

            alert('Shipping status updated and email sent');
            
            try {
                const countsResponse = await fetch(`http://localhost:8080/api/orders/status-counts`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                
                if (!countsResponse.ok) throw new Error('Failed to fetch updated counts');
                
                const statusCounts = await countsResponse.json();
                
                localStorage.setItem('orderStatusCounts', JSON.stringify(statusCounts));
                
                window.dispatchEvent(new CustomEvent('orderStatusUpdated', { 
                    detail: { statusCounts, updatedStatus: newStatus } 
                }));
                
            } catch (countError) {
                console.error('Failed to update status counts:', countError);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatStatusLabel = (status) => {
        if (!status) return '';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    return (
        <div className="admin-payment-container">
            <div className="admin-header">
                <h1>Admin Payment Review</h1>
                <div className="filter-controls">
                    <label>Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="PENDING">Pending </option>
                        <option value="VERIFIED">Verified</option>
                        <option value="REJECTED">Rejected </option>
                        <option value="all">All </option>
                    </select>
                </div>
            </div>

            {loading && <div className="loading">Loading bank slips...</div>}
            {error && <div className="error">Error: {error}</div>}

            {!loading && !error && (
                <div className="bank-slips-list">
                    {bankSlips.length === 0 ? (
                        <div className="no-slips">No bank slips found with status: {formatStatusLabel(statusFilter)}</div>
                    ) : (
                        <table className="slips-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User Email</th>
                                    <th>File Name</th>
                                    <th>Upload Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bankSlips.map(slip => (
                                    <tr key={slip.id}>
                                        <td>{slip.orderId}</td>
                                        <td>{slip.userEmail}</td>
                                        <td>{slip.fileName}</td>
                                        <td>{new Date(slip.uploadDate).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${slip.status.toLowerCase()}`}>
                                                {formatStatusLabel(slip.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="view-button" onClick={() => handleViewSlip(slip.id)}>
                                                View Slip
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {viewerOpen && selectedSlip && (
                <div className="slip-viewer-overlay">
                    <div className="slip-viewer">
                        <div className="viewer-header">
                            <h2>Bank Slip Details</h2>
                            <button className="close-button" onClick={handleCloseViewer}>×</button>
                        </div>

                        <div className="slip-details">
                            <div className="detail-item"><span className="label">Order ID:</span><span className="value">{selectedSlip.orderId}</span></div>
                            <div className="detail-item"><span className="label">User Email:</span><span className="value">{selectedSlip.userEmail}</span></div>
                            <div className="detail-item"><span className="label">File Name:</span><span className="value">{selectedSlip.fileName}</span></div>
                            <div className="detail-item"><span className="label">Upload Date:</span><span className="value">{new Date(selectedSlip.uploadDate).toLocaleString()}</span></div>
                            <div className="detail-item"><span className="label">Status:</span>
                                <span className={`status-badge ${selectedSlip.status.toLowerCase()}`}>
                                    {formatStatusLabel(selectedSlip.status)}
                                </span>
                            </div>
                            {selectedSlip.rejectReason && (
                                <div className="detail-item">
                                    <span className="label">Rejection Reason:</span>
                                    <span className="value">{selectedSlip.rejectReason}</span>
                                </div>
                            )}
                        </div>

                        <div className="slip-image-container">
                            {selectedSlip.fileType?.includes('image') ? (
                                <img src={`http://localhost:8080/api/bank-slips/file/${selectedSlip.id}`} alt="Bank Slip" className="slip-image" />
                            ) : (
                                <iframe
                                    src={`http://localhost:8080/api/bank-slips/file/${selectedSlip.id}`}
                                    title="Bank Slip PDF"
                                    width="100%" height="500px"
                                />
                            )}
                        </div>

                        {selectedSlip.status === 'PENDING' && (
                            <div className="action-buttons">
                                <button className="approve-button" onClick={handleApprove} disabled={isUpdating}>Approve</button>
                                <button className="reject-button" onClick={handleReject} disabled={isUpdating}>Reject</button>
                            </div>
                        )}

                        {selectedSlip.status === 'VERIFIED' && (
                            <div className="shipping-status-container">
                                <div className="shipping-status">
                                    <label>Shipping Status:</label>
                                    <select onChange={(e) => handleShippingStatusChange(e.target.value)} defaultValue="">
                                        <option value="" disabled>Select status</option>
                                        <option value="TO_BE_SHIPPED">To Be Shipped</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="COMPLETE">Complete</option>
                                    </select>
                                </div>
                                <button 
                                    className="assign-delivery-button"
                                    onClick={() => navigate('/admintable')}
                                >
                                    Assign Delivery Person
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentReview; 