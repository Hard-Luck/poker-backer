"use client";
import { type FC, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  toastDefaultError,
  toastDefaultSuccess,
} from "../../../components/utils/default-toasts";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

const CreateBackingWizard: FC = () => {
  const [open, setOpen] = useState(false);
  const [newPot, setNewPot] = useState({ name: "", float: "" });
  const router = useRouter();
  const { mutate, isLoading } = trpc.backings.create.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  function handleSuccess() {
    setNewPot({ name: "", float: "" });
    toastDefaultSuccess("Float created successfully");
    setOpen(false);
    router.refresh();
  }

  function handleError() {
    toastDefaultError("Error creating float. Could be duplicate name.");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, float } = newPot;
    const parsedFloat = Number(float);

    if (!name.trim()) {
      toastDefaultError("Please enter a name for the float.");
      return;
    }

    if (!Number.isFinite(parsedFloat)) {
      toastDefaultError("Please enter a valid float amount.");
      return;
    }

    mutate({ name: name.trim(), float: parsedFloat });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Float</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Float</DialogTitle>
          <DialogDescription>
            Set up a new backing arrangement. Enter a name and starting float
            amount.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Vegas Trip 2026"
              value={newPot.name}
              onChange={e => setNewPot({ ...newPot, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="float">Starting Float</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="float"
                type="number"
                placeholder="0.00"
                className="pl-7"
                value={newPot.float}
                onChange={e => setNewPot({ ...newPot, float: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Float"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBackingWizard;
