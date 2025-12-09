import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import styles from './StatsGrid.module.css';

interface StatsGridProps {
  totalModules: number;
  courseProgress: number;
  examAttemptsLeft: number;
  regularAttempts: number;
  addonAttempts: number;
}

export default function StatsGrid({
  totalModules,
  courseProgress,
  examAttemptsLeft,
  regularAttempts,
  addonAttempts,
}: StatsGridProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <BookOpen className={styles.iconBlue} />
          <span className={styles.value}>{totalModules}</span>
        </div>
        <h3 className={styles.label}>Total Modules</h3>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <CheckCircle className={styles.iconGreen} />
          <span className={styles.value}>{courseProgress}%</span>
        </div>
        <h3 className={styles.label}>Course Progress</h3>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Clock className={styles.iconOrange} />
          <span className={styles.value}>{examAttemptsLeft}</span>
        </div>
        <h3 className={styles.label}>Exam Attempts Left</h3>
        {addonAttempts > 0 && (
          <p className={styles.subtext}>
            ({regularAttempts} regular + {addonAttempts} addon)
          </p>
        )}
      </div>
    </div>
  );
}

