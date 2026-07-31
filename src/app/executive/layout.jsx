import WithAuthorization from '@/components/WithAuthorization';
import ExecutiveSidebar from './ExecutiveSidebar';
import styles from './layout.module.css';

export default function ExecutiveLayout({ children }) {
  return (
    <WithAuthorization>
      <div className={styles.shell}>
        <ExecutiveSidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </WithAuthorization>
  );
}
