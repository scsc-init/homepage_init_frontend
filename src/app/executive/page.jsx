import Link from 'next/link';
import WithAuthorization from '@/components/WithAuthorization';
import ScscStatusPanel from './ScscStatusPanel';
import DiscordBotPanel from './DiscordBotPanel';
import EnrollmentPolicyPanel from './EnrollmentPolicyPanel';
import { fetchSCSCGlobalStatus, fetchDiscordBotStatus } from '@/util/fetchAPIData';
import './page.css';

const adminPageLinks = [
  {
    title: '유저 관리',
    description: '임원진 및 유저 관리 페이지로 이동',
    href: '/executive/user',
  },
  {
    title: '지원금 요청',
    description: '지원금 요청 게시판으로 이동',
    href: '/board/6',
  },
  {
    title: 'HTML 페이지 관리',
    description: 'HTML 페이지 관리 페이지로 이동',
    href: '/executive/w',
  },
  {
    title: '게시글 관리',
    description: '게시글 관리 페이지로 이동',
    href: '/executive/board',
  },
  {
    title: 'SIG 관리',
    description: 'SIG 관리 페이지로 이동',
    href: '/executive/sig',
  },
  {
    title: 'PIG 관리',
    description: 'PIG 관리 페이지로 이동',
    href: '/executive/pig',
  },
  {
    title: 'KV table 관리',
    description: 'KV table 관리 페이지로 이동',
    href: '/executive/kv',
  },
  {
    title: '전공 관리',
    description: '전공 목록 페이지로 이동',
    href: '/executive/major',
  },
];

export default async function AdminPanel() {
  const [scscGlobalStatus, discordBotStatus] = await Promise.allSettled([
    fetchSCSCGlobalStatus(),
    fetchDiscordBotStatus(),
  ]);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <div className="admin-page-list">
          {adminPageLinks.map(({ title, description, href }) => {
            return (
              <Link key={title} href={href} className="admin-page-card">
                <div className="admin-page-card-content">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="dangerous-area">
          <span className="warning-text">
            * 본 영역은 시스템에 대한 직접적인 영향을 미칠 수 있는 기능을 포함하고 있습니다.
            조작 시 주의해주세요. *
          </span>
          <h2>SCSC status 관리</h2>
          <div className="adm-section">
            <EnrollmentPolicyPanel scscGlobalStatus={scscGlobalStatus.value} />
          </div>
          <div className="adm-section">
            <ScscStatusPanel
              scscGlobalStatus={
                scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
              }
              semester={
                scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.semester : null
              }
              year={
                scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.year : null
              }
            />
          </div>
        </div>

        <h2>디스코드 봇 관리</h2>
        <div className="adm-section">
          <DiscordBotPanel
            is_logged_in={
              discordBotStatus.status === 'fulfilled' ? discordBotStatus.value : 'error'
            }
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
