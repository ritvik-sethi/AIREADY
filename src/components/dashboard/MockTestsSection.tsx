import { FileText, ExternalLink, CheckCircle } from 'lucide-react';
import styles from './MockTestsSection.module.css';
import { User } from '../../services/authService';

interface MockTest {
  id: string;
  title: string;
  totalQuestions: number;
  duration: number;
  passingScore: number;
}

interface MockTestsSectionProps {
  availableTests: MockTest[];
  user: User;
  onOpenTest: (testId: string) => void;
}

export default function MockTestsSection({ availableTests, user, onOpenTest }: MockTestsSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <FileText className={styles.headerIcon} />
          </div>
          <h2 className={styles.headerTitle}>Mock Tests</h2>
        </div>
      </div>
      <p className={styles.description}>
        Practice your knowledge with our comprehensive mock tests before taking the final exam.
      </p>
      <div className={styles.testsList}>
        {availableTests.map((test) => {
          const userTest = user.mockTests.find(t => t.testId === test.id);
          return (
            <div key={test.id} className={styles.testCard}>
              <div className={styles.testContent}>
                <div className={styles.testInfo}>
                  <h4 className={styles.testTitle}>{test.title}</h4>
                  <p className={styles.testMeta}>
                    {test.totalQuestions} questions • {test.duration} minutes • Pass: {test.passingScore}%
                  </p>
                  {userTest?.completed && (
                    <div className={styles.testStatus}>
                      <span className={styles.completedText}>
                        Completed: {userTest.score}%
                      </span>
                      {userTest.score && userTest.score >= test.passingScore && (
                        <CheckCircle className={styles.passIcon} />
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onOpenTest(test.id)}
                  className={styles.startButton}
                >
                  <ExternalLink className={styles.buttonIcon} />
                  <span>{userTest?.completed ? 'Retake' : 'Start'}</span>
                </button>
              </div>
            </div>
          );
        })}
        <div className={styles.lockedCard}>
          <div className={styles.testContent}>
            <div>
              <h4 className={styles.testTitle}>Mock Test 3</h4>
              <p className={styles.testMeta}>Coming Soon</p>
            </div>
            <button className={styles.lockedButton} disabled>
              Locked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

