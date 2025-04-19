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
    private Date verificationDate;

    public BankSlip() {
        this.uploadDate = new Date();
        this.status = "PENDING";
    }

    public BankSlip(String fileName, String fileType, byte[] fileData, String orderId, String userEmail) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileData = fileData;
        this.orderId = orderId;
        this.userEmail = userEmail;
        this.uploadDate = new Date();
        this.status = "PENDING";
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
    }

    public Date getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(Date verificationDate) {
        this.verificationDate = verificationDate;
    }

    public void setRejectReason(String rejectReason) {
    }
}