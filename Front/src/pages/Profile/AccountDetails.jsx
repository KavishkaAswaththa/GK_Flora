import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/Profile/AccountDetails.css';

const AccountDetails = () => {
  // Define admin emails
  const ADMIN_EMAILS = [
    'dinithi0425@gmail.com',
    'kavindiyapa1999@gmail.com',
    'gamindumpasan1997@gmail.com'
  ];
  
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    birthday: '',
    profileImage: null,
    isAdmin: false,
    address: {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [addressView, setAddressView] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = {
        ...response.data,
        firstName: response.data.name?.split(' ')[0] || '',
        lastName: response.data.name?.split(' ').slice(1).join(' ') || '',
        profileImage: response.data.profileImage || null,
        isAdmin: ADMIN_EMAILS.includes(response.data.email), // Check if email is in admin list
        address: response.data.address || {
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };
      
      setUser(userData);
      if (userData.profileImage) {
        setProfileImagePreview(userData.profileImage);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data. Please try again.');
      setLoading(false);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Update user state with file
      setUser({...user, profileImage: file});
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

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

    const formData = new FormData();
    formData.append("user", new Blob([JSON.stringify(userPayload)], { type: "application/json" }));

    if (user.profileImage && user.profileImage instanceof File) {
      formData.append("profileImage", user.profileImage);
    }

    const response = await axios.put('http://localhost:8080/api/users/profile', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const updatedUser = {
      ...response.data,
      firstName: response.data.name?.split(' ')[0] || '',
      lastName: response.data.name?.split(' ').slice(1).join(' ') || '',
      isAdmin: ADMIN_EMAILS.includes(response.data.email || user.email),
      address: response.data.address || user.address
    };

    setUser(updatedUser);
    setIsEditing(false);
    setAddressView(false);
    toast.success('Account details updated successfully!');
  } catch (error) {
    console.error('Error updating user data:', error);
    toast.error(error.response?.data?.message || 'Failed to update account details. Please try again.');
  }
};


  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
    toast.info('You have been signed out');
  };

  if (loading) {
    return (
      <div className="account-details-loading">
        <div className="account-details-spinner"></div>
      </div>
    );
  }

  return (
    <div className="account-details-page">
      
      <div className="account-details-sidebar">
        <div className="sidebar-spacer"></div>
        <nav>
          <ul>
            <li className="sidebar-item active">Dashboard</li>
            <li className="sidebar-item" onClick={() => navigate('/order-history')}>Order History</li>
            <li className="sidebar-item" onClick={() => navigate('/loyalty')}>Loyalty Membership</li>
            {user.isAdmin && (
              <li className="sidebar-item" onClick={() => navigate('/admindashboard')}>Admin Dashboard</li>
            )}
          </ul>
        </nav>
      </div>

      <div className="account-details-main">
        <div className="account-details-card">
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
            <button 
              className="sign-out-button"
              onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          <div className="account-details-title-section">
            <div className="title-container">
              <h2>Account Details</h2>
              <p className="account-details-subtitle">Here you can manage your personal details</p>
            </div>
            {!isEditing && (
              <button 
                className="edit-button-compact"
                onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">
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

            <div className="address-section">
              <div className="address-header">
                <h4>Saved Address</h4>
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

              {user.address.streetAddress && !addressView ? (
                <div className="address-display">
                  <p>{user.address.streetAddress}</p>
                  <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                  <p>{user.address.country}</p>
                </div>
              ) : (addressView || !user.address.streetAddress) && isEditing && (
                <div className="address-form">
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