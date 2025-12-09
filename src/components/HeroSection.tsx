import { GraduationCap, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

const HeroSection = ({ navigate }: HeroSectionProps) => {
  return (
    <section className={styles.heroSection}>
      {/* Grid pattern background */}
      <div className={styles.gridPatternContainer}>
        <div className={styles.gridPattern}></div>
      </div>

      {/* Purple glow effects */}
      <div className={styles.purpleGlow1}></div>
      <div className={styles.purpleGlow2}></div>

      <div className={styles.contentContainer}>
        <div className={styles.contentGrid}>
          <div className={styles.leftContent}>
            {/* Badge */}
            <div className={styles.badge}>
              <GraduationCap className={styles.badgeIcon} />
              <span className={styles.badgeText}>Certified For The Future</span>
            </div>

            {/* Heading */}
            <h1 className={styles.heading}>
              <span className={styles.headingLine}>
                Become <span className={styles.gradientText1}>ET AI Ready.</span>
              </span>
              <span className={styles.headingLine2}>
                Stay <span className={styles.gradientText2}>Future Ready!</span>
              </span>
            </h1>

            {/* Description with inline ET logo */}
            <p className={styles.description}>
              Get recognized by{' '}
              <img
                src="https://economictimes.indiatimes.com/photo/125608958.cms"
                alt="ET"
                className={styles.etLogo}
              />
              {' '}for your readiness to lead in the AI era.
            </p>
            {/* Trust indicators */}
            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <CheckCircle className={styles.checkIcon} />
                <span className={styles.trustText}>No AI Experience Required</span>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle className={styles.checkIcon} />
                <span className={styles.trustText}>ET Certified Badge</span>
              </div>
            </div>
            {/* CTA Button - White with blue text */}
            <div className={styles.ctaContainer}>
              <button
                onClick={() => navigate('/register')}
                className={styles.ctaButton}
              >
                <span>Start Your Journey</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              </button>
            </div>

          </div>

          {/* Hero Image */}
          <div className={styles.heroImageContainer}>
            <div className={styles.imageWrapper}>
              {/* Glow effect background */}

              {/* Hero image */}
              {/* <div className={styles.imageContent}>
                <img
                  src="/hero-ai-hand.png"
                  alt="AI Certification"
                  className={styles.heroImage}
                  onError={(e) => {
                    // Fallback to gradient illustration if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    // if (parent) {
                    //   parent.innerHTML = `
                    //     <div class="relative w-full h-full flex items-center justify-center">
                    //       <div class="relative">
                    //         <div class="absolute inset-0 w-64 h-64 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-60"></div>
                    //         <div class="relative">
                    //           <div class="relative w-96 h-80 flex items-end justify-center">
                    //             <div class="absolute bottom-0 w-80 h-48 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-t-full opacity-90"></div>
                    //             <div class="absolute top-8 left-1/2 transform -translate-x-1/2">
                    //               <div class="relative">
                    //                 <div class="absolute -left-20 top-1/2 w-32 h-0.5 bg-purple-500"></div>
                    //                 <div class="absolute -left-24 top-1/2 -translate-y-2 w-32 h-0.5 bg-purple-500"></div>
                    //                 <div class="absolute -left-24 top-1/2 translate-y-2 w-32 h-0.5 bg-purple-500"></div>
                    //                 <div class="relative w-32 h-32 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 rounded-2xl shadow-2xl transform rotate-3">
                    //                   <div class="absolute inset-2 flex flex-col items-center justify-center text-center">
                    //                     <div class="text-4xl font-black text-orange-800 tracking-tight">AI</div>
                    //                     <div class="text-[10px] font-bold text-red-700 uppercase tracking-wide mt-1">Certification</div>
                    //                   </div>
                    //                   <div class="absolute top-0 right-0 w-8 h-8 bg-white rounded-full opacity-40 blur-md"></div>
                    //                 </div>
                    //               </div>
                    //             </div>
                    //           </div>
                    //         </div>
                    //       </div>
                    //     </div>
                    //   `;
                    // }
                  }}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
