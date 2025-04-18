import React from 'react';
import styles from '../../styles/loyalty-point/Loyalty-userlevels.module.css'; // ❌ Wrong for regular CSS
import crownImage from '../../images/silver-crown.jpg';

const SilverMembership = () => {
  return (
    <div className={styles.silverApp}>
      <main className={styles.silverMembershipContent}>
        <div className={styles.silverCongratulationsContainer}>
          <div className={styles.silverCongratulationsBanner}>
            <h1 className={styles.silverCongratulationsTitle}>CONGRATULATIONS!!!</h1>
            <img src={crownImage} alt="Silver Crown" className={styles.silverCrownImage} />
          </div>

          <div className={styles.silverMembershipInfo}>
            <h2 className={styles.silverWelcomeMessage}>Welcome to Silver Family</h2>
            <p className={styles.silverMembershipDescription}>
              You have earned 75 points and now you are a Silver Member. Join the family and enjoy your discounts!
            </p>

            <div className={styles.silverAcceptContainer}>
              <p className={styles.silverUpdateQuestion}>Do you want to update your membership?</p>
              <button className={styles.silverAcceptButton}>Accept</button>
            </div>

            <div className={styles.silverOptionsContainer}>
              <button className={styles.silverOptionButton}>New Ways to Collect Points</button>
              <button className={styles.silverOptionButton}>New Ways to Earn Rewards</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SilverMembership;
