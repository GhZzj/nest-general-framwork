import { Exclude } from "class-transformer"

export class CreateUserVo{
    id:string
    username:string
    @Exclude()
    password
}
