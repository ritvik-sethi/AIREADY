import { useNavigate } from 'react-router-dom';
import { Linkedin, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Indian Name',
    role: 'Position',
    company: 'Company name',
    text: '"I am incredibly impressed with the outstanding service and user-friendly customer support provided by Remap"',
    image: '👨‍💼'
  },
  {
    name: 'Indian Name',
    role: 'Position',
    company: 'Company name',
    text: '"I am incredibly impressed with the outstanding service and user-friendly customer support provided by Remap"',
    image: '👩‍💼'
  },
  {
    name: 'Indian Name',
    role: 'Position',
    company: 'Company name',
    text: '"I am incredibly impressed with the outstanding service and user-friendly customer support provided by Remap"',
    image: '👨‍💻'
  },
  {
    name: 'Indian Name',
    role: 'Position',
    company: 'Company name',
    text: '"I am incredibly impressed with the outstanding service and user-friendly customer support provided by Remap"',
    image: '👩‍💻'
  }
];

export default function Testimonials() {
  const navigate = useNavigate();

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              What Our <span className={styles.gradientText}>Certified Professionals</span> Say
            </h2>
            <p className={styles.subtitle}>
              Hear From AI Leaders Who Transformed Their Careers With The ET AI Ready Program
            </p>
          </div>

          <div className={styles.grid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <p className={styles.testimonialText}>
                  {testimonial.text}
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>
                    {testimonial.image}
                  </div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorNameRow}>
                      <h4 className={styles.authorName}>{testimonial.name}</h4>
                      <Linkedin className={styles.linkedinIcon} />
                    </div>
                    <p className={styles.authorRole}>
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className={styles.navigation}>
            <button className={styles.navButton}>
              <ChevronDown className={styles.navIconLeft} />
            </button>
            <div className={styles.dots}>
              <div className={styles.dotActive}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <button className={styles.navButton}>
              <ChevronDown className={styles.navIconRight} />
            </button>
          </div>
        </div>
      </section>

      {/* Let's Get Certified Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            <span className={styles.ctaTitleBlack}>Let's </span>
            <span className={styles.gradientText}>Get Certified</span>
          </h2>
          
          <div className={styles.socialProof}>
            <div className={styles.profileAvatars}>
              <div className={styles.profileAvatar}>👩</div>
              <div className={styles.profileAvatar}>👨</div>
              <div className={styles.profileAvatar}>👩</div>
              <div className={styles.profileAvatar}>👩</div>
            </div>
            <p className={styles.registeredText}>2000+ Already Registered</p>
          </div>

          <p className={styles.ctaDescription}>
            Join Thousands Of Professionals And Organisations Who Are AI Ready
          </p>

          <button
            onClick={() => navigate('/register')}
            className={styles.ctaButton}
          >
            Start Your Journey
            <ChevronRight className={styles.ctaButtonIcon} />
          </button>
        </div>
      </section>
    </>
  );
}

