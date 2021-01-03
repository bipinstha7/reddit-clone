import classnames from "classnames";
import { useRouter } from "next/router";

import useApi from "api/index";
import { useAuthState } from "context/auth";

export default function CommentVote({ post, comment, revalidate }) {
  const { API } = useApi();
  const { authenticated } = useAuthState();
  const router = useRouter();

  const vote = async value => {
    if (!authenticated) return router.push("/login");

    // If vote is same, reset vote
    if (value === comment.userVote) value = 0;

    try {
      const res = await API.post("/vote", {
        identifier: post.identifier,
        slug: post.slug,
        commentIdentifier: comment.identifier,
        value,
      });

      revalidate();
      console.log({ voteRes: res });
    } catch (error) {
      console.log({ voteError: error });
    }
  };
  return (
    <div className="flex-shrink-0 w-10 py-2 text-center rounded-1">
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray:300 hover:text-red-500"
        onClick={() => vote(1)}
      >
        <i
          className={classnames("fas fa-arrow-up", {
            "text-red-500": comment.userVote === 1,
          })}
        ></i>
      </div>
      <p className="text-xs font-bold">{comment.voteScore}</p>
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray:300 hover:text-blue-600"
        onClick={() => vote(-1)}
      >
        <i
          className={classnames("fas fa-arrow-down", {
            "text-blue-600": comment.userVote === -1,
          })}
        ></i>
      </div>
    </div>
  );
}
