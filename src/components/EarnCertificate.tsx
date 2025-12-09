import { CheckCircle } from 'lucide-react';
import styles from './EarnCertificate.module.css';

export default function EarnCertificate() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Earn Your <span className={styles.gradientText}>ET AI Ready Certification</span>
          </h2>
          <p className={styles.description}>
            Stand Out With An Official Certification From The Economic Times
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left Side - Certificate */}
          <div className={styles.certificateWrapper}>
            <div className={styles.certificateContainer}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610133.cms"
                alt="ET AI Ready Certificate"
                className={styles.certificateImage}
              />
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <CheckCircle className={styles.checkIcon} />
              <div>
                <h3 className={styles.benefitTitle}>Official ET Certification</h3>
                <p className={styles.benefitText}>
                  Receive An Official Certificate From The Economic Times, India's Leading Business Publication, Validating Your AI Readiness And Expertise.
                </p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <CheckCircle className={styles.checkIcon} />
              <div>
                <h3 className={styles.benefitTitle}>Secure And Proctored Assessment</h3>
                <p className={styles.benefitText}>
                  Take Your Certification Exam Through Talview's Secure, AI-Powered Proctoring Platform Ensuring Integrity And Credibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

