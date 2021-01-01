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
}
