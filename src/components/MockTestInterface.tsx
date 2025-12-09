import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, ChevronRight, Award, X } from 'lucide-react';
import { saveMockTestResult, getMockTestById } from '../services/database';
import { authService } from '../services/authService';
import styles from './MockTestInterface.module.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MockTestInterfaceProps {
  testId: string;
  onClose: () => void;
  onTestComplete?: () => void;
}

export default function MockTestInterface({ testId, onClose, onTestComplete }: MockTestInterfaceProps) {
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  // Load test from database
  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);
        const testData = await getMockTestById(testId);
        if (testData) {
          setTest(testData);
          setTimeRemaining((testData.duration || 60) * 60); // Convert to seconds
          setSelectedAnswers(new Array(testData.questions?.length || 0).fill(-1));
        }
      } catch (error) {
        console.error('Error loading mock test:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [testId]);

  const handleSubmit = useCallback(async () => {
    if (!test) return;
    
    try {
      setSaving(true);

      // Calculate score
      let correctCount = 0;
      test.questions.forEach((q: any, index: number) => {
        if (selectedAnswers[index] === q.correctAnswer) {
          correctCount++;
        }
      });

      const finalScore = Math.round((correctCount / test.questions.length) * 100);
      setScore(finalScore);
      setShowResults(true);

      // Save result to database
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        await saveMockTestResult(
          parseInt(currentUser.id),
          testId,
          finalScore,
          true,
          selectedAnswers
        );
      }

      if (onTestComplete) {
        onTestComplete();
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      alert('Error saving test results. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [test, selectedAnswers, testId, onTestComplete]);

  useEffect(() => {
    if (showResults || !test) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, test, handleSubmit]);

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.loadingModal}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className={styles.overlay}>
        <div className={styles.errorModal}>
          <p className={styles.errorTitle}>Test not found</p>
          <p className={styles.errorMessage}>The requested mock test could not be loaded.</p>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = test.questions[currentQuestion];
  const isPassed = score >= test.passingScore;

  if (showResults) {
    return (
      <div className={styles.overlay}>
        <div className={styles.resultsModal}>
          {/* Results Header */}
          <div className={`${styles.resultsHeader} ${isPassed ? styles.resultsHeaderPassed : styles.resultsHeaderFailed}`}>
            <div style={{ textAlign: 'center' }}>
              {isPassed ? (
                <Award className={styles.resultsIcon} />
              ) : (
                <XCircle className={styles.resultsIcon} />
              )}
              <h2 className={styles.resultsTitle}>
                {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className={styles.resultsScore}>Your Score: {score}%</p>
              <p className={styles.resultsMessage}>
                {isPassed
                  ? `You passed! (Required: ${test.passingScore}%)`
                  : `You need ${test.passingScore}% to pass. You got ${score}%.`
                }
              </p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className={styles.resultsContent}>
            <h3 className={styles.resultsSectionTitle}>Review Your Answers</h3>
            <div className={styles.reviewList}>
              {test.questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div key={q.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      {isCorrect ? (
                        <CheckCircle className={`${styles.reviewIcon} ${styles.reviewIconCorrect}`} />
                      ) : (
                        <XCircle className={`${styles.reviewIcon} ${styles.reviewIconIncorrect}`} />
                      )}
                      <div style={{ flex: 1 }}>
                        <p className={styles.reviewQuestion}>
                          Question {index + 1}: {q.question}
                        </p>
                        <div className={styles.reviewOptions}>
                          {q.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = q.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={`${styles.reviewOption} ${
                                  isCorrectAnswer
                                    ? styles.reviewOptionCorrect
                                    : isUserAnswer
                                    ? styles.reviewOptionIncorrect
                                    : ''
                                }`}
                              >
                                {option}
                                {isCorrectAnswer && (
                                  <span className={`${styles.reviewOptionLabel} ${styles.reviewOptionLabelCorrect}`}>
                                    ✓ Correct
                                  </span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className={`${styles.reviewOptionLabel} ${styles.reviewOptionLabelIncorrect}`}>
                                    ✗ Your Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.explanationBox}>
                          <p className={styles.explanationLabel}>Explanation:</p>
                          <p className={styles.explanationText}>{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.backButton}>
              <button onClick={onClose} className={styles.backButtonInner}>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeIconButton} aria-label="Close">
            <X className={styles.closeIcon} />
          </button>
          <div className={styles.headerTop}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>{test.title}</h2>
              <p className={styles.questionCounter}>
                Question {currentQuestion + 1} of {test.questions.length}
              </p>
            </div>
            <div className={styles.timerContainer}>
              <Clock className={styles.timerIcon} />
              <span className={styles.timerText}>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={styles.contentWrapper}>
          {/* Question Panel */}
          <div className={styles.questionPanel}>
            <h3 className={styles.questionText}>{currentQ.question}</h3>
            <div className={styles.optionsList}>
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`${styles.optionButton} ${
                    selectedAnswers[currentQuestion] === index ? styles.optionButtonSelected : ''
                  }`}
                >
                  <div
                    className={`${styles.radioCircle} ${
                      selectedAnswers[currentQuestion] === index ? styles.radioCircleSelected : ''
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className={styles.radioDot}></div>
                    )}
                  </div>
                  <span className={styles.optionText}>{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Sidebar - Question Index */}
          <div className={styles.sidebar}>
            <h4 className={styles.sidebarTitle}>Questions</h4>
            <div className={styles.questionsGrid}>
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`${styles.questionIndexButton} ${
                    index === currentQuestion
                      ? styles.questionIndexButtonCurrent
                      : selectedAnswers[index] !== -1
                      ? styles.questionIndexButtonAnswered
                      : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className={styles.footer}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={styles.navButton}
          >
            Previous
          </button>

          {currentQuestion === test.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.includes(-1) || saving}
              className={styles.submitButton}
            >
              <span>{saving ? 'Submitting...' : 'Submit Test'}</span>
              {!saving && <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />}
            </button>
          ) : (
            <button onClick={handleNext} className={styles.submitButton}>
              <span>Next</span>
              <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          )}
        </div>

        {selectedAnswers.includes(-1) && currentQuestion === test.questions.length - 1 && (
          <p className={styles.warningText}>
            Please answer all questions before submitting
          </p>
        )}
      </div>
    </div>
  );
}
