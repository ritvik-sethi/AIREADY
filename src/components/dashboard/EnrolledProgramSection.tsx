import { Target, Award, Calendar, Star, TrendingUp, CheckCircle } from 'lucide-react';
import { getTrackIcon, getTrackColorClasses, TrackColorClasses } from '../../utils/trackUtils';
import styles from './EnrolledProgramSection.module.css';

interface Track {
  id: string;
  name: string;
  description: string;
  validity: string;
  passingScore: number;
  color: string;
  icon: string;
  targetAudience: string;
  competencies: string[];
  modules: any[];
}

interface EnrolledProgramSectionProps {
  enrolledTrack: Track | undefined;
  enrollmentDate: string;
  expiryDate: string | null;
  overallProgress: number;
  completedModules: number;
}

export default function EnrolledProgramSection({
  enrolledTrack,
  enrollmentDate,
  expiryDate,
  overallProgress,
  completedModules,
}: EnrolledProgramSectionProps) {
  if (!enrolledTrack) return null;

  const colorClasses = getTrackColorClasses(enrolledTrack.color);
  const IconComponent = getTrackIcon(enrolledTrack.icon);

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <Target className={styles.headerIcon} />
          </div>
          <h2 className={styles.headerTitle}>My Enrolled Program</h2>
        </div>
        <div className={`${styles.statusBadge} ${styles[colorClasses.bg]}`}>
          Active
        </div>
      </div>

      <div className={styles.content}>
        {/* Program Info */}
        <div className={styles.programInfo}>
          <div className={`${styles.programCard} ${styles[colorClasses.bg]}`}>
            <IconComponent className={`${styles.programIcon} ${styles[colorClasses.text]}`} />
            <div className={styles.programDetails}>
              <h3 className={styles.programName}>{enrolledTrack.name}</h3>
              <p className={styles.programDescription}>{enrolledTrack.description}</p>

              <div className={styles.programMeta}>
                <div className={styles.metaItem}>
                  <Award className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    <strong>Validity:</strong> {enrolledTrack.validity}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <Target className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    <strong>Passing Score:</strong> {enrolledTrack.passingScore}%
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    <strong>Enrolled:</strong> {enrollmentDate}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    <strong>Program Ends:</strong> {expiryDate || 'N/A'}
                  </span>
                </div>
              </div>

              <div className={styles.targetAudience}>
                <h4 className={styles.targetTitle}>
                  <Star className={styles.targetIcon} />
                  <span>Target Audience</span>
                </h4>
                <p className={styles.targetText}>{enrolledTrack.targetAudience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Competencies & Progress */}
        <div className={styles.sidebar}>
          {/* Progress Card */}
          <div className={styles.progressCard}>
            <h4 className={styles.progressTitle}>
              <TrendingUp className={styles.progressIcon} />
              <span>Overall Progress</span>
            </h4>
            <div className={styles.progressContent}>
              <div className={styles.progressHeader}>
                <span className={styles.progressValue}>{overallProgress}%</span>
                <span className={styles.progressLabel}>Complete</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
            <p className={styles.progressText}>
              {completedModules} of {enrolledTrack.modules.length} modules completed
            </p>
          </div>

          {/* Key Competencies */}
          <div className={styles.competenciesCard}>
            <h4 className={styles.competenciesTitle}>
              <Award className={styles.competenciesIcon} />
              <span>Key Competencies</span>
            </h4>
            <ul className={styles.competenciesList}>
              {enrolledTrack.competencies.slice(0, 5).map((comp, index) => (
                <li key={index} className={styles.competencyItem}>
                  <CheckCircle className={styles.competencyCheck} />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

