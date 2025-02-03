import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UserDetails.css";
import User from "../images/User.png";


function UserDetails() {
  const [customerId, setCustomerId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail); // Set email field
      loadCustomerDetails(storedEmail);
    } else {
      alert("User not logged in!");
      navigate("/login");
    }
  }, []);

  async function loadCustomerDetails(email) {
    try {
      const result = await axios.get(`http://localhost:8080/api/v1/details/get/${email}`);
      if (result.data) {
        const customer = result.data;
        setCustomerId(customer._id);
        setFirstName(customer.firstName);
        setLastName(customer.lastName);
        setDob(customer.dob);
        setGender(customer.gender);
        setEmail(customer.email);
        setContactNumber(customer.contactNumber);
        
        // Load profile picture if available
        if (customer.profilePicture) {
          setProfileImage(`data:image/png;base64,${customer.profilePicture}`);
        }
      }
    } catch (err) {
      console.error("Failed to load customer details.");
    }
  }

  async function uploadProfilePicture() {
    if (!selectedFile) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(`http://localhost:8080/api/v1/details/upload/${email}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile picture uploaded successfully!");
      loadCustomerDetails(email); // Refresh the user data
    } catch (err) {
      alert("Failed to upload profile picture.");
    }
  }
  

  async function saveCustomer(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/details/save",
        {
          firstName,
          lastName,
          dob,
          gender,
          email,
          contactNumber,
        }
      );
      alert("Profile saved successfully!");
      setCustomerId(response.data.customerId);
    } catch (err) {
      alert("Failed to save profile.");
      console.error(err);
    }
  }

  async function updateCustomer(event) {
    event.preventDefault();
    if (!customerId) {
      alert("Please save your details first.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/v1/details/update/${customerId}`,
        {
          firstName,
          lastName,
          dob,
          gender,
          email,
          contactNumber,
        }
      );
      alert("Profile updated successfully!");
      loadCustomerDetails(email);
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <div className="profile-container">
      <div className="sidebar">
        <img src={User} alt="User" className="profile-pic" />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button className="upload-btn" onClick={uploadProfilePicture}>Upload</button>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-content">
        <h2>Profile</h2>
        <div className="basic-info">
          <h3>Basic Info</h3>
          <form>
            <div className="form-row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" value={email} disabled />
              </div>
              <div className="input-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="button-group">
              {!customerId ? (
              <button onClick={saveCustomer} className="save-btn">
                Save
              </button>
              ) : (
              <button onClick={updateCustomer} className="update-btn">
                Update
              </button>
              )}
              </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
