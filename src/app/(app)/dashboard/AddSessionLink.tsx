import Link from "next/link";
import { IoMdAddCircle } from "react-icons/io";
import DashboardIcon from "./DashboardIcon";
export default function AddSessionLink() {
  return (
    <Link href="/session/new">
      <DashboardIcon Icon={IoMdAddCircle} text="Add Session" />
    </Link>
  );
}
