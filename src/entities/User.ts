import { IsEmail, Length, MinLength } from "class-validator";
import { Entity, Column, Index, OneToMany } from "typeorm";
import { classToPlain, Exclude } from "class-transformer";

import CommonEntity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export default class User extends CommonEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Column({ unique: true })
  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 255, { message: "Email is empty" })
  email: string;

  @Index()
  @Length(3, 255, { message: "Must be atleast 3 characters" })
  @Column({ unique: true })
  @MinLength(3)
  username: string;

  @Exclude()
  @Column()
  @MinLength(6)
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await argon2.hash(this.password)
  // }

  toJSON() {
    return classToPlain(this);
  }
}
