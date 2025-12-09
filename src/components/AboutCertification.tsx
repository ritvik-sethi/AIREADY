import {
  Award,
  Target,
  CheckCircle,
} from 'lucide-react';
import styles from './AboutCertification.module.css';

export default function AboutCertification() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            About the <span className={styles.gradientText}>ET AI Ready</span> Certification
          </h2>
          <p className={styles.description}>
            A globally recognized credential backed by The Economic Times, designed to validate your AI expertise and prepare you for leadership in the AI-driven future.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Certification Highlights */}
          <div className={styles.highlightsCard}>
            <h4 className={styles.cardTitle}>
              Certification Highlights
            </h4>
            <div className={styles.highlightsList}>
              <div className={styles.highlightItem}>
                <div className={`${styles.iconWrapper} ${styles.purpleBg}`}>
                  <CheckCircle className={`${styles.highlightIcon} ${styles.purpleIcon}`} />
                </div>
                <div>
                  <h5 className={styles.highlightTitle}>Program Type</h5>
                  <p className={styles.highlightText}>Professional AI certification program with comprehensive curriculum</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={`${styles.iconWrapper} ${styles.blueBg}`}>
                  <CheckCircle className={`${styles.highlightIcon} ${styles.blueIcon}`} />
                </div>
                <div>
                  <h5 className={styles.highlightTitle}>Learning Approach</h5>
                  <p className={styles.highlightText}>Self-paced online learning with flexible study schedule</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={`${styles.iconWrapper} ${styles.greenBg}`}>
                  <CheckCircle className={`${styles.highlightIcon} ${styles.greenIcon}`} />
                </div>
                <div>
                  <h5 className={styles.highlightTitle}>Certificate Validity</h5>
                  <p className={styles.highlightText}>3 years from certification date with renewal options</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={`${styles.iconWrapper} ${styles.pinkBg}`}>
                  <CheckCircle className={`${styles.highlightIcon} ${styles.pinkIcon}`} />
                </div>
                <div>
                  <h5 className={styles.highlightTitle}>Prerequisites</h5>
                  <p className={styles.highlightText}>High school diploma (10+2) - No prior AI experience required</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <div className={`${styles.iconWrapper} ${styles.orangeBg}`}>
                  <CheckCircle className={`${styles.highlightIcon} ${styles.orangeIcon}`} />
                </div>
                <div>
                  <h5 className={styles.highlightTitle}>Backed By</h5>
                  <p className={styles.highlightText}>The Economic Times - India's leading business publication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className={styles.verticalDivider}></div>

          {/* What You'll Learn */}
          <div className={styles.learnCard}>
            <h4 className={styles.cardTitle}>
              What You'll Master
            </h4>
            <ul className={styles.learnList}>
              <li className={styles.learnItem}>
                <CheckCircle className={`${styles.checkIcon} ${styles.purpleCheckIcon}`} />
                <span>AI fundamentals, machine learning & generative AI</span>
              </li>
              <li className={styles.learnItem}>
                <CheckCircle className={`${styles.checkIcon} ${styles.purpleCheckIcon}`} />
                <span>AI ethics, governance & responsible implementation</span>
              </li>
              <li className={styles.learnItem}>
                <CheckCircle className={`${styles.checkIcon} ${styles.purpleCheckIcon}`} />
                <span>Practical AI tools & business applications</span>
              </li>
              <li className={styles.learnItem}>
                <CheckCircle className={`${styles.checkIcon} ${styles.purpleCheckIcon}`} />
                <span>Strategic AI implementation in organizations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

