import { ModuleMetadata, Type } from "@nestjs/common";
import { ConnectConfig } from "ssh2";

export interface SshModuleOptions extends ConnectConfig{
    connectionName?:string
}

export interface SshOptionsFactory {
    createSshOptions():Promise<SshModuleOptions>|SshModuleOptions
}

export interface SshModuleAsyncOptions extends Pick<ModuleMetadata,"imports"> {
    useExisting?:Type<SshOptionsFactory>
    useClass?:Type<SshOptionsFactory>
    useFactory?:(...args:any[])=>Promise<SshModuleOptions>|SshModuleOptions
    inject?:any[]
}