import { Users, School, GraduationCap, Building2 } from 'lucide-react';
import styles from './WhoCanGetCertified.module.css';

export default function WhoCanGetCertified() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Who Can Get <span className={styles.gradientText}>AI Certified?</span>
          </h2>
          <p className={styles.description}>
            AI-Ready Certification Is Available For Individuals And Organisations Across Various Sectors
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <Users className={styles.icon} />
            <h3 className={`${styles.cardTitle} ${styles.bluePill}`}>Individuals</h3>
            <p className={styles.cardDescription}>
              Professionals Looking To Validate Their AI Skills And Advance Their Careers
            </p>
          </div>

          <div className={styles.card}>
            <School className={styles.icon} />
            <h3 className={`${styles.cardTitle} ${styles.greenPill}`}>Schools</h3>
            <p className={styles.cardDescription}>
              Education Institutions Establishing AI-Ready Curricula And Standards
            </p>
          </div>

          <div className={styles.card}>
            <GraduationCap className={styles.icon} />
            <h3 className={`${styles.cardTitle} ${styles.orangePill}`}>Universities</h3>
            <p className={styles.cardDescription}>
              Companies Validating Team Capabilities And Driving AI Transformation
            </p>
          </div>

          <div className={styles.card}>
            <Building2 className={styles.icon} />
            <h3 className={`${styles.cardTitle} ${styles.purplePill}`}>Companies</h3>
            <p className={styles.cardDescription}>
              Organisation Delivering AI Solutions Seeking Formal Recogniation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

