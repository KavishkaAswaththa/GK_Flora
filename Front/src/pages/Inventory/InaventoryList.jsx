import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/Inventory/InventoryList.module.css";

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  // Sorting
  const [sortOption, setSortOption] = useState("");

  // Show/Hide filters
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/inventory/search/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = items;

    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (maxPrice !== "") {
      filtered = filtered.filter((item) => item.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (sortOption) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredItems([...filtered]);
  }, [search, category, maxPrice, sortOption, items]);

  if (loading) {
    return <p>Loading items...</p>;
  }

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  return (
    <div className={styles["inventory-list"]}>
      <h1 className={styles["inventory-list__title"]}>All Bouquets</h1>

      {/* Toggle Filter Button */}
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className={styles["inventory-list__toggle-button"]}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Filter & Sort Bar */}
      {showFilters && (
        <div className={styles["inventory-list__filters"]}>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles["inventory-list__filter-input"]}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles["inventory-list__filter-select"]}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles["inventory-list__filter-input"]}
          />
        </div>
      )}

      <div className={styles["inventory-list__sort"]}>
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles["inventory-list__filter-select"]}
        >
          <option value="">Default</option>
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="price-asc">Price (Low–High)</option>
          <option value="price-desc">Price (High–Low)</option>
        </select>
      </div>

      {/* Items Grid */}
      <div className={styles["inventory-list__grid"]}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Link
              to={`/inventory/${item.id}`}
              key={item.id}
              className={styles["inventory-list__card-link"]}
            >
              <div className={styles["inventory-list__card"]}>
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className={styles["inventory-list__image"]}
                />
                <div className={styles["inventory-list__content"]}>
                  <h2 className={styles["inventory-list__name"]}>{item.name}</h2>
                  <p className={styles["inventory-list__price"]}>
                    <strong>Price:</strong> LKR {item.price}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No items match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
