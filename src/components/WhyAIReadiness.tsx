import styles from './WhyAIReadiness.module.css';

export default function WhyAIReadiness() {
  return (
    <section id="why-ai" className={styles.section}>
      {/* Gradient background at bottom */}

      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Why <span className={styles.gradientText}>AI Readiness</span> Matters?
          </h2>
          <p className={styles.description}>
            In Today's Rapidly Evolving Technological Landscape, AI Competency Is No Longer Optional - It's A Necessity!
          </p>
        </div>

        <div className={styles.grid}>
          {/* Left side - Three sections */}
          <div className={styles.leftColumn}>
            {/* Section 1 - Unprecedented Market Growth */}
            <div className={styles.sectionItem}>
              <div className={styles.label}>IT'S NEVER TOO LATE</div>
              <h3 className={styles.sectionTitle}>Unprecedented Market Growth</h3>
              <p className={styles.sectionText}>
                The global AI market is projected to reach $1.8 trillion by 2030. Organisations need verified AI ready professionals to capitalise on this growth.
              </p>
            </div>

            {/* Section 2 - Global Recognition */}
            <div className={styles.sectionItem}>
              <div className={styles.label}>LEADING BRANDS PARTNER WITH US</div>
              <h3 className={styles.sectionTitle}>Global Recognition</h3>
              <p className={styles.sectionText}>
                Our Certification is recognised worldwide, opening doors to international opportunities and collaboration.
              </p>
            </div>

            {/* Section 3 - Competitive Advantage */}
            <div className={styles.sectionItem}>
              <div className={styles.label}>STATE OF THE ART</div>
              <h3 className={styles.sectionTitle}>Competitive Advantage</h3>
              <p className={styles.sectionText}>
                Stand out in the job market and demonstrate your institution's commitment to cutting edge education and innovation.
              </p>
            </div>
          </div>

          {/* Right side - Statistics and Gap Banner */}
          <div className={styles.rightColumn}>
            {/* Stat 1 - 87% */}
            <div className={styles.statItem}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610100.cms"
                alt="87% Organisations Seeking Modern AI Skills"
                className={styles.statBarImage}
              />
              <p className={styles.statLabel}>Organisations Seeking Modern AI Skills</p>
            </div>

            {/* Stat 2 - 23% */}
            <div className={styles.statItem}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610096.cms"
                alt="23% Professionals With Verified AI Skills"
                className={styles.statBarImage}
              />
              <p className={styles.statLabel}>Professionals With Verified AI Skills</p>
            </div>

            {/* Arrow */}
            <div className={styles.arrowContainer}>
              <img
                src="https://economictimes.indiatimes.com/photo/125610128.cms"
                alt="Arrow pointing to AI Skills Gap"
                className={styles.arrowImage}
              />
            </div>

            {/* THE AI SKILLS GAP Banner */}
            <div className={styles.gapBanner}>
              <h3 className={styles.gapTitle}>THE AI SKILLS GAP!</h3>
              <p className={styles.gapText}>
                Bridge The Gap With AI Ready Certification And Position Yourself<br />Or Your Organisation At The Forefront Of AI Revolution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

