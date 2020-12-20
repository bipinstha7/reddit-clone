import { IsEmail, MinLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
} from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  /**
   * The constructor function is for new User({...})
   * by which we don't need to use
   * use.email = email; user.name = name
   */
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
