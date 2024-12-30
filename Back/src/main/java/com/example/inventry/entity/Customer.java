package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer {

    @Id
    private String _id;
    private String customerfirstname;
    private String customerlastname;
    private String customeraddress;
    private String mobile;
    private String email;  // Email field
    private String password;  // Password field

    // Constructor with email and password
    public Customer(String _id, String customerfirstname, String customerlastname,
                    String customeraddress, String mobile, String email, String password) {
        this._id = _id;
        this.customerfirstname = customerfirstname;
        this.customerlastname = customerlastname;
        this.customeraddress = customeraddress;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
    }

    // Default constructor
    public Customer() {}

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getCustomerfirstname() {
        return customerfirstname;
    }

    public void setCustomerfirstname(String customerfirstname) {
        this.customerfirstname = customerfirstname;
    }

    public String getCustomerlastname() {
        return customerlastname;
    }

    public void setCustomerlastname(String customerlastname) {
        this.customerlastname = customerlastname;
    }

    public String getCustomeraddress() {
        return customeraddress;
    }

    public void setCustomeraddress(String customeraddress) {
        this.customeraddress = customeraddress;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "_id='" + _id + '\'' +
                ", customerfirstname='" + customerfirstname + '\'' +
                ", customerlastname='" + customerlastname + '\'' +
                ", customeraddress='" + customeraddress + '\'' +
                ", mobile='" + mobile + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
