import { useState, useEffect } from 'react';
import { User } from '../services/authService';
import { authService } from '../services/authService';
import { updateCourseProgress, getAllMockTests } from '../services/database';
import curriculumData from '../data/curriculum.json';
import certificationTracksData from '../data/certificationTracks.json';
import MockTestInterface from './MockTestInterface';
import UserProfile from './UserProfile';
import DashboardHeader from './dashboard/DashboardHeader';
import WelcomeSection from './dashboard/WelcomeSection';
import CertificateExpiryWarning from './dashboard/CertificateExpiryWarning';
import StatsGrid from './dashboard/StatsGrid';
import TakeFinalExamSection from './dashboard/TakeFinalExamSection';
import CertificationSection from './dashboard/CertificationSection';
import EnrolledProgramSection from './dashboard/EnrolledProgramSection';
import AddonAttemptsSection from './dashboard/AddonAttemptsSection';
import MockTestsSection from './dashboard/MockTestsSection';
import PerformanceAnalysisSection from './dashboard/PerformanceAnalysisSection';
import MyLearningSection from './dashboard/MyLearningSection';
import styles from './Dashboard.module.css';
import { jssoService } from '../services/jssoService';
import { store } from '../store';
import { clearUserInfo } from '../store/slices/jssoAuthSlice';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  // Ensure user has proper structure with default values
  const [localUser, setLocalUser] = useState<User>({
    ...user,
    courseProgress: {
      modules: user.courseProgress?.modules || [],
      overallProgress: user.courseProgress?.overallProgress || 0
    },
    mockTests: user.mockTests || []
  });
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  const curriculum = curriculumData.modules;
  const certificationTracks = certificationTracksData.tracks;

  // Load mock tests from database
  useEffect(() => {
    const loadMockTests = async () => {
      try {
        const tests = await getAllMockTests();
        setAvailableTests(tests);
      } catch (error) {
        console.error('Error loading mock tests:', error);
        setAvailableTests([]);
      }
    };
    loadMockTests();
  }, []);

  // Get user's enrolled certification track
  const enrolledTrack = certificationTracks.find(track => track.id === localUser.certificationTrack);

  // Refresh user data when window regains focus (only, no periodic refresh)
  useEffect(() => {
    const handleFocus = async () => {
      const refreshedUser = await authService.refreshUserData();
      if (refreshedUser) {
        // Ensure refreshed user has proper structure
        setLocalUser({
          ...refreshedUser,
          courseProgress: {
            modules: refreshedUser.courseProgress?.modules || [],
            overallProgress: refreshedUser.courseProgress?.overallProgress || 0
          },
          mockTests: refreshedUser.mockTests || []
        });
      }
    };

    // Refresh on window focus only (when user switches back to tab)
    window.addEventListener('focus', handleFocus);
    
    // Listen for storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser' && e.newValue) {
        try {
          const updatedUser = JSON.parse(e.newValue);
          // Ensure updated user has proper structure
          setLocalUser({
            ...updatedUser,
            courseProgress: {
              modules: updatedUser.courseProgress?.modules || [],
              overallProgress: updatedUser.courseProgress?.overallProgress || 0
            },
            mockTests: updatedUser.mockTests || []
          });
        } catch (error) {
          console.error('Error parsing user data from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Refresh user data after test completion
  const handleTestComplete = async () => {
    const refreshedUser = await authService.refreshUserData();
    if (refreshedUser) {
      // Ensure refreshed user has proper structure
      setLocalUser({
        ...refreshedUser,
        courseProgress: {
          modules: refreshedUser.courseProgress?.modules || [],
          overallProgress: refreshedUser.courseProgress?.overallProgress || 0
        },
        mockTests: refreshedUser.mockTests || []
      });
    }
  };

  // Get user's module progress
  const getUserModuleProgress = (moduleId: string): { progress: number; status: 'not_started' | 'in_progress' | 'completed' } => {
    const modules = localUser?.courseProgress?.modules || [];
    const module = modules.find(m => m.moduleId === moduleId);
    if (module) {
      return {
        progress: module.progress,
        status: (module.status === 'completed' || module.status === 'in_progress' || module.status === 'not_started')
          ? module.status
          : 'not_started' as const
      };
    }
    return { progress: 0, status: 'not_started' as const };
  };

  // Mark module as completed
  const handleMarkAsCompleted = async (moduleId: string) => {
    try {
      const modules = localUser?.courseProgress?.modules || [];
      const moduleIndex = modules.findIndex(m => m.moduleId === moduleId);

      let updatedModules;
      if (moduleIndex !== -1) {
        updatedModules = [...modules];
        updatedModules[moduleIndex] = {
          ...updatedModules[moduleIndex],
          progress: 100,
          status: 'completed'
        };
      } else {
        updatedModules = [...modules, {
          moduleId,
          progress: 100,
          status: 'completed'
        }];
      }

      const totalModules = curriculum.length;
      const completedModules = updatedModules.filter(m => m.status === 'completed').length;
      const overallProgress = Math.round((completedModules / totalModules) * 100);

      await updateCourseProgress(parseInt(localUser.id), moduleId, {
        progress: 100,
        status: 'completed',
        overallProgress
      });

      const refreshedUser = await authService.refreshUserData();
      if (refreshedUser) {
        setLocalUser(refreshedUser);
        alert(`Module marked as completed! Your progress is now ${overallProgress}%`);
      }
    } catch (error) {
      console.error('Error marking module as completed:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  // Handle curriculum PDF download
  const handleDownloadCurriculum = (moduleId: string) => {
    const module = curriculum.find(m => m.id === moduleId);
    if (module) {
      alert(`Downloading curriculum for: ${module.title}\n\nIn production, this would download the PDF from: ${module.pdfUrl}`);
    }
  };

  // Handle opening mock test in new tab
  const handleOpenMockTest = (testId: string) => {
    const testUrl = `/mock-test?id=${testId}`;
    window.open(testUrl, '_blank');
  };

  const handleLogout = async () => {
    // Clear Redux state
    store.dispatch(clearUserInfo());
    
    // Call JSSO logout
    try {
      await jssoService.logout(() => {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        // Call parent logout handler
        onLogout();
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear localStorage and call parent logout handler even if logout fails
      localStorage.removeItem('currentUser');
      onLogout();
    }
  };

  // Calculate certificate expiry status
  const getCertificateExpiryStatus = (): { status: 'expired' | 'expiring_soon' | 'active'; daysUntilExpiry: number; message: string } | null => {
    if (!localUser.certificateExpiryDate) return null;

    const expiryDate = new Date(localUser.certificateExpiryDate);
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'expired' as const, daysUntilExpiry, message: 'Certificate has expired' };
    } else if (expiryDate <= threeMonthsFromNow) {
      return { status: 'expiring_soon' as const, daysUntilExpiry, message: `Certificate expires in ${daysUntilExpiry} days` };
    }
    return { status: 'active' as const, daysUntilExpiry, message: 'Certificate is active' };
  };

  // Handle addon attempts purchase
  const handlePurchaseAddonAttempts = () => {
    if (!enrolledTrack) return;

    const confirmed = confirm(
      `Purchase 2 addon exam attempts for ₹${enrolledTrack.addonAttemptsPrice}?\n\n` +
      `This is a 50% discount from the regular exam price.\n` +
      `You will get 2 additional attempts to pass the exam.`
    );

    if (confirmed) {
      alert(
        `Addon Attempts Purchase\n\n` +
        `Amount: ₹${enrolledTrack.addonAttemptsPrice}\n` +
        `Attempts: 2\n\n` +
        `In production, this would redirect to payment gateway.\n` +
        `After successful payment, 2 attempts will be added to your account.`
      );
    }
  };

  // Handle certificate reissue
  const handleReissueCertificate = () => {
    if (!enrolledTrack) return;

    const confirmed = confirm(
      `Reissue Certificate & Re-exam\n\n` +
      `Amount: ₹${enrolledTrack.reExamPrice}\n` +
      `Validity: 3 years from date of passing\n` +
      `Attempts: 3 new attempts\n\n` +
      `Proceed with payment?`
    );

    if (confirmed) {
      alert(
        `Certificate Reissue Payment\n\n` +
        `Amount: ₹${enrolledTrack.reExamPrice}\n\n` +
        `In production, this would redirect to payment gateway.\n` +
        `After successful payment and passing the exam, your certificate will be reissued with 3 years validity.`
      );
    }
  };

  // Handle start exam
  const handleStartExam = () => {
    alert(
      'Redirecting to Talview Exam Platform\n\n' +
      'In production, this would:\n' +
      '1. Verify your identity\n' +
      '2. Initialize the proctoring system\n' +
      '3. Start your certification exam\n\n' +
      'The exam will be monitored for integrity and security.'
    );
  };

  const expiryStatus = getCertificateExpiryStatus();
  const totalAttempts = (user.remainingAttempts || 0) + (user.addonAttempts || 0);
  const completedModules = (localUser?.courseProgress?.modules || []).filter(m => m.status === 'completed').length;

  return (
    <>
      {selectedTestId && (
        <MockTestInterface
          testId={selectedTestId}
          onClose={() => setSelectedTestId(null)}
          onTestComplete={handleTestComplete}
        />
      )}

      {showProfile && (
        <UserProfile
          user={user}
          onClose={() => setShowProfile(false)}
          onSave={(updatedUser) => {
            alert('Profile updated successfully! In production, this would save to the database.');
            setShowProfile(false);
          }}
        />
      )}

      <div className={styles.dashboard}>
        <DashboardHeader
          userName={user.name}
          onProfileClick={() => setShowProfile(true)}
          onLogout={handleLogout}
        />

        <main className={styles.main}>
          <WelcomeSection userName={user.name} />

          {expiryStatus && expiryStatus.status !== 'active' && (
            <CertificateExpiryWarning
              expiryStatus={expiryStatus}
              onReissue={handleReissueCertificate}
            />
          )}

          {/* <StatsGrid
            totalModules={curriculum.length}
            courseProgress={localUser.courseProgress.overallProgress}
            examAttemptsLeft={totalAttempts}
            regularAttempts={user.remainingAttempts || 0}
            addonAttempts={user.addonAttempts || 0}
          /> */}

          {user.examStatus !== 'passed' ? (
            <div className={styles.examSection}>
              {totalAttempts > 0 && (
                <TakeFinalExamSection
                  examStatus={user.examStatus}
                  remainingAttempts={user.remainingAttempts || 0}
                  addonAttempts={user.addonAttempts || 0}
                  passingScore={enrolledTrack?.passingScore || 70}
                  courseProgress={localUser.courseProgress.overallProgress}
                  onStartExam={handleStartExam}
                />
              )}
              <CertificationSection
                user={user}
                courseProgress={localUser.courseProgress.overallProgress}
              />
            </div>
          ) : (
            <CertificationSection
              user={user}
              courseProgress={localUser.courseProgress.overallProgress}
            />
          )}

          {enrolledTrack && (
            <EnrolledProgramSection
              enrolledTrack={enrolledTrack}
              enrollmentDate={localUser.enrollment.enrolledDate}
              expiryDate={localUser.enrollment.expiryDate}
              overallProgress={localUser.courseProgress.overallProgress}
              completedModules={completedModules}
            />
          )}

          {enrolledTrack && user.examStatus === 'failed' && (user.remainingAttempts || 0) === 0 && (
            <AddonAttemptsSection
              enrolledTrack={enrolledTrack}
              onPurchase={handlePurchaseAddonAttempts}
            />
          )}

          <div className={styles.testsSection}>
            <MockTestsSection
              availableTests={availableTests}
              user={user}
              onOpenTest={handleOpenMockTest}
            />
            <PerformanceAnalysisSection
              user={localUser}
              availableTests={availableTests}
            />
          </div>

          <MyLearningSection
            modules={curriculum}
            getUserModuleProgress={getUserModuleProgress}
            onDownloadCurriculum={handleDownloadCurriculum}
            onMarkAsCompleted={handleMarkAsCompleted}
          />
        </main>
      </div>
    </>
  );
}
