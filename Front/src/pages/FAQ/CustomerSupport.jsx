import React, { useState, useEffect } from "react";
import "../../styles/FAQ/CustomerSupport.css";
import axios from "axios";

function CustomerSupport() {
  const [categories, setCategories] = useState([]); 
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => {
        console.log(response.data); 
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const toggleItem = (categoryId, itemIndex) => {
    setExpandedItems((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === itemIndex ? null : itemIndex,
    }));
  };

  return (
    <div className="customer-support">
      <h1 className="customer-support-title">Welcome To Help Center</h1>
      <h2 className="customer-support-subtitle">Explore Help Articles</h2>
      <div className="customer-support-grid">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="customer-support-card">
              <h3 className="customer-support-card-title">
                
                {category.title}
              </h3>
              <ul className="customer-support-card-list">
                {category.items?.map((item, idx) => (
                  <li
                    key={idx}
                    className={`customer-support-card-item ${
                      expandedItems[category.id] === idx ? "expanded" : ""
                    }`}
                    onClick={() => toggleItem(category.id, idx)}
                  >
                    {item}
                    <div
                      className={`customer-support-item-description ${
                        expandedItems[category.id] === idx ? "visible" : ""
                      }`}
                    >
                      <p>Detailed Answer for "{item}" is displayed here.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Loading categories...</p> 
        )}
      </div>
    </div>
  );
}

export default CustomerSupport;
