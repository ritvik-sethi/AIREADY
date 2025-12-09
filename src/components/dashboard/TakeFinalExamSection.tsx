import { FileText, Clock, Target, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './TakeFinalExamSection.module.css';

interface TakeFinalExamSectionProps {
  examStatus: string;
  remainingAttempts: number;
  addonAttempts: number;
  passingScore: number;
  courseProgress: number;
  onStartExam: () => void;
}

export default function TakeFinalExamSection({
  examStatus,
  remainingAttempts,
  addonAttempts,
  passingScore,
  courseProgress,
  onStartExam,
}: TakeFinalExamSectionProps) {
  const totalAttempts = remainingAttempts + addonAttempts;

  if (totalAttempts === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <FileText className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>Take Final Exam</h2>
            <p className={styles.subtitle}>
              {examStatus === 'not_attempted' ? 'Earn your certificate' : 'Try again!'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Clock className={styles.statIcon} />
          <p className={styles.statValue}>2 Hrs</p>
          <p className={styles.statLabel}>Duration</p>
        </div>

        <div className={styles.statCard}>
          <Target className={styles.statIcon} />
          <p className={styles.statValue}>{passingScore}%</p>
          <p className={styles.statLabel}>Pass Score</p>
        </div>

        <div className={styles.statCard}>
          <AlertCircle className={styles.statIcon} />
          <p className={styles.statValue}>{totalAttempts}</p>
          <p className={styles.statLabel}>Attempts</p>
        </div>
      </div>

      <div className={styles.requirements}>
        <h4 className={styles.requirementsTitle}>
          <CheckCircle className={styles.checkIcon} />
          <span>Requirements:</span>
        </h4>
        <ul className={styles.requirementsList}>
          <li className={styles.requirementItem}>
            <CheckCircle className={styles.requirementCheck} />
            <span>Stable internet & quiet environment</span>
          </li>
          <li className={styles.requirementItem}>
            <CheckCircle className={styles.requirementCheck} />
            <span>Webcam enabled for proctoring</span>
          </li>
          <li className={styles.requirementItem}>
            <CheckCircle className={styles.requirementCheck} />
            <span>Valid ID for verification</span>
          </li>
          <li className={styles.requirementItem}>
            <CheckCircle className={styles.requirementCheck} />
            <span>Complete practice tests (70%+)</span>
          </li>
        </ul>
      </div>

      {courseProgress < 100 && (
        <div className={styles.warning}>
          <AlertCircle className={styles.warningIcon} />
          <span className={styles.warningText}>
            Complete modules ({courseProgress}% done)
          </span>
        </div>
      )}

      <button onClick={onStartExam} className={styles.startButton}>
        <FileText className={styles.buttonIcon} />
        <span>Start Final Exam</span>
      </button>
    </div>
  );
}

