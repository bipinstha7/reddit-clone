import { IsEmail, MinLength } from "class-validator";
import { Entity, Column, Index, OneToMany } from "typeorm";

import CommonEntity from "./Entity";
import Post from "./Post";

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
  @IsEmail()
  email: string;

  @Index()
  @Column({ unique: true })
  @MinLength(3)
  username: string;

  @Column()
  @MinLength(6)
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  // @BeforeInsert()
  // async hashPassword() {
  //   this.password = await argon2.hash(this.password)
  // }
}
