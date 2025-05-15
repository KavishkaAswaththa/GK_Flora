import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";
import banner1 from "../images/banner.jpg";
import banner2 from "../images/banner2.png";
import InventoryList from "./Inventory/InaventoryList";

const banners = [banner1, banner2];

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000); // Change every 5 seconds
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
      className={`${styles.bannerImage} ${index === currentBanner ? styles.active : ""}`}
    />
  ))}

  <div className={styles.bannerText}>
    <h1>Welcome to GKFlora 🌼</h1>
    <p>Where flowers bloom, so does happiness.</p>
    <Link to="/inventory" className={styles.bannerButton}>Shop Now</Link>
  </div>

  {/* Manual Controls */}
  <div className={styles.controls}>
    <button
      className={styles.controlBtn}
      onClick={() => setCurrentBanner((currentBanner - 1 + banners.length) % banners.length)}
    >
      ‹
    </button>
    <button
      className={styles.controlBtn}
      onClick={() => setCurrentBanner((currentBanner + 1) % banners.length)}
    >
      ›
    </button>
  </div>

  {/* Dots */}
  <div className={styles.dots}>
    {banners.map((_, index) => (
      <div
        key={index}
        className={`${styles.dot} ${index === currentBanner ? styles.active : ""}`}
        onClick={() => setCurrentBanner(index)}
      />
    ))}
  </div>
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
          <Link to="/FlowerCustomization" className={styles.couponButton}>
            Create Your Own Bouquet
          </Link>
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

{/* Wishlist Coupon + Smart Wishlist Feature Section */}
<section className={styles.wishlistCoupon}>
  <div className={styles.wishlistCouponContent}>
    <h2>🌸 Special Spring Offer + Smart Wishlist</h2>
    <p>
      Use code <strong>SPRING25</strong> to get <strong>25% OFF</strong> your first order!
    </p>
    <p className={styles.wishlistNote}>
      💡 Can't find your favorite bouquet? Just add it to your <strong>Wishlist</strong> — 
      We'll <strong>automatically notify</strong> you when it's back in stock!
    </p>
    <Link to="/inventory" className={styles.wishlistCouponButton}>
      Explore Bouquets
    </Link>
  </div>
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
