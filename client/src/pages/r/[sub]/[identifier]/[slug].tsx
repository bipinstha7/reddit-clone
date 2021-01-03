import PostFn from "components/post";
import SubSidebar from "components/subSidebar";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import { Post } from "types";

export default function PostPage() {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

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
              <div className="flex">
                <div className="pt-2">
                  <PostFn post={post} singlePost={true} />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* sidebar */}
        {post ? <SubSidebar sub={post.sub} /> : null}
      </div>
    </>
  );
}
