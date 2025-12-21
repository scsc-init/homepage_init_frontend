import FundApplyClient from './FundApplyClient';
import { fetchFundApplyCreateData } from '@/util/fetchAPIData';

export default async function FundApplyPage() {
  const { boardInfo, sigs, pigs, prevSigs, prevPigs, globalStatus, prevTerm } =
    await fetchFundApplyCreateData(6);

  return (
    <FundApplyClient
      boardInfo={boardInfo}
      sigs={sigs}
      pigs={pigs}
      prevSigs={prevSigs}
      prevPigs={prevPigs}
      globalStatus={globalStatus}
      prevTerm={prevTerm}
    />
  );
}
