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
    private String  phone1;
    private String  phone2;
    private String address;
    private String senderEmail;
    private String city;
    private String senderName;
    private  String deliveryDate;
    private String deliveryTime;
    private String delivername;

    private String deliverphone;
    private String message;

    public Delivery( String _id,String name, String phone1,String phone2,String address, String city,String deliveryDate,String deliveryTime,String delivername,String deliverphone,String  senderName, String senderEmail,String message ){
        this._id = _id;
        this.name = name;
        this.phone1 =phone1;
        this.phone2 =phone2;
        this.address = address;
        this.city = city;
        this.senderName =  senderName;
        this.senderEmail = senderEmail;
        this.deliveryDate = deliveryDate;
        this.deliveryTime = deliveryTime;
        this.delivername = delivername;
        this.deliverphone = deliverphone;
        this.message = message;

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

    public String getPhone1() {

        return phone1;
    }

    public void setPhone1 (String phone1) {

        this.phone1 = phone1;
    }
    public String getPhone2() {

        return phone2;
    }

    public void setPhone2 (String phone2) {

        this.phone2 = phone2;
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

    public String getSenderName() {

        return senderName;
    }

    public void setSenderEmail(String senderEmail) {

        this.senderEmail = senderEmail;
    }
    public String getSenderEmail() {

        return senderEmail;
    }

    public void setSenderName(String senderName) {

        this.senderName = senderName;
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
    public String getMessage() {

        return message;
    }

    public void setDMessage(String message) {

        this.message = message;
    }


    @Override
    public String toString() {
        return "Delivery{ " +
                "_id='" + _id + '\'' +
                ",name = '" + name + '\'' +
                ",phone1 = '" + phone1 + '\'' +
                ",phone2 = '" + phone2 + '\'' +
                ",address = '" + address + '\'' +
                ",city = '" + city + '\'' +
                ",senderName = '" + senderName + '\'' +
                ",senderEmail = '" + senderEmail + '\'' +
                ",deliveryDate = '" + deliveryDate + '\'' +
                ",deliveryTime = '" + deliveryTime + '\'' +
                ",delivername = '" + delivername + '\'' +
                ",deliverphone = '" + deliverphone + '\'' +
                ",message = '" + message + '\'' +
                '}';
    }

    public void setId(String d001) {
    }

    public void setRecipientName(String johnSmith) {
    }

    public void setPhone(String number) {
    }

    public String getRecipientName() {
        return null;
    }
}

