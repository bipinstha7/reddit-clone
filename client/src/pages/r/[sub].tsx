import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import classnames from "classnames";

import PostFn from "components/post";
import Head from "next/head";
import { Sub } from "types";
import { ChangeEvent, createRef, useEffect, useState } from "react";
import { useAuthState } from "context/auth";
import useApi from "api";

export default function SubPage() {
  const { API } = useApi();
  const fileInputRef = createRef<HTMLInputElement>();
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const subName = router.query.sub;

  const [ownSub, setOwnSub] = useState(false);

  const { data: sub, error, revalidate } = useSWR<Sub>(
    subName ? `/subs/${subName}` : null
  );

  useEffect(() => {
    if (!sub) return;

    console.log({ user });
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;

    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await API.post(`/subs/${sub.name}/image`, formData);

      revalidate();
    } catch (error) {
      console.log({ imageUploadError: error });
    }
  };

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
    <>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub ? (
        <>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* sub info and images */}
          <div>
            {/* Banner image */}
            <div
              className={classnames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ) : (
                <div className="w-full h-20 bg-blue-500"></div>
              )}
            </div>
            {/* sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    width={80}
                    height={80}
                    className={classnames("rounded-full", {
                      "cursor-pointer": ownSub,
                    })}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-2 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-600">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="container flex pt-5">
            {/* posts and sidebar */}
            <div className="w-160">{postMarkup}</div>
          </div>
        </>
      ) : null}
    </>
  );
}
