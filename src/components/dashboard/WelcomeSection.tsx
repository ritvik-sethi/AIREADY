import styles from './WelcomeSection.module.css';

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className={styles.welcomeSection}>
      <h1 className={styles.title}>Welcome back, {userName}!</h1>
      <p className={styles.subtitle}>Continue your AI learning journey and achieve certification</p>
    </div>
  );
}

