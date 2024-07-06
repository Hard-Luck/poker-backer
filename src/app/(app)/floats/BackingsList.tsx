'use client';
import { type PlayerOrBacker } from '@/models/types';
import { type BackingsForUserList } from '@/models/userBacking';
import { formatDateStringToDDMM } from '@/models/utils/timestamp';
import { type FC } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { useRouter } from 'next/navigation';

type BackingsListProps = {
  type: PlayerOrBacker;
  backings: BackingsForUserList;
};

const BackingsList: FC<BackingsListProps> = ({ backings, type }) => {
  const router = useRouter();
  return (
    <section>
      <h2>{type === 'PLAYER' ? 'Backed in: ' : 'Players you are backing:'}</h2>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Last session</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backings.map(backing => (
            <TableRow
              className="cursor-pointer hover:bg-gray-100 hover:text-black"
              role="link"
              onClick={() => {
                router.push(`/floats/${backing.id}`);
              }}
              key={backing.id}
            >
              <TableCell>{backing.name}</TableCell>
              <TableCell>
                {backing.lastSession
                  ? formatDateStringToDDMM(backing.lastSession)
                  : 'No sessions played'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default BackingsList;
