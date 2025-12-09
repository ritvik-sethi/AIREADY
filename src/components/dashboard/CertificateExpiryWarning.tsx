import { Bell, RefreshCw } from 'lucide-react';
import styles from './CertificateExpiryWarning.module.css';

interface ExpiryStatus {
  status: 'expired' | 'expiring_soon' | 'active';
  daysUntilExpiry: number;
  message: string;
}

interface CertificateExpiryWarningProps {
  expiryStatus: ExpiryStatus | null;
  onReissue: () => void;
}

export default function CertificateExpiryWarning({ expiryStatus, onReissue }: CertificateExpiryWarningProps) {
  if (!expiryStatus || expiryStatus.status === 'active') return null;

  const isExpired = expiryStatus.status === 'expired';

  return (
    <div className={`${styles.warning} ${isExpired ? styles.expired : styles.expiring}`}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Bell className={`${styles.icon} ${isExpired ? styles.iconExpired : styles.iconExpiring}`} />
          <div className={styles.textSection}>
            <h3 className={`${styles.title} ${isExpired ? styles.titleExpired : styles.titleExpiring}`}>
              {isExpired ? 'Certificate Expired' : 'Certificate Expiring Soon'}
            </h3>
            <p className={`${styles.message} ${isExpired ? styles.messageExpired : styles.messageExpiring}`}>
              {expiryStatus.message}
            </p>
            <p className={`${styles.description} ${isExpired ? styles.descriptionExpired : styles.descriptionExpiring}`}>
              {isExpired
                ? 'Your certificate has expired. Purchase a re-exam to get a new certificate with 3 years validity.'
                : 'Your certificate will expire soon. Consider purchasing a re-exam to extend your certification.'}
            </p>
          </div>
        </div>
        <button
          onClick={onReissue}
          className={`${styles.button} ${isExpired ? styles.buttonExpired : styles.buttonExpiring}`}
        >
          <RefreshCw className={styles.buttonIcon} />
          <span>Reissue Certificate</span>
        </button>
      </div>
    </div>
  );
}

