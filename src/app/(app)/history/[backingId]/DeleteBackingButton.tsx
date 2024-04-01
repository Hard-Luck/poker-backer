import { Button } from "@/components/ui/button";
import { toastDefaultError } from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const DeleteBackingButton = () => {
  const router = useRouter();
  const { backingId } = useParams();
  console.log(backingId);
  const [confirmNotice, setConfirmNotice] = useState(false);

  const { mutate: deleteBacking, isLoading } = trpc.backings.delete.useMutation(
    {
      onSuccess: () => {
        router.push("/history");
        router.refresh();
      },
      onError: () => {
        toastDefaultError("Failed to delete backing, please try again later.");
      },
    }
  );
  function handleOriginalClick() {
    setConfirmNotice(true);
  }
  if (confirmNotice) {
    return (
      <div>
        <Button
          variant="destructive"
          onClick={() => deleteBacking({ backingId: Number(backingId) })}
          className="mr-2 w-[150px]">
          CONFIRM DELETE
        </Button>
      </div>
    );
  }
  return (
    <Button className="mr-2 w-[150px]" onClick={handleOriginalClick}>
      DELETE BACKING
    </Button>
  );
};

export default DeleteBackingButton;
