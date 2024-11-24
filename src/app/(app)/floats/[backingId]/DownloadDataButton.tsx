"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { useParams } from "next/navigation";

function DownloadDataButton() {
  const { backingId } = useParams() as {
    backingId: string;
  };
  const trpcClient = trpc.useUtils();
  async function handleClick() {
    const { data: csv } = await trpcClient.backings.getAllBackings.fetch({
      backingId: Number(backingId),
    });
    // Download data as csv file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backing-history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <Button variant={"outline"} onClick={() => void handleClick()}>
      Download history as CSV
    </Button>
  );
}

export default DownloadDataButton;
