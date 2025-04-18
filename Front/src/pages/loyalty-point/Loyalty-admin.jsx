import React, { useEffect, useState } from "react";
import "../../styles/loyalty-point/loyalty-admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Simulating fetch from backend
  useEffect(() => {
    // You’ll replace this with an actual fetch from your backend
    const fetchUsers = async () => {
      // Sample dummy data (replace with backend response)
      const response = [
        {
          id: "u001",
          name: "Alice",
          email: "alice@example.com",
          points: 120,
          level: "Gold",
          lastPurchase: "Rose Deluxe Bouquet",
          purchaseDate: "2025-04-15",
        },
        {
          id: "u002",
          name: "Bob",
          email: "bob@example.com",
          points: 80,
          level: "Silver",
          lastPurchase: "Sunflower Charm",
          purchaseDate: "2025-04-13",
        },
      ];
      setUsers(response);
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <h2>Loyalty Points Admin Panel</h2>
      <input
        type="text"
        placeholder="Search by user email or ID"
        className="search-input"
      />

      <table className="user-points-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Points</th>
            <th>Level</th>
            <th>Last Purchase</th>
            <th>Purchase Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.points}</td>
              <td>{user.level}</td>
              <td>{user.lastPurchase}</td>
              <td>{user.purchaseDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
