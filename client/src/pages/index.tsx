import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativTime from "dayjs/plugin/relativeTime";

import useApi from "api/index";
import { Post } from "types";

dayjs.extend(relativTime);

export default function Home() {
  const { API } = useApi();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    API.get("/posts")
      .then((res: any) => {
        setPosts(res.data);
      })
      .catch(err => {
        console.log({ getPostError: err });
      });
  }, []);
  return (
    <div className="pt-12">
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post Feed */}
        <div className="w-160">
          {posts.map(post => (
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* Vote section */}
              <div className="w-10 text-center bg-gray-200 rounded-1">
                <p>V</p>
              </div>
              {/* Post section */}
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.sub_name}`}>
                    <>
                      <img
                        src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png"
                        alt="reddit_image"
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                      />
                      <a className="text-xs font-bold cursor-pointer hover:underline">
                        /r/{post.sub_name}
                      </a>
                    </>
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
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body ? <p className="my-1 text-sm">{post.body}</p> : null}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="fas fa-comment-alt fa-xs"></i>
                        <span className="ml-1 font-bold">222 Comments</span>
                      </div>
                    </a>
                  </Link>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="fas fa-share fa-xs"></i>
                    <span className="ml-1 font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="fas fa-bookmark fa-xs"></i>
                    <span className="ml-1 font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
}

/* server side rendering */
// export default function Home({ posts }) {
//   console.log({ posts });
//   return (
//     <div className="pt-12">
//       <Head>
//         <title>reddit: the front page of the internet</title>
//       </Head>
//       <div className="container flex pt-4">
//         {/* Post Feed */}
//         <div className="w-160">
//           {posts.map(post => (
//             <div key={post.identifier} className="flex mb-4 bg-white rounded">
//               {/* Vote section */}
//               <div className="w-10 text-center bg-gray-200 rounded-1">
//                 <p>V</p>
//               </div>
//               {/* Post section */}
//               <div className="w-full p-2">
//                 <div className="flex items-center">
//                   <Link href={`/r/${post.sub_name}`}>
//                     <>
//                       <img
//                         src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png"
//                         alt="reddit_image"
//                         className="w-6 h-6 mr-1 rounded-full cursor-pointer"
//                       />
//                       <a className="text-xs font-bold cursor-pointer hover:underline">
//                         /r/{post.sub_name}
//                       </a>
//                     </>
//                   </Link>
//                   <p className="text-xs text-gray-500">
//                     <span className="mx-1">•</span> Posted by
//                     <Link href={`/u/${post.username}`}>
//                       <a className="mx-1 hover:underline">/u/{post.username}</a>
//                     </Link>
//                     <Link href={`/r/${post.url}/`}>
//                       <a className="mx-1 hover:underline">
//                         {dayjs(post.created_at).fromNow()}
//                       </a>
//                     </Link>
//                   </p>
//                 </div>
//                 <Link href={post.url}>
//                   <a className="my-1 text-lg font-medium">{post.title}</a>
//                 </Link>
//                 {post.body ? <p className="my-1 text-sm">{post.body}</p> : null}
//                 <div className="flex">
//                   <Link href={post.url}>
//                     <a>
//                       <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
//                         <i className="fas fa-comment-alt fa-xs"></i>
//                         <span className="ml-1 font-bold">222 Comments</span>
//                       </div>
//                     </a>
//                   </Link>
//                   <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
//                     <i className="fas fa-share fa-xs"></i>
//                     <span className="ml-1 font-bold">Share</span>
//                   </div>
//                   <div className="px-1 py-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
//                     <i className="fas fa-bookmark fa-xs"></i>
//                     <span className="ml-1 font-bold">Save</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Sidebar */}
//       </div>
//     </div>
//   );
// }

// import axios from "axios";
// export async function getServerSideProps(context) {
//   // const { API } = useApi();
//   try {
//     // const res: any = await API.get("/posts");
//     const res: any = await axios.get("http://localhost:4000/api/v1/posts");
//     console.log({ res });
//     return { props: { posts: res.data.data } };
//   } catch (error) {
//     console.log({ ssrError: error });
//     return { props: { error: "ddd" } };
//   }
// }
