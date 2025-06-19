import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import banner1 from "../images/banner.jpg";
import banner2 from "../images/banner2.png";
import banner3 from "../images/banner3.png";
import banner4 from "../images/banner4.png";


import InventoryList from "./Inventory/InaventoryList";
import CustomerSupport from "./FAQ/CustomerSupport"; // ✅ Import added

const banners = [banner1, banner2, banner3,banner4];

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.home}>
      {/* Banner Section */}
      <section className={styles.banner}>
        {banners.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className={`${styles.bannerImage} ${
              index === currentBanner ? styles.active : ""
            }`}
          />
        ))}

        <div className={styles.bannerText}>
          <h1>Welcome to GKFlora 🌼</h1>
          <p>Where flowers bloom, so does happiness.</p>
          <Link to="/inventory" className={styles.bannerButton}>
            Shop Now
          </Link>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.controlBtn}
            onClick={() =>
              setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)
            }
          >
            ‹
          </button>
          <button
            className={styles.controlBtn}
            onClick={() =>
              setCurrentBanner((currentBanner + 1) % banners.length)
            }
          >
            ›
          </button>
        </div>

        <div className={styles.dots}>
          {banners.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                index === currentBanner ? styles.active : ""
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>


      
      {/* Featured Bouquets */}
      <section className={styles.featured}>
        <h2>Featured Bouquets</h2>
        <InventoryList />
      </section>



      {/* Coupon Section */}
      <section className={styles.coupon}>
        <div className={styles.couponContent}>
          <h2>Welcome to Our New Feature!</h2>
          <p>
            You can now create your own flower bouquet just the way you like it.
            <br />
            <strong>Click below to experience the magic!</strong>
          </p>
          <Link to="/UserFlowerCustomization" className={styles.couponButton}>
            Create Your Own Bouquet
          </Link>
        </div>
      </section>

   



      {/* ✅ Customer Support Promo Section */}
      <section className={styles.supportPromo}>
   
        <div className={styles.supportPromoBox}>
          <CustomerSupport />
        </div>
      </section>


      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2025 GKFlora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
