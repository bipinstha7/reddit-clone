import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { randomString } from "../utils/helper";

import CommonEntity from "./Entity";
import Post from "./Post";
import User from "./User";

@Entity("comments")
export default class Comment extends CommonEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, post => post.comments, { nullable: false })
  @JoinColumn({ name: "post_id", referencedColumnName: "id" })
  post: Post;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = randomString(8);
  }
}
