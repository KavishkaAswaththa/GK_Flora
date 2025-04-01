import React from 'react';
import '../styles/AdminDashboard.css';

const campaigns = [
  { image: 'https://via.placeholder.com/40', name: '2025 First', delivery: 'Off', bidStrategy: 'Using ad set bid', budget: 'Using ad set budget', attribution: '7-day click', result: 'Messaging conversation', reach: '', impression: '' },
  { image: 'https://via.placeholder.com/40', name: 'New Engagement campaign', delivery: 'Off', bidStrategy: 'Using ad set bid', budget: 'Using ad set budget', attribution: '7-day click', result: 'Messaging conversation', reach: '', impression: '' },
  { image: 'https://via.placeholder.com/40', name: 'OL Master 1', delivery: 'Off', bidStrategy: 'Highest volume', budget: '$2.00 Daily', attribution: '7-day click', result: 'Link click', reach: '', impression: '' },
  { image: 'https://via.placeholder.com/40', name: 'E-Siphala – Page Likes', delivery: 'Off', bidStrategy: 'Highest volume', budget: '$1.00 Daily', attribution: '7-day click', result: 'Follow or like', reach: '', impression: '' },
  { image: 'https://via.placeholder.com/40', name: 'New Page Likes campaign', delivery: 'Off', bidStrategy: 'Using ad set bid', budget: 'Using ad set budget', attribution: '7-day click', result: 'Follow or like', reach: '', impression: '' }
];

function CampaignTable() {
  return (
    <div className="campaign-container">
      <h2 className="campaign-title">Campaign Management</h2>
      <table className="campaign-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>QTY</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Blank</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td><img src={campaign.image} alt="Campaign" className="campaign-image" /></td>
              <td>{campaign.name}</td>
              <td>{campaign.delivery}</td>
              <td>{campaign.bidStrategy}</td>
              <td>{campaign.budget}</td>
              <td>{campaign.attribution}</td>
              <td>{campaign.result}</td>
              <td>{campaign.reach}</td>
              <td>{campaign.impression}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignTable;