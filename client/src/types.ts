import { StringifyOptions } from "querystring";

export interface Post {
  id: Number;
  identifier: string;
  title: string;
  slug: string;
  sub_name: string;
  username: string;
  body?: string;
  created_at: string;
  updated_at: string;

  // virtual field
  url: string;
  voteScore?: Number;
  commentCount?: Number;
  useVote?: Number;
}

export interface User {
  username: string;
  email: string;
  // created_at: string;
  // updated_at: string;
}

export interface Sub {
  title: string;
  name: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  created_at: string;
  updated_at: string;
  posts: Post[];
  // virtuals
  imageUrl: string;
  bannerUrl: string;
}
