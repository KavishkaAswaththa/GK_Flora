import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/Profile/UserList.css';
import { toast } from 'react-toastify';

const UserList = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  // Delete user by ID
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">User List</h2>
      {users.length === 0 ? (
        <p className="user-list-empty">No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map(user => (
            <li key={user.id} className="user-list-item">
              <span>{user.name} ({user.email})</span>
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
