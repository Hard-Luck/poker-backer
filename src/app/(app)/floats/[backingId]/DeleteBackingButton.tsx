"use client";

import { Button } from "@/components/ui/button";
import { toastDefaultError } from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { parsePositiveInt } from "@/models/utils/parse";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

const DeleteBackingButton = () => {
  const router = useRouter();
  const { backingId } = useParams() as { backingId: string };
  const [confirmNotice, setConfirmNotice] = useState(false);

  const { mutate: deleteBacking, isLoading } = trpc.backings.delete.useMutation({
    onSuccess: () => {
      router.push("/floats");
      router.refresh();
    },
    onError: () => {
      toastDefaultError("Failed to delete float, please try again later.");
    },
  });
  
  if (confirmNotice) {
    return (
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setConfirmNotice(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="flex-1 gap-2"
          disabled={isLoading}
          onClick={() => {
            const parsedBackingId = parsePositiveInt(backingId);
            if (!parsedBackingId) {
              toastDefaultError("Invalid backing ID.");
              return;
            }
            deleteBacking({ backingId: parsedBackingId });
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" />
              Confirm Delete
            </>
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      variant="destructive" 
      className="w-full gap-2"
      onClick={() => setConfirmNotice(true)}
    >
      <Trash2 className="h-4 w-4" />
      Delete Float
    </Button>
  );
};

export default DeleteBackingButton;
