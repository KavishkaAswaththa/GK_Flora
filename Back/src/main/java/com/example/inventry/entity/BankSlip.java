package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "bankSlips")
public class BankSlip {

    @Id
    private String id;
    private String fileName;
    private String fileType;
    private byte[] fileData;
    private String orderId;
    private String userEmail;
    private Date uploadDate;
    private String status; // "PENDING", "VERIFIED", "REJECTED"
    private String rejectionReason;
    private Date rejectionDate;
    private Date verificationDate;
    private String shippingStatus; // "PENDING_SHIPMENT", "PROCESSING", "SHIPPED", "DELIVERED"
    private Date shippingStatusUpdateDate;

    public BankSlip() {
        this.uploadDate = new Date();
        this.status = "PENDING";
        this.shippingStatus = "PENDING_SHIPMENT";
    }

    public BankSlip(String fileName, String fileType, byte[] fileData, String orderId, String userEmail) {
        this();
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileData = fileData;
        this.orderId = orderId;
        this.userEmail = userEmail;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
        if (rejectionReason != null) {
            this.rejectionDate = new Date();
        }
    }

    public Date getRejectionDate() {
        return rejectionDate;
    }

    public void setRejectionDate(Date rejectionDate) {
        this.rejectionDate = rejectionDate;
    }

    public Date getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(Date verificationDate) {
        this.verificationDate = verificationDate;
    }

    public String getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(String shippingStatus) {
        this.shippingStatus = shippingStatus;
        this.shippingStatusUpdateDate = new Date();
    }

    public Date getShippingStatusUpdateDate() {
        return shippingStatusUpdateDate;
    }

    public void setShippingStatusUpdateDate(Date shippingStatusUpdateDate) {
        this.shippingStatusUpdateDate = shippingStatusUpdateDate;
    }

    // Helper methods
    public boolean isPending() {
        return "PENDING".equals(status);
    }

    public boolean isVerified() {
        return "VERIFIED".equals(status);
    }

    public boolean isRejected() {
        return "REJECTED".equals(status);
    }

    public boolean isReadyForShipping() {
        return isVerified() && "PENDING_SHIPMENT".equals(shippingStatus);
    }

    public boolean isShipped() {
        return "SHIPPED".equals(shippingStatus);
    }

    public boolean isDelivered() {
        return "DELIVERED".equals(shippingStatus);
    }
}