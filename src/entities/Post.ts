import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { randomString, slugify } from "../utils/helper";
import Comment from "./Comment";

import CommonEntity from "./Entity";
import Sub from "./Sub";
import User from "./User";
import Vote from "./Vote";

@Entity("posts")
export default class Post extends CommonEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 character ID

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  sub_name: string;

  @Column()
  username: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, sub => sub.posts)
  @JoinColumn({ name: "sub_name", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @OneToMany(() => Vote, vote => vote.post)
  votes: Vote[];

  /* Either 1 or 2 works */
  /* 2 */
  // @Expose() get url(): string {
  //   return `/r/${this.sub_name}/${this.identifier}/${this.slug}`;
  // }

  /* 2 */
  protected url: string;
  @AfterLoad()
  createUrl() {
    this.url = `/r/${this.sub_name}/${this.identifier}/${this.slug}`;
  }

  protected commentCount: number;
  @AfterLoad()
  countComment() {
    this.commentCount = this.comments?.length;
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  protected voteScore: number;
  @AfterLoad()
  countVote() {
    this.voteScore = this.votes?.reduce(
      (prev, curr) => prev + (curr.value || 0),
      0
    );
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = randomString(7);
    this.slug = slugify(this.title);
  }
}
