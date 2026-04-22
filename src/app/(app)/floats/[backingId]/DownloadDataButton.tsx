"use client";

import { Button } from "@/components/ui/button";
import { toastDefaultError } from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams } from "next/navigation";

function DownloadDataButton() {
  const { backingId } = useParams() as {
    backingId: string;
  };
  const trpcClient = trpc.useUtils();
  async function handleClick() {
    const parsedBackingId = parsePositiveInt(backingId);

    if (!parsedBackingId) {
      toastDefaultError("Invalid backing ID.");
      return;
    }

    try {
      const { data: csv } = await trpcClient.backings.getAllBackings.fetch({
        backingId: parsedBackingId,
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "backing-history.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toastDefaultError("Failed to download backing history.");
    }
  }

  return (
    <Button variant={"outline"} onClick={() => void handleClick()}>
      Download history as CSV
    </Button>
  );
}

export default DownloadDataButton;
