import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import CommonEntity from "./Entity";
import Post from "./Post";
import User from "./User";

@Entity("subs")
export default class Sub extends CommonEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(post: Partial<Sub>) {
    super();
    Object.assign(this, post);
  }

  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string; // image unique resource name

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, post => post.sub)
  posts: Post[];
}
