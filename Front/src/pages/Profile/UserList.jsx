import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/Profile/UserList.css';
import { toast } from 'react-toastify';

const UserList = () => {
  // State to store list of users
  const [users, setUsers] = useState([]);

  // Function to fetch all users from the backend
  const fetchUsers = async () => {
    try {
      // Sending GET request to retrieve all users
      const response = await axios.get("http://localhost:8080/api/users/all");
      setUsers(response.data); // Update state with fetched users
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users"); // Show error toast
    }
  };

  // Function to delete a user by ID
  const deleteUser = async (userId) => {
    try {
      // Sending DELETE request to remove user by ID
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      // Remove the deleted user from the local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully"); // Show success toast
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user"); // Show error toast
    }
  };

  // useEffect hook to fetch users when the component is mounted
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">User List</h2>

      {/* Display a message if no users are found */}
      {users.length === 0 ? (
        <p className="user-list-empty">No users found.</p>
      ) : (
        // Render list of users
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-list-item">
              {/* Display user's name and email */}
              <span>{user.name} ({user.email})</span>
              {/* Delete button to remove the user */}
              <button
                onClick={() => deleteUser(user.id)}
                className="user-list-delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
