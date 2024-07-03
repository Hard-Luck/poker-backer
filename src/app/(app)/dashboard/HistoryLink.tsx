import Link from 'next/link';
import { GiPokerHand } from 'react-icons/gi';
import DashboardIcon from './DashboardIcon';
export default function HistoryLink() {
  return (
    <Link href="/floats">
      <DashboardIcon Icon={GiPokerHand} text="Floats" />
    </Link>
  );
}
