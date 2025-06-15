import { Type } from '@nestjs/common';
import * as Minio from 'minio';


export interface MinioModuleOptions extends Minio.ClientOptions {
    clientName?:string
}

export interface MinioOptionsFactory {
    createMinioOptions(): Promise<MinioModuleOptions>| MinioModuleOptions;
}

export interface MinioModuleAsyncOptions {
    clientName?:string
    useExisting?:Type<MinioOptionsFactory>
    useClass?:Type<MinioOptionsFactory>
    useFactory?:(...args:any[])=>Promise<MinioModuleOptions>|MinioModuleOptions
    inject?:any[]
}