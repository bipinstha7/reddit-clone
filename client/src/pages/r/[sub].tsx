import { useRouter } from "next/router";
import useSWR from "swr";

import PostFn from "components/post";

export default function Sub() {
  const router = useRouter();
  const subName = router.query.sub;

  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  console.log({ error });

  if (error) {
    router.push("/");
  }

  let postMarkup;
  if (!sub) {
    postMarkup = <p className="text-lg text-center pt-14">Loading...</p>;
  } else if (!sub.posts.length) {
    postMarkup = <p className="text-lg text-center">No posts</p>;
  } else {
    postMarkup = sub.posts.map(post => (
      <PostFn key={post.identifier} post={post} />
    ));
  }

  return (
    <div className="container flex pt-5">
      {sub ? <div className="w-160">{postMarkup}</div> : null}
    </div>
  );
}
