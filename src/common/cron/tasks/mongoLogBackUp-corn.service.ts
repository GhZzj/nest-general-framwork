import { SshService } from "@/utils/ssh/ssh.service";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class MongoLogBackUpCornService {
    @Inject("MONGO_SSH")
    private readonly mongoSSH:SshService;
    //每十秒执行一次
    //@Cron("*/10 * * * * *")
    async backUpMongoLogCron() {
        //备份：连接到mongoDB并导出对应db中collection的数据
        //滚动记录：删除已有的collection数据
        const containerName= 'mongo'
        const dbName = 'nest-log'
        const uri = 'mongodb://root:123456@localhost:27017/nest-log'
        let timestamp = new Date().getTime()
        const outputPath = '/tmp/logs-'+timestamp
        const collectionName = 'log'
        const cmd = `docker exec -i ${containerName} mongodump --uri=${uri}  --db=${dbName} --collection=${collectionName} --out=${outputPath}`
        const hostBackUpPath= "/srv/logs"
        const copyCmd = `docker cp ${containerName}:${outputPath} ${hostBackUpPath}`
        //const res =await this.mongoSSH.exec(`${cmd} && ${copyCmd}`,{pty:true});
       // const res1 = await this.mongoSSH.exec(`ls -la ${hostBackUpPath}`,{pty:true})
       const res = await this.mongoSSH.exec(`docker exec -it mongo ls -la `,{pty:true})//docker exec -it 52bd573cb301 ls -la
       console.log(res)
       // console.log(res1)
    }
}