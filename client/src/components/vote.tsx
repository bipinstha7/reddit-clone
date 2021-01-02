import useApi from "api/index";
import classnames from "classnames";

export default function Vote({ post }) {
  const { API } = useApi();

  console.log({ post });

  const vote = async value => {
    try {
      const res = API.post("/vote", {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });

      console.log({ voteRes: res });
    } catch (error) {
      console.log({ voteError: error });
    }
  };
  return (
    <div className="w-10 py-3 text-center bg-gray-200 rounded-1">
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray:300 hover:text-red-500"
        onClick={() => vote(1)}
      >
        <i
          className={classnames("fas fa-arrow-up", {
            "text-red-500": post.userVote === 1,
          })}
        ></i>
      </div>
      <p className="text-xs font-bold">{post.voteScore}</p>
      <div
        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hove:bg-gray:300 hover:text-blue-600"
        onClick={() => vote(-1)}
      >
        <i
          className={classnames("fas fa-arrow-down", {
            "text-blue-600": post.userVote === -1,
          })}
        ></i>
      </div>
    </div>
  );
}
