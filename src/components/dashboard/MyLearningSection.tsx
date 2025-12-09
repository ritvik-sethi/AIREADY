import { BookOpen, Download } from 'lucide-react';
import styles from './MyLearningSection.module.css';

interface Module {
  id: string;
  title: string;
  duration: string;
  description: string;
  topics: string[];
}

interface ModuleProgress {
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface MyLearningSectionProps {
  modules: Module[];
  getUserModuleProgress: (moduleId: string) => ModuleProgress;
  onDownloadCurriculum: (moduleId: string) => void;
  onMarkAsCompleted: (moduleId: string) => void;
}

export default function MyLearningSection({
  modules,
  getUserModuleProgress: _getUserModuleProgress,
  onDownloadCurriculum,
}: MyLearningSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <BookOpen className={styles.headerIcon} />
          </div>
          <h2 className={styles.headerTitle}>My Learning</h2>
        </div>
      </div>
      <div className={styles.modulesList}>
        {modules.map((module) => {
          return (
            <div key={module.id} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleInfo}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.moduleTitle}>{module.title}</h3>
                    <button
                      onClick={() => onDownloadCurriculum(module.id)}
                      className={styles.pdfButtonMobile}
                    >
                      <Download className={styles.buttonIcon} />
                      <span className={styles.buttonText}>PDF</span>
                    </button>
                  </div>
                  <p className={styles.moduleMeta}>
                    {module.duration} • {module.description}
                  </p>
                  <div className={styles.topics}>
                    {module.topics.slice(0, 3).map((topic, idx) => (
                      <span key={idx} className={styles.topicTag}>
                        {topic}
                      </span>
                    ))}
                    {module.topics.length > 3 && (
                      <span className={styles.topicTag}>
                        +{module.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.moduleActions}>
                  <button
                    onClick={() => onDownloadCurriculum(module.id)}
                    className={styles.pdfButton}
                  >
                    <Download className={styles.buttonIcon} />
                    <span className={styles.buttonText}>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

