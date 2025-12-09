import { LogOut, User as UserIcon } from 'lucide-react';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  userName: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({ userName, onProfileClick, onLogout }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <img
              src="https://economictimes.indiatimes.com/photo/119331595.cms"
              alt="AI Ready Logo"
              className={styles.logo}
            />
            <span className={styles.title}>Dashboard</span>
          </div>
          <div className={styles.rightSection}>
            <button
              onClick={onProfileClick}
              className={styles.profileButton}
            >
              <UserIcon className={styles.profileIcon} />
              <span className={styles.profileName}>{userName}</span>
            </button>
            <button
              onClick={onLogout}
              className={styles.logoutButton}
            >
              <LogOut className={styles.logoutIcon} />
              <span className={styles.logoutText}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

