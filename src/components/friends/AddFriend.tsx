import { useState } from "react";
import { api } from "~/utils/api";
import ConfirmButton from "../confirm-button/ConfirmButton";
import ReactModal from "react-modal";

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

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Add Friend
      </button>

      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="border-2 border-black p-4">
          <button onClick={closeModal} className="border-2 border-black">
            Close
          </button>

          <div className="">
            <input
              type="text"
              value={search}
              onChange={handleChange}
              placeholder="Search for friends"
              className="border-2 border-black"
            />
            <button onClick={handleClick} className="border-2 border-black">
              Search
            </button>
            {data &&
              data.map((person) => {
                return (
                  <div
                    key={person.id}
                    className="mb-2 flex items-center justify-between rounded bg-white p-1 shadow"
                  >
                    <p className="text-lg font-semibold">{person.username}</p>
                    <AddFriendButton friend_id={person.id} />
                  </div>
                );
              })}
            {searched && data?.length === 0 && (
              <p className="text-red-500">No results</p>
            )}
          </div>
        </div>
      </ReactModal>
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
    isSuccess,
  } = api.friends.create.useMutation();
  if (isSuccess) {
    void ctx.friends.invalidate();
  }
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
        buttonLabel="AddFriend"
        confirmMessage="Send Friend Request"
      />
    );
  return null;
}
