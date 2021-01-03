import PostFn from "components/post";
import SubSidebar from "components/subSidebar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import dayjs from "dayjs";
import relativTime from "dayjs/plugin/relativeTime";
import { FormEvent, useState } from "react";

import { Comment, Post } from "types";
import CommentVote from "components/commentVote";
import { useAuthState } from "context/auth";
import useApi from "api/index";

dayjs.extend(relativTime);

export default function PostPage() {
  const { API } = useApi();
  const [comment, setComment] = useState("");
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, revalidate } = useSWR<Comment[]>(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      await API.post(`/posts/${post.identifier}/${post.slug}/comments`, {
        body: comment,
      });

      setComment("");

      revalidate();
    } catch (error) {
      console.log({ submitCommentError: error });
    }
  };

  if (error) return router.push("/");

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post ? (
                <div className="mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              ) : null}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post ? (
              <>
                <div className="flex">
                  <div className="pt-2">
                    <PostFn post={post} singlePost={true} />
                  </div>
                </div>
                {/* comment input area */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="font-semibold text-blue-500">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded outline-none focus: focus:border-gray-600"
                          onChange={e => setComment(e.target.value)}
                          value={comment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button className="px-3 py-1 blue button">
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 mr-4 border border-gray-200 rounded">
                      <p className="font-semibold text-gray-400">
                        Log in or sign up to leave a comment
                      </p>
                      <Link href="/login">
                        <a className="px-4 py-1 hollow blue button">Login</a>
                      </Link>
                      <Link href="/register">
                        <a className="px-4 py-1 blue button">Sign up</a>
                      </Link>
                    </div>
                  )}
                </div>
                <hr />
                {/* comments feed */}
                {comments?.map(comment => (
                  <div className="flex" key={comment.identifier}>
                    <CommentVote
                      comment={comment}
                      post={post}
                      revalidate={revalidate}
                    />
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`${comment.voteScore} points • ${dayjs(
                            comment.created_at
                          ).fromNow()}`}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>

        {/* sidebar */}
        {post ? <SubSidebar sub={post.sub} /> : null}
      </div>
    </>
  );
}
