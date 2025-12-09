import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topBorder}></div>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <span className={styles.logoText1}>THE ECONOMIC</span>
            <span className={styles.logoText2}>TIMES</span>
            <div className={styles.logoDivider}></div>
            <span className={styles.logoAI}>AI</span>
          </div>
        </div>

        <p className={styles.description}>
          The definitive AI course for professionals looking to implement artificial intelligence in their work and organizations.
        </p>

        <div className={styles.contactButtons}>
          <a href="mailto:etaiready@economictimes.com" className={styles.contactButton}>
            etaiready@economictimes.com
          </a>
          <a href="tel:+919560500838" className={styles.contactButton}>
            +91 95605 00838
          </a>
        </div>
      </div>
    </footer>
  );
}

