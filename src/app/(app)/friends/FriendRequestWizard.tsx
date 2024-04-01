"use client";
import { trpc } from "@/lib/trpc/client";
import { FC, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import placeHolderImage from "../../../../public/defaultUser.jpg";
import Image from "next/image";
import { IoMdPersonAdd } from "react-icons/io";
import { toastDefaultError } from "../../../components/utils/default-toasts";

const FriendRequestWizard: FC = () => {
  const [searchString, setSearchString] = useState("");
  const [tempSearchString, setTempSearchString] = useState(""); // to prevent re-fetching on every key stroke
  const { data: users, isLoading } =
    trpc.users.getUserMatchingUserName.useQuery(searchString);
  const [activeSearch, setActiveSearch] = useState(false);
  useEffect(() => {
    if (tempSearchString.length === 0) {
      setSearchString(tempSearchString);
    }
    const timeout = setTimeout(() => {
      if (tempSearchString.length > 2) {
        setSearchString(tempSearchString);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [tempSearchString]);

  return (
    <section>
      <Input
        value={tempSearchString}
        type="text"
        autoComplete="off"
        onChange={(e) => setTempSearchString(e.target.value)}
        onSelect={() => setActiveSearch(true)}
        className="text-right"
        placeholder="Search to add friends"
      />
      <div className="absolute rounded-md max-w-full content-end bg-secondary  bg-opacity-100 opacity-100 z-50">
        {tempSearchString && isLoading ? (
          <div>Loading...</div>
        ) : !!users?.length && searchString.length > 2 && activeSearch ? (
          users.map((user) => {
            return (
              <div
                key={user.id}
                className="flex items-center justify-around max-w-full bg-secondary bg-opacity-100 opacity-100 p-1 gap-10 text-right">
                <Image
                  src={user.img_url || placeHolderImage}
                  alt={user.img_url ? user.username : "no image"}
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
                <div className="ml-2">{user.username}</div>
                <SendFriedRequestButton friend_id={user.id} />
              </div>
            );
          })
        ) : (
          searchString && <p className="">No matches found</p>
        )}
      </div>
    </section>
  );
};

export default FriendRequestWizard;
type SendFriedRequestButtonProps = {
  friend_id: string;
};
const SendFriedRequestButton: FC<SendFriedRequestButtonProps> = ({
  friend_id,
}) => {
  const [sentrequest, setSentRequest] = useState(false);

  const { mutate, isLoading } = trpc.friendships.create.useMutation({
    onSuccess: () => {
      setSentRequest(true);
    },
    onError: () => {
      toastDefaultError("Failed to send friend request, please try again.");
    },
  });
  if (sentrequest)
    return (
      <Button variant={"ghost"} disabled={true}>
        Request Sent
      </Button>
    );
  return (
    <Button
      variant={"default"}
      disabled={isLoading}
      className="justify-end gap-2"
      onClick={() => mutate({ friend_id: friend_id })}>
      <IoMdPersonAdd />
      Add
    </Button>
  );
};
