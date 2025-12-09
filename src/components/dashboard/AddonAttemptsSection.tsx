import { ShoppingCart, CheckCircle } from 'lucide-react';
import styles from './AddonAttemptsSection.module.css';

interface Track {
  price: number;
  addonAttemptsPrice: number;
}

interface AddonAttemptsSectionProps {
  enrolledTrack: Track | undefined;
  onPurchase: () => void;
}

export default function AddonAttemptsSection({ enrolledTrack, onPurchase }: AddonAttemptsSectionProps) {
  if (!enrolledTrack) return null;

  return (
    <div className={styles.section}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <ShoppingCart className={styles.icon} />
          <div className={styles.textSection}>
            <h3 className={styles.title}>Need More Attempts?</h3>
            <p className={styles.description}>
              You've used all your regular exam attempts. Purchase addon attempts at 50% discount to continue your certification journey.
            </p>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h4 className={styles.infoTitle}>What you get:</h4>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <CheckCircle className={styles.checkIcon} />
                    <span>2 additional exam attempts</span>
                  </li>
                  <li className={styles.infoItem}>
                    <CheckCircle className={styles.checkIcon} />
                    <span>50% discount (₹{enrolledTrack.addonAttemptsPrice} only)</span>
                  </li>
                  <li className={styles.infoItem}>
                    <CheckCircle className={styles.checkIcon} />
                    <span>Same certification validity</span>
                  </li>
                </ul>
              </div>
              <div className={styles.priceCard}>
                <p className={styles.priceLabel}>Regular Price:</p>
                <p className={styles.regularPrice}>₹{enrolledTrack.price}</p>
                <p className={styles.discountPrice}>₹{enrolledTrack.addonAttemptsPrice}</p>
                <p className={styles.discountText}>Save 50%!</p>
              </div>
            </div>
            <button onClick={onPurchase} className={styles.purchaseButton}>
              <ShoppingCart className={styles.buttonIcon} />
              <span>Purchase Addon Attempts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

