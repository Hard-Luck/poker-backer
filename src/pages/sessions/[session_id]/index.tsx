import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "~/components/Loading";
import { api } from "~/utils/api";

export default function Session() {
  const router = useRouter();
  const session_id = router.query.session_id as string;
  const { data, isError, isLoading } = api.sessions.listComments.useQuery({
    session_id: +session_id,
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error refresh page or contact admin</div>;
  if (!data) return <div>No comments</div>;

  return (
    <div>
      <button
        className="m-2 rounded-md border-2 p-2 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:hover:bg-gray-200"
        onClick={() => router.back()}
      >
        Go back to sessions list
      </button>
      <h2>Comments</h2>
      {data.comments.map((comment) => {
        return (
          <div key={comment.id}>
            <p>{comment.user.username}</p>
            <p>{comment.body}</p>
          </div>
        );
      })}
      <AddComment session_id={session_id} />
    </div>
  );
}

export function AddComment({ session_id }: { session_id: string }) {
  const ctx = api.useContext();
  const {
    mutate,
    isLoading,
    isError: isCommentError,
  } = api.sessions.createComment.useMutation({
    onSuccess: () => {
      void ctx.sessions.invalidate();
    },
  });
  const [body, setBody] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const handleOnClick = () => {
    mutate({ session_id: +session_id, comment: body });
    setBody("");
  };
  return (
    <div>
      Add comment
      <input type="text" onChange={handleInput} value={body} />
      <button
        className="m-2 rounded-md border-2 p-2 transition-colors duration-300 ease-in-out"
        disabled={!body || isLoading}
        onClick={handleOnClick}
      >
        Add Comment
      </button>
      {isCommentError && <div>Message too short</div>}
    </div>
  );
}
