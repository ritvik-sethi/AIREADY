import styles from './SimpleCertificationProcess.module.css';

export default function SimpleCertificationProcess() {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Simple Certification Process</h2>
          <p className={styles.subtitle}>Get Verified In Three Simple Steps</p>
        </div>

        <div className={styles.stepsContainer}>
          {/* Step 1 - Register */}
          <div className={styles.stepCard}>
            <div className={styles.cardContent}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610110.cms"
                alt="Register"
                className={styles.stepImage}
              />
              <h3 className={styles.stepTitle}>REGISTER</h3>
              <p className={styles.stepDescription}>
                Complete Your Registration Form And Select Your Certification Category
              </p>
            </div>
            <div className={styles.stepNumber}>1</div>
          </div>

          <div className={styles.arrow}>→</div>

          {/* Step 2 - Take Exam */}
          <div className={styles.stepCard}>
            <div className={styles.cardContent}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610107.cms"
                alt="Take the Exam"
                className={styles.stepImage}
              />
              <h3 className={styles.stepTitle}>TAKE THE EXAM</h3>
              <p className={styles.stepDescription}>
                Complete Your Ai Competency Exam Securely Through Tailview's Proctored Platform
              </p>
            </div>
            <div className={styles.stepNumber}>2</div>
          </div>

          <div className={styles.arrow}>→</div>

          {/* Step 3 - Get Certified */}
          <div className={styles.stepCard}>
            <div className={styles.cardContent}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610106.cms"
                alt="Get Certified"
                className={styles.stepImage}
              />
              <h3 className={styles.stepTitle}>GET CERTIFIED</h3>
              <p className={styles.stepDescription}>
                Receive Your Official Ai Ready Certificate Via Credly's Digital Credentialing Platform
              </p>
            </div>
            <div className={styles.stepNumber}>3</div>
          </div>
        </div>
      </div>
    </section>
  );
}

