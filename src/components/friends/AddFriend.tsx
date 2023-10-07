import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";
import {
  BsPersonFillAdd,
  BsXCircleFill,
  BsSearch,
  BsPersonPlusFill,
} from "react-icons/bs";
import { toastDefaultSuccess } from "../utils/default-toasts";
import { toast } from "sonner";

export default function AddFriend() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);

  const { data } = api.users.getUserByUsername.useQuery({
    username,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.currentTarget.value;
    setSearch(searchTerm);
  }

  function handleClick() {
    if (search.length > 2) {
      setUsername(search);
      setSearched(true);
    }
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  return (
    <div className="">
      <div className="absolute right-0 top-2.5 flex justify-end pr-4">
        <button
          onClick={toggleModal}
          className="rounded-lg bg-theme-header px-4 py-2 text-2xl text-white transition duration-300"
        >
          {modalOpen ? <BsXCircleFill /> : <BsPersonFillAdd />}
        </button>
      </div>

      {modalOpen && (
        <div className="m-4 rounded-lg bg-theme-grey p-2">
          <div className="flex justify-center p-2 text-theme-black">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search for friends"
              className="w-full rounded-l-lg pl-4 "
            />
            <button
              onClick={handleClick}
              className="rounded-r-lg bg-white p-4 text-xl text-theme-header"
            >
              <BsSearch />
            </button>
          </div>
          {data &&
            data.map((person) => {
              return (
                <div
                  key={person.id}
                  className="m-2 flex items-center justify-between rounded-lg bg-white p-2 text-theme-black"
                >
                  <p className="text-lg font-semibold">{person.username}</p>
                  <AddFriendButton friend_id={person.id} />
                </div>
              );
            })}
          {searched && data?.length === 0 && (
            <p className="p-4 text-center text-theme-red">No results</p>
          )}
        </div>
      )}
    </div>
  );
}
export function AddFriendButton({ friend_id }: { friend_id: string }) {
  const { data: status, isLoading } = api.friends.getFriendStatus.useQuery({
    friend_id,
  });
  const ctx = api.useContext();
  const {
    mutate,
    isLoading: disabled,
    data,
  } = api.friends.create.useMutation({
    onSuccess: () => {
      toast.message("Friend request sent", {
        duration: 3000,
        position: "bottom-center",
      });
      ctx.friends.invalidate();
    },
  });

  if (isLoading) return null;
  if (data) return <p>{data.status ? "Friend" : "Pending"}</p>;
  if (status === true) return <p>Friend</p>;
  if (status === false) return <p>Pending</p>;
  if (status === null)
    return (
      <ConfirmButton
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        disabled={disabled}
        onConfirm={() => mutate({ friend_id })}
        buttonLabel={<BsPersonPlusFill />}
        confirmMessage="Send Friend Request"
      />
    );
  return null;
}
