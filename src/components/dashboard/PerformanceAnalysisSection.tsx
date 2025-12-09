import { BarChart3, FileText, TrendingUp, Award, Calendar, CheckCircle, XCircle } from 'lucide-react';
import styles from './PerformanceAnalysisSection.module.css';
import { User } from '../../services/authService';

interface MockTest {
  id: string;
  title: string;
  passingScore: number;
  totalQuestions?: number;
}

interface PerformanceAnalysisSectionProps {
  user: User;
  availableTests: MockTest[];
}

export default function PerformanceAnalysisSection({ user, availableTests }: PerformanceAnalysisSectionProps) {
  // Filter completed tests - handle boolean true explicitly
  const completedTests = (user.mockTests || []).filter(t => t.completed === true);
  const hasCompletedTests = completedTests.length > 0;

  if (!hasCompletedTests) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <BarChart3 className={styles.headerIcon} />
            </div>
            <h2 className={styles.headerTitle}>Performance Analysis</h2>
          </div>
        </div>
        <div className={styles.emptyState}>
          <BarChart3 className={styles.emptyIcon} />
          <p className={styles.emptyText}>No mock tests completed yet</p>
          <p className={styles.emptySubtext}>
            Complete mock tests to see your performance analysis here
          </p>
        </div>
      </div>
    );
  }

  const completedTestsWithScores = (user.mockTests || []).filter(t => t.completed && t.score !== null);
  const averageScore = completedTestsWithScores.length > 0
    ? Math.round(completedTestsWithScores.reduce((acc, t) => acc + (t.score || 0), 0) / completedTestsWithScores.length)
    : 0;

  const passedTests = (user.mockTests || []).filter(t => t.completed && t.score && t.score >= 70).length;
  const passRate = completedTests.length > 0
    ? Math.round((passedTests / completedTests.length) * 100)
    : 0;

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { text: 'Excellent', className: styles.excellent };
    if (score >= 70) return { text: 'Good', className: styles.good };
    if (score >= 50) return { text: 'Needs Improvement', className: styles.needsImprovement };
    return { text: 'Poor', className: styles.poor };
  };

  // Get completed tests with details, sorted by completion date (most recent first)
  const completedTestsWithDetails = availableTests
    .map((test) => {
      // Match testId - normalize both to strings for comparison
      const userTest = (user.mockTests || []).find(t => 
        String(t.testId).trim() === String(test.id).trim()
      );
      
      // Only include if test is completed (explicitly true)
      if (!userTest || userTest.completed !== true) {
        return null;
      }

      const score = userTest.score || 0;
      const passed = score >= test.passingScore;
      const completedAt = userTest.completedAt 
        ? new Date(userTest.completedAt) 
        : null;
      
      // Calculate answer statistics if answers are available
      let correctAnswers = 0;
      let totalAnswers = 0;
      if (userTest.answers && Array.isArray(userTest.answers)) {
        totalAnswers = userTest.answers.filter((ans: number) => ans !== -1 && ans !== null && ans !== undefined).length;
        // Note: We can't calculate correct answers without the test questions, 
        // but we can show how many were answered
      }

      return {
        test,
        userTest,
        score,
        passed,
        completedAt,
        correctAnswers,
        totalAnswers,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (!a.completedAt && !b.completedAt) return 0;
      if (!a.completedAt) return 1;
      if (!b.completedAt) return -1;
      return b.completedAt.getTime() - a.completedAt.getTime();
    });

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <BarChart3 className={styles.headerIcon} />
          </div>
          <h2 className={styles.headerTitle}>Performance Analysis</h2>
        </div>
      </div>

      <div className={styles.content}>
        {/* Overall Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCardBlue}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Tests Done</span>
              <FileText className={styles.statIcon} />
            </div>
            <p className={styles.statValueBlue}>{completedTests.length}</p>
          </div>
          <div className={styles.statCardGreen}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Avg Score</span>
              <TrendingUp className={styles.statIcon} />
            </div>
            <p className={styles.statValueGreen}>{averageScore}%</p>
          </div>
          <div className={styles.statCardPurple}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Pass Rate</span>
              <Award className={styles.statIcon} />
            </div>
            <p className={styles.statValuePurple}>{passRate}%</p>
          </div>
        </div>

        {/* Individual Test Performance */}
        <div className={styles.testResults}>
          <h3 className={styles.resultsTitle}>Detailed Test Results</h3>
          <div className={styles.resultsList}>
            {completedTestsWithDetails.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>
                  Completed tests found but couldn't match with available tests. 
                  Please refresh the page.
                </p>
              </div>
            ) : (
              completedTestsWithDetails.map(({ test, score, passed, completedAt, totalAnswers }) => {
              const scoreLabel = getScoreLabel(score);
              const testTitle = test.title;
              const passingScore = test.passingScore || 70;

              return (
                <div key={test.id} className={styles.resultCard}>
                  <div className={styles.resultHeader}>
                    <div className={styles.resultTitleSection}>
                      <h4 className={styles.resultTitle}>{testTitle}</h4>
                      {completedAt && (
                        <div className={styles.completionDate}>
                          <Calendar className={styles.dateIcon} />
                          <span className={styles.dateText}>{formatDate(completedAt)}</span>
                        </div>
                      )}
                    </div>
                    <div className={passed ? styles.scorePassed : styles.scoreFailed}>
                      {score}%
                    </div>
                  </div>
                  
                  <div className={styles.resultDetails}>
                    <div className={styles.detailRow}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Status:</span>
                        <div className={passed ? styles.statusPassed : styles.statusFailed}>
                          {passed ? (
                            <>
                              <CheckCircle className={styles.statusIcon} />
                              <span>Passed</span>
                            </>
                          ) : (
                            <>
                              <XCircle className={styles.statusIcon} />
                              <span>Failed</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Passing Score:</span>
                        <span className={styles.detailValue}>{passingScore}%</span>
                      </div>
                      {totalAnswers > 0 && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Questions Answered:</span>
                          <span className={styles.detailValue}>{totalAnswers}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.progressBar}>
                    <div
                      className={passed ? styles.progressFillPassed : styles.progressFillFailed}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  
                  <div className={styles.resultFooter}>
                    <span className={scoreLabel.className}>{scoreLabel.text}</span>
                    <span className={styles.scoreComparison}>
                      {score >= passingScore 
                        ? `+${score - passingScore}% above passing` 
                        : `${passingScore - score}% below passing`}
                    </span>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

