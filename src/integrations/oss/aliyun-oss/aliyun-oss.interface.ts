import { Inject, Type } from '@nestjs/common';
import OSS from 'ali-oss';


export interface AliyunOssModuleOptions extends OSS.Options{
    clientName?: string;
}

export interface AliyunOssOptionsFactory {
    createAliyunOssOptions(): Promise<AliyunOssModuleOptions>|AliyunOssModuleOptions;
}

export interface AliyunOssModuleAsyncOptions {
    clientName?: string;
    useFactory?: (...args: any[]) => Promise<AliyunOssModuleOptions>|AliyunOssModuleOptions;
    useClass?:Type<AliyunOssOptionsFactory>;
    useExisting?:Type<AliyunOssOptionsFactory>;
    inject?:any[];
}