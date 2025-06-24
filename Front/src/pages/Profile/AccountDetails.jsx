 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react'; // Importing camera icon from Lucide React
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Profile/AccountDetails.css';

const AccountDetails = () => {

  const [points, setPoints] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState("");
  const [error, setError] = useState(null);

  const getLevel = (points) => {
    if (points <= 100) return "Bronze";
    if (points <= 500) return "Silver";
    if (points <= 1000) return "Gold";
    return "Platinum";
  }
  
  


  // Define admin emails - these users will have access to admin features
  const ADMIN_EMAILS = [
    'dinithi0425@gmail.com',
    'kavindiyapa1999@gmail.com',
    'gamindumpasan1997@gmail.com'
  ];
  
  // Navigation hook from react-router
  const navigate = useNavigate();
  
  // State for user data with initial empty values
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    birthday: '',
    profileImage: null, // Will store the profile image file
    isAdmin: false, // Flag to check if user is admin
    address: { // Nested address object
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  // Loading state for API calls
  const [loading, setLoading] = useState(true);
  // Editing mode state
  const [isEditing, setIsEditing] = useState(false);
  // Address view state (show/hide address form)
  const [addressView, setAddressView] = useState(false);
  // Preview URL for profile image
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Effect hook that runs when component mounts or navigate changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
      return;
    }
    fetchUserData(); // Fetch user data if token exists
  }, [navigate]);

  // Function to fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // API call to get user data
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        
      });

      console.log(token);


      // Process response data into our state format
      const userData = {
        ...response.data,
        firstName: response.data.name?.split(' ')[0] || '', // Split name into first/last
        lastName: response.data.name?.split(' ').slice(1).join(' ') || '',
        profileImage: response.data.profileImage || null,
        isAdmin: ADMIN_EMAILS.includes(response.data.email), // Check admin status
        address: response.data.address || { // Default empty address if none exists
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };
      
      // Update state with processed data
      setUser(userData);
      if (userData.profileImage) {
        setProfileImagePreview(userData.profileImage); // Set image preview if exists
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data. Please try again.');
      setLoading(false);
      if (error.response?.status === 401) { // Unauthorized - token invalid
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Handler for profile image change
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update user state with the file
      setUser({...user, profileImage: file});
    }
  };

// Add this function to your AccountDetails component's handleSubmit method
// Replace the existing success handling in your handleSubmit function with this:

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Prepare the user data payload
    const userPayload = {
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      mobileNo: user.mobileNo,
      birthday: user.birthday,
      avatarType: user.avatarType,
      address: {
        streetAddress: user.address.streetAddress || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || ''
      }
    };

    // Create FormData for multipart request (needed for file upload)
    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(userPayload)], { type: "application/json" }));

    // Add profile image if it exists and is a File object
    if (user.profileImage && user.profileImage instanceof File) {
      formData.append("profileImage", user.profileImage);
    }

    // API call to update user data
    const response = await axios.put('http://localhost:8080/api/users/profile', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    // Process the updated user data
    const updatedUser = {
      ...response.data,
      firstName: response.data.name?.split(' ')[0] || '',
      lastName: response.data.name?.split(' ').slice(1).join(' ') || '',
      isAdmin: ADMIN_EMAILS.includes(response.data.email || user.email),
      address: response.data.address || user.address
    };

    // Update state with new data
    setUser(updatedUser);
    setIsEditing(false); // Exit edit mode
    setAddressView(false); // Hide address form
    
    // ✅ IMPORTANT: Dispatch custom event to notify navbar of profile update
    const profileUpdateEvent = new CustomEvent('profileUpdated', {
      detail: {
        profileImage: response.data.profileImage,
        name: response.data.name
      }
    });
    window.dispatchEvent(profileUpdateEvent);
    
    toast.success('Account details updated successfully!');
  } catch (error) {
    console.error('Error updating user data:', error);
    toast.error(error.response?.data?.message || 'Failed to update account details. Please try again.');
  }
};

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/'); // Navigate to home
    toast.info('You have been signed out');
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="account-details-loading">
        <div className="account-details-spinner"></div>
      </div>
    );
  }
  const fetchUserloaylty = async () => {
    try {
      const email = user.email
      if (!email) throw new Error("No email found in localStorage");

      const response = await fetch(`http://localhost:8080/api/customers/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
        
      });
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setPoints(data.points);
      setLevel(getLevel(data.points));

    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    }
  };

  fetchUserloaylty();
  console.log(localStorage.getItem('token'));

  if (error) return <p>Error: {error}</p>;
  if (points === null) return <p>Loading...</p>;

  // Main component render
  return (
    <div className="account-details-page">
      {/* Sidebar navigation */}
      <div className="account-details-sidebar">
        <div className="sidebar-spacer"></div>
        <nav>
          <ul>
            <li className="sidebar-item active">Dashboard</li>
            <li className="sidebar-item" onClick={() => navigate('/order-history')}>Order History</li>
            <li className="sidebar-item" onClick={() => navigate('/loyalty')}>Loyalty Membership</li>
            {/* Admin-only navigation items */}
            {user.isAdmin && (
              <li className="sidebar-item" onClick={() => navigate('/admin')}>Admin Dashboard</li>
            )}
            {user.isAdmin && (
              <li className="sidebar-item" onClick={() => navigate('/userlist')}>User List</li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="account-details-main">
        <div className="account-details-card">
          {/* Profile header section */}
          <div className="account-details-header">
            <div className="profile-header-container">
              <div className="profile-image-container">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="Profile" 
                    className="profile-image" 
                  />
                ) : (
                  <div className="profile-image-placeholder">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                )}
                
                {/* Profile image upload button (visible in edit mode) */}
                {isEditing && (
                  <div className="profile-image-upload">
                    <label htmlFor="profile-image-input" className="profile-image-upload-label">
                      <Camera size={20} />
                      <span className="sr-only">Upload Photo</span>
                    </label>
                    <input 
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="profile-image-input"
                    />
                  </div>
                )}
              </div>
              <div className="profile-name-container">
                <h1>{user.firstName} {user.lastName}</h1>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="account-details">
      <h3>Your Loyalty Points: {points}</h3>
      <div className={`badge ${level.toLowerCase()}`} onClick={() => setShowModal(true)}>
        {level} Member
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Membership Tiers</h4>
            <ul>
              <li>🟫 Bronze: 0–100 pts</li>
              <li>🥈 Silver: 101–500 pts</li>
              <li>🥇 Gold: 501–1000 pts</li>
              <li>💎 Platinum: 1001+ pts</li>
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
            <button 
              className="sign-out-button"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          {/* Account details title section */}
          <div className="account-details-title-section">
            <div className="title-container">
              <h2>Account Details</h2>
              <p className="account-details-subtitle">Here you can manage your personal details</p>
            </div>
            {/* Edit button (visible when not in edit mode) */}
            {!isEditing && (
              <button 
                className="edit-button-compact"
                onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {/* Main form */}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* First Name field */}
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={user.firstName}
                  onChange={(e) => setUser({...user, firstName: e.target.value})}
                  readOnly={!isEditing}
                />
              </div>
              
              {/* Last Name field */}
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={user.lastName}
                  onChange={(e) => setUser({...user, lastName: e.target.value})}
                  readOnly={!isEditing}
                />
              </div>
              
              {/* Email field (read-only) */}
              <div className="form-field full-width">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  value={user.email}
                  readOnly
                />
                <p className="input-hint">Email cannot be changed</p>
              </div>
              
              {/* Mobile Number field */}
              <div className="form-field full-width">
                <label htmlFor="mobileNo">Mobile No (with Country Code +xxxxxxxx)</label>
                <input
                  id="mobileNo"
                  name="mobileNo"
                  value={user.mobileNo}
                  onChange={(e) => setUser({...user, mobileNo: e.target.value})}
                  placeholder="Enter your Mobile No"
                  readOnly={!isEditing}
                />
              </div>
              
              {/* Birthday field */}
              <div className="form-field full-width">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={user.birthday}
                  onChange={(e) => setUser({...user, birthday: e.target.value})}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            {/* Address section */}
            <div className="address-section">
              <div className="address-header">
                <h4>Saved Address</h4>
                {/* Address edit toggle button (visible in edit mode) */}
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={() => setAddressView(!addressView)}
                  >
                    {user.address.streetAddress ? 
                      (addressView ? 'Hide Address' : 'Edit Address') : 
                      'Add Address'}
                  </button>
                )}
              </div>

              {/* Display address or address form based on state */}
              {user.address.streetAddress && !addressView ? (
                <div className="address-display">
                  <p>{user.address.streetAddress}</p>
                  <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                  <p>{user.address.country}</p>
                </div>
              ) : (addressView || !user.address.streetAddress) && isEditing && (
                <div className="address-form">
                  {/* Street Address field */}
                  <div className="form-field full-width">
                    <label htmlFor="streetAddress">Street Address</label>
                    <input
                      id="streetAddress"
                      name="streetAddress"
                      value={user.address.streetAddress}
                      onChange={(e) => setUser({
                        ...user, 
                        address: {...user.address, streetAddress: e.target.value}
                      })}
                    />
                  </div>
                  
                  {/* City field */}
                  <div className="form-field">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      value={user.address.city}
                      onChange={(e) => setUser({
                        ...user, 
                        address: {...user.address, city: e.target.value}
                      })}
                    />
                  </div>
                  
                  {/* State field */}
                  <div className="form-field">
                    <label htmlFor="state">State/Province</label>
                    <input
                      id="state"
                      name="state"
                      value={user.address.state}
                      onChange={(e) => setUser({
                        ...user, 
                        address: {...user.address, state: e.target.value}
                      })}
                    />
                  </div>
                  
                  {/* ZIP Code field */}
                  <div className="form-field">
                    <label htmlFor="zipCode">ZIP/Postal Code</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      value={user.address.zipCode}
                      onChange={(e) => setUser({
                        ...user, 
                        address: {...user.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                  
                  {/* Country field */}
                  <div className="form-field">
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      name="country"
                      value={user.address.country}
                      onChange={(e) => setUser({
                        ...user, 
                        address: {...user.address, country: e.target.value}
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form action buttons (visible in edit mode) */}
            {isEditing && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setAddressView(false);
                    fetchUserData(); // Reset to original data
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;