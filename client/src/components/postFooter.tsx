import Link from "next/link";

import PostFooterItem from "components/postFooterItem";

export default function PostFooter({ post }) {
  return (
    <div className="flex">
      <Link href={post.url}>
        <a>
          <PostFooterItem>
            <i className="fas fa-comment-alt fa-xs"></i>
            <span className="ml-1 font-bold">{post.commentCount} Comments</span>
          </PostFooterItem>
        </a>
      </Link>
      <PostFooterItem>
        <i className="fas fa-share fa-xs"></i>
        <span className="ml-1 font-bold">Share</span>
      </PostFooterItem>
      <PostFooterItem>
        <i className="fas fa-bookmark fa-xs"></i>
        <span className="ml-1 font-bold">Save</span>
      </PostFooterItem>
    </div>
  );
}
