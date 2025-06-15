import { Client, ExecOptions } from "ssh2";
import { SshModuleOptions } from "./ssh.inerface";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
@Injectable()
export class SshService {
    private client=new Client();
    private isConnected=false;
    constructor(private options:SshModuleOptions){}

    async getClient(){
        await this.connect();
        return this.client;
    }

    async connect():Promise<any> {
        if(this.isConnected){
            return Promise.resolve();
        }
        const privateKey =  this.options.privateKey? fs.readFileSync(this.options.privateKey):undefined;
        return new Promise((resolve,reject)=>{
            this.client.on("ready",()=>{
                this.isConnected=true;
                resolve(true);
            })
            .on("error",(err)=>reject(err))
            .connect({...this.options,privateKey});
        })
    }

    async exec(command: string, options?: ExecOptions): Promise<any> {
        await this.connect();
        return new Promise((resolve, reject) => {
            this.client.exec(command, { pty: options?.pty||false }, (err, stream) => {  // 添加PTY配置
                if(err){
                    reject(err);
                }
                let result="";
                stream.on("data",(data)=>{
                    result+=data;
                })
                .on("close",(code,signal)=>{
                    resolve(result);
                })
            })
        })
    }
}