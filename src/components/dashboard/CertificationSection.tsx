import { Award, CheckCircle, Calendar, Download, ExternalLink, Star, Clock } from 'lucide-react';
import styles from './CertificationSection.module.css';
import { User } from '../../services/authService';

interface CertificationSectionProps {
  user: User;
  courseProgress: number;
}

export default function CertificationSection({ user, courseProgress }: CertificationSectionProps) {
  const isPassed = user.examStatus === 'passed';

  if (isPassed) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <Award className={styles.headerIcon} />
            </div>
            <h2 className={styles.headerTitle}>My Certification</h2>
          </div>
        </div>

        <div className={styles.content}>
          {/* Certificate Details */}
          <div className={styles.certificateCard}>
            <div className={styles.certificateHeader}>
              <div className={styles.certificateIconWrapper}>
                <Award className={styles.certificateIcon} />
              </div>
              <div>
                <h3 className={styles.certificateTitle}>Congratulations!</h3>
                <p className={styles.certificateSubtitle}>You are AI Ready Certified</p>
              </div>
            </div>

            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Certificate Number</span>
                <span className={styles.detailValue}>{user.certificateNumber || 'AIREADY-2025-XXXX'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Issued Date</span>
                <span className={styles.detailValue}>
                  {user.certificateIssuedDate
                    ? new Date(user.certificateIssuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'January 15, 2025'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Expiry Date</span>
                <span className={styles.detailValue}>
                  {user.certificateExpiryDate
                    ? new Date(user.certificateExpiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'January 15, 2028'}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.statusBadge}>
                  <CheckCircle className={styles.statusIcon} />
                  <span>Active</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Downloading your AI Ready Certificate...\n\nIn production, this would download the official PDF certificate.');
              }}
              className={styles.downloadButton}
            >
              <Download className={styles.buttonIcon} />
              <span>Download Certificate (PDF)</span>
            </button>
          </div>

          {/* Credly Badge & Sharing */}
          <div className={styles.rightSection}>
            <div className={styles.badgeCard}>
              <h4 className={styles.badgeTitle}>
                <Award className={styles.badgeTitleIcon} />
                <span>Digital Badge (Credly)</span>
              </h4>

              {user.credlyBadgeUrl ? (
                <div className={styles.badgeContent}>
                  <div className={styles.badgeDisplay}>
                    <Award className={styles.badgeIcon} />
                    <p className={styles.badgeText}>AI Ready Certified</p>
                  </div>
                  <a
                    href={user.credlyBadgeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.credlyLink}
                  >
                    <ExternalLink className={styles.buttonIcon} />
                    <span>View on Credly</span>
                  </a>
                </div>
              ) : (
                <div className={styles.badgePending}>
                  <Clock className={styles.pendingIcon} />
                  <p className={styles.pendingText}>Your Credly badge is being generated</p>
                  <p className={styles.pendingSubtext}>You'll receive an email within 3-5 business days</p>
                </div>
              )}
            </div>

            <div className={styles.shareCard}>
              <h4 className={styles.shareTitle}>
                <Star className={styles.shareTitleIcon} />
                <span>Share Your Achievement</span>
              </h4>
              <p className={styles.shareDescription}>
                Let the world know about your AI Ready certification!
              </p>
              <div className={styles.shareButtons}>
                <button
                  onClick={() => {
                    alert('Sharing on LinkedIn...\n\nIn production, this would open LinkedIn share dialog with your certification details.');
                  }}
                  className={styles.linkedInButton}
                >
                  <ExternalLink className={styles.buttonIcon} />
                  <span>Share on LinkedIn</span>
                </button>
                <button
                  onClick={() => {
                    alert('Sharing on Twitter...\n\nIn production, this would open Twitter share dialog with your certification details.');
                  }}
                  className={styles.twitterButton}
                >
                  <ExternalLink className={styles.buttonIcon} />
                  <span>Share on Twitter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not passed view
  return (
    <div className={styles.sectionNotPassed}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <Award className={styles.headerIcon} />
          </div>
          <h2 className={styles.headerTitle}>My Certification</h2>
        </div>
      </div>

      <div className={styles.centerContent}>
        <Award className={styles.centerIcon} />
        <h3 className={styles.centerTitle}>
          {user.examStatus === 'failed' ? 'Keep Trying!' : 'Certificate Awaits'}
        </h3>
        <p className={styles.centerSubtitle}>
          {user.examStatus === 'failed'
            ? "Review modules and try again!"
            : 'Pass the exam to get certified'}
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <Award className={styles.featureIcon} />
            <h4 className={styles.featureTitle}>Official Certificate</h4>
          </div>
          <p className={styles.featureDescription}>PDF with unique verification number</p>
        </div>

        <div className={styles.featureCardBlue}>
          <div className={styles.featureHeader}>
            <CheckCircle className={styles.featureIconBlue} />
            <h4 className={styles.featureTitle}>Credly Badge</h4>
          </div>
          <p className={styles.featureDescription}>Shareable on LinkedIn & social media</p>
        </div>

        <div className={styles.featureCardGreen}>
          <div className={styles.featureHeader}>
            <Calendar className={styles.featureIconGreen} />
            <h4 className={styles.featureTitle}>3 Years Validity</h4>
          </div>
          <p className={styles.featureDescription}>Industry-recognized certification</p>
        </div>
      </div>

      <div className={styles.nextStep}>
        <p className={styles.nextStepText}>
          <strong>Next:</strong>{' '}
          {user.examStatus === 'failed'
            ? 'Review weak areas and retake exam'
            : courseProgress < 100
              ? `Complete modules (${courseProgress}%)`
              : 'Take the final exam now!'}
        </p>
      </div>
    </div>
  );
}

