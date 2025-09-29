// src/app/executive/page.jsx
import ArticleList from './ArticleList';
import SigList from './SigList';
import PigList from './PigList';
import MajorList from './MajorList';
import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import ScscStatusPanel from './ScscStatusPanel';
import DiscordBotPanel from './DiscordBotPanel';
import {
  fetchBoards,
  fetchSigs,
  fetchPigs,
  fetchSCSCGlobalStatus,
  fetchMajors,
  fetchDiscordBotStatus,
} from '@/util/fetchAPIData';
import './page.css';

export default async function AdminPanel() {
  const [boards, sigs, pigs, scscGlobalStatus, majors, discordBotStatus] = await Promise.all([
    fetchBoards([3, 4, 5, 6]),
    fetchSigs(),
    fetchPigs(),
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
          <ArticleList boards={boards} />
        </div>

        <h2>SIG 관리</h2>
        <div className="adm-section">
          <SigList sigs={sigs} />
        </div>

        <h2>PIG 관리</h2>
        <div className="adm-section">
          <PigList pigs={pigs} />
        </div>

        <h2>Scsc status 관리</h2>
        <div className="adm-section">
          <ScscStatusPanel
            scscGlobalStatus={scscGlobalStatus.status}
            semester={scscGlobalStatus.semester}
            year={scscGlobalStatus.year}
          />
        </div>

        <h2>디스코드 봇 관리</h2>
        <div className="adm-section">
          <DiscordBotPanel
            is_logged_in={discordBotStatus ? discordBotStatus.logged_in : 'error'}
          />
        </div>

        <h2>전공 관리</h2>
        <div className="adm-section">
          <MajorList majors={majors} />
        </div>
      </div>
    </WithAuthorization>
  );
}
