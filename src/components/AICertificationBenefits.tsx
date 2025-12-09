import {
  GraduationCap,
  Shield,
  Globe,
  FileCheck,
  TrendingUp,
  Zap
} from 'lucide-react';
import styles from './AICertificationBenefits.module.css';

export default function AICertificationBenefits() {
  const partnerImageIds = [
    '125610072',
    '125610071',
    '125610070',
    '125610066',
    '125610063',
    '125610059',
    '125610058',
    "125610111",
    "125610131",
  
  ];

  return (
    <section id="benefits" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.gradientText}>AI Certification</span> Benefits
          </h2>
          <p className={styles.description}>
            Unlock A World Of Opportunities With Ai Ready Certification
          </p>
        </div>

        <div className={styles.grid}>
          {/* Career Advancement */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <GraduationCap className={styles.icon} style={{
                stroke: 'url(#gradient1)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Career Advancement</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>

          {/* Credibility And Trust */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <Shield className={styles.icon} style={{
                stroke: 'url(#gradient2)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Credibility And Trust</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>

          {/* Global Network */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <Globe className={styles.icon} style={{
                stroke: 'url(#gradient3)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Global Network</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>

          {/* Digital Badges */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <FileCheck className={styles.icon} style={{
                stroke: 'url(#gradient4)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Digital Badges</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>

          {/* Skill Validation */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <TrendingUp className={styles.icon} style={{
                stroke: 'url(#gradient5)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Skill Validation</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>

          {/* Future Proof Career */}
          <div className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <Zap className={styles.icon} style={{
                stroke: 'url(#gradient6)',
                strokeWidth: 1.5
              }} />
            </div>
            <h3 className={styles.benefitTitle}>Future Proof Career</h3>
            <p className={styles.benefitText}>
              Demonstrate Your AI Expertise To Employers And Unlock Higher Paying...
            </p>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className={styles.trustedSection}>
          <h3 className={styles.trustedTitle}>
            Trusted By Professionals And Students Across 280+ Companies And Universities Worldwide
          </h3>
          <div className={styles.carouselWrapper}>
            <div className={styles.carousel}>
              {partnerImageIds.map((imageId, index) => (
                <div key={index} className={styles.carouselItem}>
                  <img
                    src={`https://economictimes.indiatimes.com/photo/${imageId}.cms`}
                    alt={`Partner ${index + 1}`}
                    className={styles.carouselImage}
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {partnerImageIds.map((imageId, index) => (
                <div key={`duplicate-${index}`} className={styles.carouselItem}>
                  <img
                    src={`https://economictimes.indiatimes.com/photo/${imageId}.cms`}
                    alt={`Partner ${index + 1}`}
                    className={styles.carouselImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Gradients for icons */}
        <svg width="0" height="0" className={styles.svgGradients}>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}

