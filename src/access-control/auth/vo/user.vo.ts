import { Exclude, Expose } from "class-transformer";
export class UserVo {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Exclude()
  password: string;
  constructor(partial: Partial<UserVo>) {
    Object.assign(this, partial);
  }
}

