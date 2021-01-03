import Link from "next/link";

import Vote from "components/vote";
import PostHeader from "components/postHeader";
import PostFooter from "components/postFooter";
import { Post } from "types";

interface PostProps {
  post: Post;
  singlePost?: boolean;
}

export default function PostFn({ post, singlePost }: PostProps) {
  return (
    <div className="flex mb-4 bg-white rounded">
      <Vote post={post} singlePost={singlePost} />
      <div className="w-full p-2">
        <PostHeader post={post} />
        <Link href={post.url}>
          <a className="my-1 text-lg font-medium">{post.title}</a>
        </Link>
        {post.body ? <p className="my-1 text-sm">{post.body}</p> : null}
        <PostFooter post={post} />
      </div>
    </div>
  );
}
