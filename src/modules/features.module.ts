import { Module } from "@nestjs/common";
import { UploadModule } from "./upload/upload.module";
//业务模块合集
@Module({
    imports:[UploadModule]
})
export class FeaturesModule{}