"use client";
import DatePicker from "@/components/DataPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { parsePositiveInt } from "@/models/utils/parse";
import { trpc } from "@/lib/trpc/client";
import { useParams } from "next/navigation";
import { type FC, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  DollarSign,
  Clock,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";

const AddSessionSidePanel = () => {
  return (
    <Card className="h-full border-border hover:border-primary transition-colors">
      <CardContent className="p-0 h-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-full flex flex-col items-center justify-center gap-2 py-4"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Add Session</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Session
              </SheetTitle>
            </SheetHeader>
            <AddSessionForm />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default AddSessionSidePanel;

const AddSessionForm: FC = () => {
  const { backingId } = useParams() as { backingId: string };
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [length, setLength] = useState("");

  const { mutate, isLoading } = trpc.sessions.create.useMutation({
    onSuccess: () => {
      setDate(new Date());
      setLocation("");
      setAmount("");
      setLength("");
      toast.success("Session Added", {
        duration: 2000,
        position: "top-center",
      });
    },
    onError: error => {
      console.error(error);
      toast.error(error.message, {
        duration: 2000,
        position: "top-center",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!amount) {
      toast.error("Please enter an amount", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }
    if (!length) {
      toast.error("Please enter a length", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }
    const parsedBackingId = parsePositiveInt(backingId);
    const parsedAmount = Number(amount);
    const parsedLength = Number(length);

    if (!parsedBackingId) {
      toast.error("Invalid backing ID", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    if (!Number.isFinite(parsedAmount)) {
      toast.error("Please enter a valid amount", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      toast.error("Please enter a valid session length", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }

    mutate({
      amount: parsedAmount,
      length: parsedLength,
      date,
      location,
      backingId: String(parsedBackingId),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Amount
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            £
          </span>
          <Input
            id="amount"
            className="pl-7"
            placeholder="0"
            value={amount}
            onChange={e => {
              if (e.target.value.match(/^-?[0-9]*$/)) {
                setAmount(e.target.value);
              }
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Use negative values for losses
        </p>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          Date & Time
        </Label>
        <DatePicker date={date} setDate={setDate} />
      </div>

      {/* Session Length */}
      <div className="space-y-2">
        <Label htmlFor="length" className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Session Length (minutes)
        </Label>
        <Input
          id="length"
          placeholder="180"
          value={length}
          onChange={e => {
            if (e.target.value.match(/^[0-9]*$/)) {
              setLength(e.target.value);
            }
          }}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Location
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="location"
          placeholder="e.g. Aria Casino"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Add Session
          </>
        )}
      </Button>
    </form>
  );
};
