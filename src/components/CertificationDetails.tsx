import styles from './CertificationDetails.module.css';

export default function CertificationDetails() {
  return (
    <section id="certification-details" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Certification Details</h2>
          <p className={styles.subtitle}>
            Everything You Need To Know About The AI Ready Certification
          </p>
        </div>

        <div className={styles.grid}>
          {/* Card 1 - Certification Fee */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} ${styles.gradientText}`}>₹15000</h3>
            <h4 className={styles.cardSubtitle}>Certification Fee</h4>
            <p className={styles.cardDescription}>
              One Time Payment Includes Certificate, Exam And A Digital Badge
            </p>
          </div>

          {/* Card 2 - Certification Validity */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} ${styles.gradientText}`}>3 Years</h3>
            <h4 className={styles.cardSubtitle}>Certification Validity</h4>
            <p className={styles.cardDescription}>
              One Time Payment Includes Certificate, Exam And A Digital Badge
            </p>
          </div>

          {/* Card 3 - Exam Duration */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} ${styles.gradientText}`}>2 Hours</h3>
            <h4 className={styles.cardSubtitle}>Exam Duration</h4>
            <p className={styles.cardDescription}>
              One Time Payment Includes Certificate, Exam And A Digital Badge
            </p>
          </div>

          {/* Card 4 - Online Access */}
          <div className={styles.card}>
            <h3 className={`${styles.cardTitle} ${styles.gradientText}`}>24/7</h3>
            <h4 className={styles.cardSubtitle}>Online Access</h4>
            <p className={styles.cardDescription}>
              One Time Payment Includes Certificate, Exam And A Digital Badge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

