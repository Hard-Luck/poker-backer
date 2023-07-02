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
  const { mutate, isError: isCommentError } =
    api.sessions.createComment.useMutation();
  const [body, setBody] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const handleOnClick = () => {
    mutate({ session_id: +session_id, comment: body });
    setBody("");
  };
  if (isLoading) return <Loading />;
  if (isError) return <div>Error refresh page or contact admin</div>;
  if (!data) return <div>No comments</div>;

  return (
    <div>
      <h2>Comments</h2>
      {data.comments.map((comment) => {
        return (
          <div key={comment.id}>
            <p>{comment.user.username}</p>
            <p>{comment.body}</p>
          </div>
        );
      })}
      Add comment
      <input type="text" onChange={handleInput} value={body} />
      <button onClick={handleOnClick}>Add Comment</button>
      {isCommentError && <div>Message too short</div>}
    </div>
  );
}
