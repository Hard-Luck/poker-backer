"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FC, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import DatePicker from "@/components/DataPicker";

type AddSessionFormProps = {
  backings: {
    id: number;
    name: string;
  }[];
};

const AddSessionForm: FC<AddSessionFormProps> = ({ backings }) => {
  const [selectedBacking, setSelectedBacking] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
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
    if (!selectedBacking) {
      toast.error("Please select a backing", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }
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
      backingId: selectedBacking,
    });
  }
  return (
    <section className="flex flex-col items-center gap-3">
      <h1>Add Session</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center max-w-xs gap-1.5">
        <div className="text-right w-full">
          <Select onValueChange={(value) => setSelectedBacking(value)}>
            <SelectTrigger className="max-w-[240px]">
              <SelectValue placeholder="Select To Add Session" />
            </SelectTrigger>
            <SelectContent>
              {backings.map((backing) => (
                <SelectItem key={backing.id} value={backing.id.toString()}>
                  {backing.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBacking !== null && (
            <Link
              href={`/floats/${selectedBacking}`}
              className="text-primary ">
              Click here to go to backing
            </Link>
          )}
        </div>
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
          <Label htmlFor="date">Date/Time</Label>
          <DatePicker date={date} setDate={setDate} />
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

export default AddSessionForm;
