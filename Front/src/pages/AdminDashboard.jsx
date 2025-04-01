import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/search/all')
      .then(response => {
        setCampaigns(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="campaign-container">
      <h2 className="campaign-title">Campaign Management</h2>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Bloom Contains</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                {campaign.image ? (
                  <img src={`data:image/jpeg;base64,${campaign.image}`} alt="Campaign" className="campaign-image" />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{campaign.id}</td>
              <td>{campaign.name}</td>
              <td>{campaign.category}</td>
              <td>${campaign.price}</td>
              <td>{campaign.qty}</td>
              <td>{campaign.bloomContains}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignTable;
