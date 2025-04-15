import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import banner from "../images/banner.jpg";
import InventoryList from "./Inventory/InaventoryList";

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Banner Section */}
      <section className={styles.banner}>
        <img src={banner} alt="Banner" className={styles.bannerImage} />
        <div className={styles.bannerText}>
          <h1>Welcome to GKFlora 🌼</h1>
          <p>Where flowers bloom, so does happiness.</p>
          <Link to="/inventory" className={styles.bannerButton}>Shop Now</Link>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <h2>Why Choose GKFlora?</h2>
        <p>
          We bring you the freshest and most vibrant bouquets curated with love.
          Whether it's a birthday, anniversary, or just a kind gesture, we've got
          you covered with our beautiful collections.
        </p>
      </section>

      {/* Featured Bouquets Section */}
      <section className={styles.featured}>
        <h2>Featured Bouquets</h2>
        <InventoryList />
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2>Ready to Make Someone Smile?</h2>
        <Link to="/inventory" className={styles.ctaButton}>Explore All Bouquets</Link>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 GKFlora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
