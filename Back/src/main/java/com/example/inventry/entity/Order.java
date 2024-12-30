package com.example.inventry.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection ="students")
public class Order {

    @Id
    private String _id;
    private String name;
    private String qty;
    private String price;
    private String tracking;


    public Order(String _id, String name, String qty, String price, String tracking) {
        this._id = _id;
        this.name = name;
        this.qty = qty;
        this.price = price;
        this.tracking = tracking;
    }


    public Order() {
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }

    public String getqty() {
        return qty;
    }

    public void setqty(String qty) {
        this.qty = qty;
    }

    public String getprice() {
        return price;
    }

    public void setprice(String price) {
        this.price = price;
    }

    public String gettracking() {
        return tracking;
    }

    public void settracking(String tracking) {
        this.tracking = tracking;
    }

    @Override
    public String toString() {
        return "Student{" +
                "_id='" + _id + '\'' +
                ", studentname='" + name + '\'' +
                ", studentemail='" + qty + '\'' +
                ", studentaddress='" + price + '\'' +
                ", mobile='" + tracking + '\'' +
                '}';
    }
}