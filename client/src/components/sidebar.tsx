import useSWR from "swr";
import Image from "next/image";

import { Sub } from "types";
import Link from "next/link";

export default function Sidebar() {
  const { data: topSubs } = useSWR("/subs/top-subs");
  return (
    <div className="ml-6 w-80">
      <div className="bg-white rounded">
        <div className="p-4 border-b-2">
          <p className="text-lg font-semibold text-center">Top Communities</p>
        </div>
      </div>
      {topSubs?.map((sub: Sub) => (
        <div
          key={sub.name}
          className="flex items-center px-4 py-2 text-xs border-b"
        >
          <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
            <Link href={`/r/${sub.name}`}>
              <Image
                src={sub.imageUrl}
                alt="sub"
                width={(6 * 16) / 4}
                height={(6 * 16) / 4}
              />
            </Link>
          </div>
          <Link href={`/r/${sub.name}`}>
            <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
          </Link>
          <p className="ml-auto font-med">{sub.postCount}</p>
        </div>
      ))}
    </div>
  );
}
