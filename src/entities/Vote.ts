import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import CommonEntity from "./Entity";
import Post from "./Post";
import User from "./User";
import Comment from "./Comment";

@Entity("votes")
export default class Vote extends CommonEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: Post;

  @ManyToOne(() => Comment)
  @JoinColumn({ name: "comment_id", referencedColumnName: "id" })
  comment: Comment;
}
