import Link from "next/link";
import dayjs from "dayjs";
import relativTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativTime);

export default function PostHeader({ post }) {
  return (
    <div className="flex items-center">
      <Link href={`/r/${post.sub_name}`}>
        <img
          src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png"
          alt="reddit_image"
          className="w-6 h-6 mr-1 rounded-full cursor-pointer"
        />
      </Link>
      <Link href={`/r/${post.sub_name}`}>
        <a className="text-xs font-bold cursor-pointer hover:underline">
          /r/{post.sub_name}
        </a>
      </Link>
      <p className="text-xs text-gray-500">
        <span className="mx-1">•</span> Posted by
        <Link href={`/u/${post.username}`}>
          <a className="mx-1 hover:underline">/u/{post.username}</a>
        </Link>
        <Link href={`/r/${post.url}/`}>
          <a className="mx-1 hover:underline">
            {dayjs(post.created_at).fromNow()}
          </a>
        </Link>
      </p>
    </div>
  );
}
