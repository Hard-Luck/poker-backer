import { useRouter } from 'next/router';
import { useState } from 'react';
import Loading from '~/components/Loading';
import { api } from '~/utils/api';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import placeHolderImage from '../../../../public/defaultUser.jpg';
import Image from 'next/image';

export default function Session() {
  const router = useRouter();
  const session_id = router.query.session_id as string;
  const { data, isError, isLoading } = api.sessions.listComments.useQuery({
    session_id: +session_id,
  });

  if (isLoading) return <Loading />;
  if (isError) return <div>Error refresh page or contact admin</div>;
  if (!data) return <div>No comments</div>;

  const imageStyle = { borderRadius: '50%' };

  return (
    <div className="h-[calc(100vh-4rem)] bg-theme-black text-white">
      <button
        className="m-2 rounded-lg bg-theme-header p-2 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:hover:bg-gray-200"
        onClick={() => router.back()}
      >
        <FiArrowLeft />
      </button>
      <div className="flex flex-col">
        <h2 className="flex justify-center text-2xl">Comments</h2>
        {data.comments.map(comment => {
          return (
            <div
              className="m-2 grid grid-cols-10 rounded-lg bg-theme-grey p-2"
              key={comment.id}
            >
              <div className="flex items-center">
                <Image
                  alt={`${comment.user.username}'s profile picture`}
                  src={comment.user.img_url || placeHolderImage}
                  style={imageStyle}
                  height={0}
                  width={30}
                  className="col-span-1"
                />
              </div>
              <div className="col-span-9">
                <p className="mx-2 text-xs font-bold">
                  {comment.user.username}
                </p>
                <p className="mx-2">{comment.body}</p>
              </div>
            </div>
          );
        })}
      </div>
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
  const [body, setBody] = useState('');
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBody(e.target.value);
  };
  const handleOnClick = () => {
    mutate({ session_id: +session_id, comment: body });
    setBody('');
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
        onClick={handleOnClick}
      >
        <FiSend />
      </button>
      {isCommentError && <div>Message too short</div>}
    </div>
  );
}
