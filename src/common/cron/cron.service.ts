import { SshService } from "@/utils/ssh/ssh.service";
import { Inject, Injectable } from "@nestjs/common";
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

/**
 * 定时任务调度服务
 * 基于 @nestjs/schedule 模块实现定时任务管理
 */
@Injectable()
export class CronService {
  @Inject(SchedulerRegistry)
  private readonly schedulerRegistry: SchedulerRegistry;

  /**
   * 添加定时任务
   * @param name 任务唯一标识
   * @param cronTime cron时间表达式（秒 分 时 日 月 周）
   * @param cb 任务触发时的回调函数
   */
  addCronJob(name: string, cronTime: string, cb: () => void): void {
    const job = new CronJob(cronTime, cb);
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  /**
   * 删除指定定时任务
   * @param name 要删除的任务标识
   */
  deleteCronJob(name: string): void {
    this.schedulerRegistry.deleteCronJob(name);
  }

  /**
   * 获取当前所有定时任务标识
   * @returns 返回任务标识迭代器
   */
  getCrons(): MapIterator<string> {
    const jobs = this.schedulerRegistry.getCronJobs();
    return jobs.keys();
  }
}