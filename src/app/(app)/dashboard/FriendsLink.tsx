import { FaUserFriends } from 'react-icons/fa';
import DashboardIcon from './DashboardIcon';
import Link from 'next/link';

const FriendsLink = () => {
  return (
    <Link href="/friends">
      <DashboardIcon text="Friends" Icon={FaUserFriends} />
    </Link>
  );
};

export default FriendsLink;
