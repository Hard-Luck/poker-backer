"use client";
import { PlayerOrBacker } from "@/models/types";
import { BackingsForUserList } from "@/models/userBacking";
import { formatShortDate } from "@/models/utils/timestamp";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useRouter } from "next/navigation";

type BackingsListProps = {
  type: PlayerOrBacker;
  backings: BackingsForUserList;
};

const BackingsList: FC<BackingsListProps> = ({ backings, type }) => {
  const router = useRouter();
  return (
    <section>
      <h2>{type === "PLAYER" ? "Backed in: " : "Players you are backing:"}</h2>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last session</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backings.map((backing) => (
            <TableRow
              className="cursor-pointer hover:bg-gray-100 hover:text-black"
              role="link"
              onClick={() => {
                router.push(`/floats/${backing.id}`);
              }}
              key={backing.id}>
              <TableCell>{backing.name}</TableCell>
              <TableCell>
                {backing.lastSession
                  ? formatShortDate(backing.lastSession)
                  : "No sessions played"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default BackingsList;
