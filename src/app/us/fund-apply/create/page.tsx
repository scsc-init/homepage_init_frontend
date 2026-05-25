import FundApplyForm from './form';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

const FUND_APPLY_BOARD_ID = 6;

export default async function FundApplyPage() {
  const globalStatus = await fetchGlobalStatus();
  return <FundApplyForm boardId={FUND_APPLY_BOARD_ID} globalStatus={globalStatus} />;
}
