import WithAuthorization from '@/components/WithAuthorization';
import ArticleList from './ArticleList';
import styles from './ArticleList.module.css';
import { fetchBoards } from '@/util/fetchAPIData';

const [boards] = await Promise.allSettled([fetchBoards([3, 4, 5, 6])]);

export default async function ArticleListPage() {
  return (
    <WithAuthorization>
      <div className={styles.panel}>
        <div className={styles.section}>
          <ArticleList
            boards={
              boards.status === 'fulfilled'
                ? boards.value.filter((b) => b.status === 'fulfilled').map((b) => b.value)
                : []
            }
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
