"use client";
import { trpc } from "@/lib/trpc/client";
import { type FC, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { IoMdPersonAdd } from "react-icons/io";
import { toastDefaultError } from "../../../components/utils/default-toasts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FriendRequestWizard: FC = () => {
  const [searchString, setSearchString] = useState("");
  const [tempSearchString, setTempSearchString] = useState(""); // to prevent re-fetching on every key stroke
  const { data: users, isLoading } =
    trpc.users.getUserMatchingUserName.useQuery(searchString, {
      enabled: searchString.length > 2,
    });
  const [activeSearch, setActiveSearch] = useState(false);
  useEffect(() => {
    if (tempSearchString.length === 0) {
      setSearchString(tempSearchString);
    }
    const timeout = setTimeout(() => {
      setSearchString(tempSearchString);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [tempSearchString]);

  return (
    <section className="flex justify-end w-full">
      <div id="search" className="w-full max-w-md">
        <div className="flex justify-end gap-2">
          {searchString.length > 0 && (
            <Button
              onClick={() => void setTempSearchString("")}
              variant={"outline"}
            >
              X
            </Button>
          )}
          <Input
            value={tempSearchString}
            type="text"
            autoComplete="off"
            onChange={e => setTempSearchString(e.target.value)}
            onSelect={() => setActiveSearch(true)}
            className="text-right"
            placeholder="Search to add friends"
          />
        </div>
        <div className="absolute rounded-md w-full max-w-sm bg-secondary bg-opacity-100 opacity-100 z-50">
          {tempSearchString && isLoading ? (
            <div>Loading...</div>
          ) : !!users?.length && searchString.length > 2 && activeSearch ? (
            users.map(user => {
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-around w-full bg-secondary bg-opacity-100 opacity-100 p-1 gap-10 text-right"
                >
                  <Avatar>
                    <AvatarImage
                      src={user.img_url || undefined}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">{user.username}</div>
                  <SendFriedRequestButton friend_id={user.id} />
                </div>
              );
            })
          ) : (
            searchString && <p className="">No matches found</p>
          )}
        </div>
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
      <Button variant={"outline"} disabled={true}>
        Request Sent
      </Button>
    );
  return (
    <Button
      variant={"outline"}
      disabled={isLoading}
      className="justify-end gap-2"
      onClick={() => mutate({ friend_id: friend_id })}
    >
      <IoMdPersonAdd />
      Add
    </Button>
  );
};
