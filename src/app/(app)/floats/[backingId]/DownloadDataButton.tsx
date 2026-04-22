"use client";

import { Button } from "@/components/ui/button";
import { toastDefaultError } from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

function DownloadDataButton() {
  const { backingId } = useParams() as { backingId: string };
  const [isLoading, setIsLoading] = useState(false);
  const trpcClient = trpc.useUtils();

  async function handleClick() {
    const parsedBackingId = parsePositiveInt(backingId);

    if (!parsedBackingId) {
      toastDefaultError("Invalid backing ID.");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="flex-1 gap-2"
      onClick={() => void handleClick()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Export CSV
    </Button>
  );
}

export default DownloadDataButton;
