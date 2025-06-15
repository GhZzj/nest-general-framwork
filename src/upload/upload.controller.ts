import { Body, Controller, FileTypeValidator, Inject, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { destinationPath, storage } from './upload.storage';
import { MINIO_CLIENT } from '@/integrations/oss/minio/minio.constant';
import  * as Minio from 'minio';
import multer from 'multer';
import { RateLimit, RateLimitType } from '@/common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '@/common/guards/rate-limit.guard';

@Controller('upload')
export class UploadController {
  @Inject(MINIO_CLIENT)
  private readonly minioClient: Minio.Client
  constructor(private readonly uploadService: UploadService) {}


  /**
   * 生成预签名上传URL（限制上传权限）而且前端可以直接使用该URL上传文件到OSS
   * @param objectName 前端指定的文件对象名（或后端生成唯一名称）
   * @param expires 签名有效期（秒，默认15分钟）
   * @param contentType 限制的文件类型（如image/jpeg，可选）
   */
  @Post('minio/presigned-url')
  @RateLimit({ duration: 5, limit: 1 ,type:RateLimitType.USER})// 设置每5秒最多1次请求
  async getPresignedUploadUrl(
    @Query('objectName') objectName: string, 
    @Query('expires') expires: number = 900,  // 默认15分钟（900秒）
  ) {
    // 校验objectName合法性（防止路径遍历攻击）
    if (!/^[a-zA-Z0-9_.-]+$/.test(objectName)) {
      throw new Error('无效的文件对象名');
    }
    // 生成唯一文件名
    //const targetName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + objectName; // 生成唯一文件名
    // 生成预签名PUT URL
    const presignedUrl = await this.minioClient.presignedPutObject(
      'nest',  // 存储桶名称
      objectName,  // MinIO中的对象名
      expires,  // 有效期（秒）
    );

    return { 
      message: '预签名URL生成成功',
      presignedUrl: presignedUrl,
      expiresAt: new Date(Date.now() + expires * 1000)  // 有效期截止时间
    };
  }

  @Post('minio')
  @UseInterceptors(FileInterceptor('file', {
     // 使用内存存储（文件内容保存在内存Buffer中，不写入磁盘）
     storage: multer.memoryStorage(),
  }))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),//限制文件大小不超过5M
    ],
})) file: Express.Multer.File, @Body() body) {
      // console.log('file', file);
      // 直接使用内存中的文件Buffer上传至MinIO
      const objectName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname; // 生成唯一文件名
      //将得到的文件再上传到Minio中 直接使用内存中的文件Buffer上传至MinIO
      let res= await this.minioClient.putObject('nest', objectName, file.buffer,file.size,{ 'Content-Type': file.mimetype } );
      const fileUrl = await this.minioClient.presignedGetObject('nest', objectName); // 获取文件的预签名URL
      return { 
        minioInfo: res,
        fileUrl: fileUrl
      };
  }

  @Post("local")
  @UseInterceptors(FileInterceptor('file', {
    storage: storage,//使用自定义的存储方式
    //dest: 'uploads' //指定上传文件的目录
  }))
  async uploadFileToLocal(@UploadedFile(new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),//限制文件大小不超过5M
      //new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  })) file: Express.Multer.File, @Body() body) {
      console.log('body', body);
      console.log('file', file);
      return {
        fileUrl: file.path
      }
  }

}
