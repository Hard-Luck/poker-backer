"use client";

import {
  toastDefaultError,
  toastDefaultSuccess,
} from "@/components/utils/default-toasts";
import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiSend } from "react-icons/fi";

const AddComment = () => {
  const router = useRouter();
  const sessionId = +useParams().sessionId;
  const { mutate, isLoading } = trpc.comments.create.useMutation({
    onSuccess: () => {
      toastDefaultSuccess("Comment added");
      router.refresh();
      setBody("");
    },
    onError: (err) => {
      toastDefaultError(err.message);
    },
  });
  const [body, setBody] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const handleOnClick = () => {
    mutate({ sessionId, body });
  };
  return (
    <div className="m-2 flex justify-center rounded-lg bg-theme-grey p-2 text-theme-black">
      <input
        className="rounded-l-lg p-2"
        type="text"
        onChange={handleInput}
        value={body}
      />
      <button
        className=" rounded-r-lg bg-theme-header p-2 text-2xl text-white transition-colors duration-300 ease-in-out"
        disabled={!body || isLoading}
        onClick={handleOnClick}>
        <FiSend />
      </button>
    </div>
  );
};

export default AddComment;
