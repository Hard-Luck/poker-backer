"use client";
import DatePicker from "@/components/DataPicker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "sonner";

const AddSessionSidePanel = () => {
  return (
    <div className="flex justify-center p-2">
      <Sheet>
        <Button asChild>
          <SheetTrigger>
            <IoMdAdd className="w-6 h-6" />
            Add Session
          </SheetTrigger>
        </Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Session</SheetTitle>
            <AddSessionForm />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AddSessionSidePanel;

const AddSessionForm: FC = () => {
  const { backingId } = useParams() as { backingId: string };
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [amount, setAmount] = useState("");
  const [length, setLength] = useState("");
  const { mutate } = trpc.sessions.create.useMutation({
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
    onError: (error) => {
      console.clear();
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
    mutate({
      amount: parseInt(amount),
      length: parseInt(length),
      date,
      location,
      backingId,
    });
  }
  return (
    <section className="flex flex-col items-center gap-3">
      <h1>Add Session</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center max-w-xs gap-1.5">
        <div className="grid  items-center gap-1.5 text-right my-8">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            className="text-right"
            value={amount}
            onChange={(e) => {
              if (e.target.value.match(/^-?[0-9]*$/)) {
                setAmount(e.target.value);
              }
            }}
          />
          <Label htmlFor="date">Date/Time</Label>
          <DatePicker date={date} setDate={setDate} />
          <Label htmlFor="length">Session Length</Label>
          <Input
            id="length"
            value={length}
            className="text-right"
            onChange={(e) => {
              if (e.target.value.match(/^[0-9]*$/)) {
                setLength(e.target.value);
              }
            }}
          />
          <Label htmlFor="location">Location (optional)</Label>
          <Input
            id="location"
            className="text-right"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit">Add Session</Button>
      </form>
      <div>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: "outline" })}>
          Back to dashboard
        </Link>
      </div>
    </section>
  );
};
