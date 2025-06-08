import { catchError, retry, throwError, timer } from 'rxjs';

export const PROTOCALREGEX=/^(.*?):\/\//;

export function getDBType(url: string) {
  const matches = url.match(PROTOCALREGEX);
  const protocol = matches ? matches[1] : 'file';
  return protocol === 'file' ? 'sqlite' : protocol; // 如果是file则为sqlite 其余正常返回数据库类型
}

export function handleRetry(retryAttempts: number, retryDelay: number) {
  return (source)=>source.pipe(
    retry({
      count: retryAttempts <0 ? Infinity : retryAttempts,
      delay: (error,retryCount)=>{
        const _retryAttempts = retryAttempts <0 ? Infinity : retryAttempts;
        if(retryCount<=_retryAttempts ){
          console.log(`Prisma第${retryCount}次重试连接数据库`);
          return timer(retryDelay)
        }else{
          return throwError(()=>new Error(`Prisma重试连接次数超过${retryAttempts}次`))
        }
      }
    }),
    catchError(error=>{
      console.log(`连接失败: ${error.message} ${error}`);
      return throwError(()=>new Error(`连接失败: ${error.message}`))
    })
  )
}