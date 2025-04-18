import React, { useState, useEffect } from 'react';
import '../../styles/delivery/AdminPaymentReview.css';

const AdminPaymentReview = () => {
    const [bankSlips, setBankSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('PENDING');

    useEffect(() => {
        fetchBankSlips();
    }, [statusFilter]);

    const fetchBankSlips = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/bank-slips/list?status=${statusFilter}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bank slips');
            }
            
            const data = await response.json();
            setBankSlips(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleViewSlip = async (slipId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bank-slips/${slipId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bank slip details');
            }
            
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
    };

    const updatePaymentStatus = async (slipId, status, reason = '') => {
        try {
            const response = await fetch(`http://localhost:8080/api/bank-slips/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    slipId: slipId,
                    status: status,
                    reason: reason
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to ${status.toLowerCase()} payment`);
            }
            
            // Update local state
            setBankSlips(bankSlips.filter(slip => slip.id !== slipId));
            setViewerOpen(false);
            
            // Show success message
            alert(`Payment ${status.toLowerCase()} successfully`);
            
            // Refresh the list
            fetchBankSlips();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleApprove = () => {
        if (selectedSlip) {
            updatePaymentStatus(selectedSlip.id, 'VERIFIED');
        }
    };

    const handleReject = () => {
        if (selectedSlip) {
            const reason = prompt('Please enter a reason for rejection:');
            if (reason) {
                updatePaymentStatus(selectedSlip.id, 'REJECTED', reason);
            }
        }
    };

    const formatStatusLabel = (status) => {
        if (!status) return '';
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <div className="admin-payment-container">
            <div className="admin-header">
                <h1>Admin Payment Review</h1>
                <div className="filter-controls">
                    <label>
                        Status:
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="all">All</option>
                        </select>
                    </label>
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
                                    <tr key={slip.id} className={slip.status.toLowerCase()}>
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
                                            <button 
                                                className="view-button"
                                                onClick={() => handleViewSlip(slip.id)}
                                            >
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
                            <div className="detail-item">
                                <span className="label">Order ID:</span>
                                <span className="value">{selectedSlip.orderId}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">User Email:</span>
                                <span className="value">{selectedSlip.userEmail}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">File Name:</span>
                                <span className="value">{selectedSlip.fileName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Upload Date:</span>
                                <span className="value">
                                    {new Date(selectedSlip.uploadDate).toLocaleString()}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Status:</span>
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
                            {selectedSlip.fileType && selectedSlip.fileType.includes('image') ? (
                                <img 
                                    src={`http://localhost:8080/api/bank-slips/file/${selectedSlip.id}`} 
                                    alt="Bank Slip" 
                                    className="slip-image"
                                />
                            ) : (
                                <div className="pdf-viewer">
                                    <iframe 
                                        src={`http://localhost:8080/api/bank-slips/file/${selectedSlip.id}`}
                                        title="Bank Slip PDF"
                                        width="100%"
                                        height="500px"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                        
                        {selectedSlip.status === "PENDING" && (
                            <div className="action-buttons">
                                <button 
                                    className="approve-button"
                                    onClick={handleApprove}
                                >
                                    Approve Payment
                                </button>
                                <button 
                                    className="reject-button"
                                    onClick={handleReject}
                                >
                                    Reject Payment
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