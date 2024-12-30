package com.example.inventry.entity;
import lombok.Setter;
import org.springframework.data.annotation.Id;


import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Delivery {
    @Id

    private String _id;
    @Setter
    private String name;
    private String  phone;
    private String address;

    private String city;
    private  String deliveryDate;
    private String deliveryTime;
    private String delivername;

    private String deliverphone;

    public Delivery( String _id,String name, String phone,String address, String city,String deliveryDate,String deliveryTime,String delivername,String deliverphone){
        this._id = _id;
        this.name = name;
        this.phone =phone;
        this.address = address;
        this.city = city;
        this.deliveryDate = deliveryDate;
        this.deliveryTime = deliveryTime;
        this.delivername = delivername;
        this.deliverphone = deliverphone;

    }
    public  Delivery(){

    }
    public String get_id() {

        return _id;
    }

    public void set_id(String _id) {

        this._id = _id;
    }

    public String getName() {

        return name;
    }

    public void setName(String name) {

        this.name = name;
    }

    public String getPhone() {

        return phone;
    }

    public void setPhone (String phone) {

        this.phone = phone;
    }

    public String getAddress() {

        return address;
    }

    public void setAddress(String address) {

        this.address = address;
    }
    public String getCity() {

        return city;
    }

    public void setCity(String city) {

        this.city = city;
    }

    public String getDeliveryDate() {

        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {

        this.deliveryDate = deliveryDate;
    }
    public String getDeliveryTime() {

        return deliveryTime;
    }

    public void setDeliveryTime(String deliveryTime) {

        this.deliveryTime = deliveryTime;
    }
    public String getDelivername() {

        return delivername;
    }

    public void setDelivername(String delivername) {

        this.delivername = delivername;
    }
    public String getDeliverphone() {

        return deliverphone;
    }

    public void setDeliverphone(String deliverphone) {

        this.deliverphone = deliverphone;
    }


    @Override
    public String toString() {
        return "Delivery{ " +
                "_id='" + _id + '\'' +
                ",name = '" + name + '\'' +
                ",phone = '" + phone + '\'' +
                ",address = '" + address + '\'' +
                ",city = '" + city + '\'' +
                ",deliveryDate = '" + deliveryDate + '\'' +
                ",deliveryTime = '" + deliveryTime + '\'' +
                ",delivername = '" + delivername + '\'' +
                ",deliverphone = '" + deliverphone + '\'' +
                '}';
    }
}

