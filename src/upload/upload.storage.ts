import * as multer from "multer";  // 导入multer模块，用于处理HTTP文件上传
import * as fs from 'fs';          // 导入文件系统模块，用于目录创建操作
import * as path from "path";    // 导入路径处理模块，用于拼接文件路径

export const destinationPath = path.join(__dirname, "upload");  // 定义文件上传的目标目录

/**
 * 配置multer的磁盘存储策略（diskStorage）
 * 定义文件上传的目标目录和文件名生成规则
 */
const storage = multer.diskStorage({  
    /**
     * 定义文件存储的目标目录
     * @param req 请求对象
     * @param file 上传的文件对象
     * @param cb 回调函数（错误对象, 目标目录路径）
     */
    destination: function (req, file, cb) {
        try {
            // 尝试创建目标目录（路径为项目根目录下的uploads文件夹）
            // fs.mkdirSync默认会抛出异常（如目录已存在），使用try-catch捕获并忽略
            fs.mkdirSync(path.join(destinationPath));
        }catch(e) {}
        // 调用回调函数，传递目标目录路径（项目根目录下的uploads）
        cb(null, destinationPath)
    },
    /**
     * 定义上传文件的文件名生成规则
     * @param req 请求对象
     * @param file 上传的文件对象
     * @param cb 回调函数（错误对象, 生成的文件名）
     */
    filename: function (req, file, cb) {
        // 生成唯一后缀：时间戳 + 随机数（1e9范围内） + 原文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
        // 最终文件名为：字段名 + 唯一后缀（避免文件名冲突）
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

// 导出存储配置，供multer上传中间件使用
export { storage };
