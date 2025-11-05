// src/app/executive/page.jsx
import ArticleList from './ArticleList';
import MajorList from './MajorList';
import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import ScscStatusPanel from './ScscStatusPanel';
import DiscordBotPanel from './DiscordBotPanel';
import {
  fetchBoards,
  fetchSCSCGlobalStatus,
  fetchMajors,
  fetchDiscordBotStatus,
} from '@/util/fetchAPIData';
import './page.css';

export default async function AdminPanel() {
  const [boards, scscGlobalStatus, majors, discordBotStatus] = await Promise.allSettled([
    fetchBoards([3, 4, 5, 6]),
    fetchSCSCGlobalStatus(),
    fetchMajors(),
    fetchDiscordBotStatus(),
  ]);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>유저 관리</h2>
        <p>
          <Link href="/executive/user">유저 관리 페이지로 이동</Link>
        </p>

        <h2>지원금 요청</h2>
        <p>
          <Link href="/board/6">지원금 요청 게시판으로 이동</Link>
        </p>

        <h2>HTML 페이지 관리</h2>
        <p>
          <Link href="/executive/w">HTML 페이지 관리 페이지로 이동</Link>
        </p>

        <h2>게시글 관리</h2>
        <div className="adm-section">
          <ArticleList
            boards={
              boards.status === 'fulfilled'
                ? boards.value.filter((b) => b.status === 'fulfilled').map((b) => b.value)
                : []
            }
          />
        </div>

        <h2>SIG 관리</h2>
        <p>
          <Link href="/executive/sig">SIG 관리 페이지로 이동</Link>
        </p>

        <h2>PIG 관리</h2>
        <p>
          <Link href="/executive/pig">PIG 관리 페이지로 이동</Link>
        </p>

        <h2>Scsc status 관리</h2>
        <div className="adm-section">
          <ScscStatusPanel
            scscGlobalStatus={
              scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
            }
            semester={
              scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.semester : null
            }
            year={scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.year : null}
          />
        </div>

        <h2>디스코드 봇 관리</h2>
        <div className="adm-section">
          <DiscordBotPanel
            is_logged_in={
              discordBotStatus.status === 'fulfilled' ? discordBotStatus.value : 'error'
            }
          />
        </div>

        <h2>Footer Message 관리</h2>
        <p>
          <Link href="/executive/footer">Footer Message 관리 페이지로 이동</Link>
        </p>

        <h2>전공 관리</h2>
        <div className="adm-section">
          <MajorList majors={majors.status === 'fulfilled' ? majors.value : []} />
        </div>
      </div>
    </WithAuthorization>
  );
}
