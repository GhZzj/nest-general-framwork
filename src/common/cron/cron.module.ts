import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { SshModule } from '@/utils/ssh/ssh.module';
import { MongoLogBackUpCornService } from './tasks/mongoLogBackUp-corn.service';

@Module({
    imports:[ScheduleModule.forRoot(),SshModule.forRootAsync({
      useFactory: () => {
          return {
            username:"Administrator",
            password:"qwe85775960",
            host:"192.168.101.121",
            port:22,
          }
      }
    },"MONGO_SSH")
    ],
    providers: [CronService,MongoLogBackUpCornService],
})
export class CronModule {}
