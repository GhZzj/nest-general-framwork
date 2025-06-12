# NestJS 通用框架

一个基于 NestJS 的企业级通用框架，集成了多种数据库支持和现代化开发工具。

## 功能特性

- 🚀 基于 NestJS 11.x 构建
- 📦 多数据库支持（MySQL、PostgreSQL、MongoDB）
- 🔄 Redis 缓存集成
- 🔐 JWT 认证
- 📝 Winston 日志系统
- 🐳 Docker 容器化支持
- 🧪 Jest 测试框架
- 📘 Swagger API 文档
- 🔍 ESLint + Prettier 代码规范

## 技术栈

- **后端框架**: NestJS 11.x
- **编程语言**: TypeScript
- **数据库**: 
  - MySQL (Prisma ORM)
  - PostgreSQL (Prisma ORM)
  - MongoDB (Mongoose)
- **缓存**: Redis (IoRedis)
- **认证**: JWT + Passport.js
- **日志**: Winston
- **测试**: Jest
- **容器化**: Docker

## 快速开始

### 环境要求

- Node.js >= 18
- Docker & Docker Compose
- pnpm (推荐) 或 npm

### 安装

```bash
# 克隆项目
git clone [项目地址]

# 安装依赖
pnpm install

# 启动数据库服务
docker-compose -f docker-compose.mysql.yaml up -d
docker-compose -f docker-compose.mongo.yaml up -d
docker-compose -f docker-compose.redis.yaml up -d

# 生成 Prisma 客户端
pnpm prisma:db:generate

# 启动开发服务器
pnpm start:dev
```

### 数据库管理界面

- MySQL: http://localhost:8080 (Adminer)
- MongoDB: http://localhost:8081 (Mongo Express)
- Redis: http://localhost:5540 (RedisInsight)

## 项目结构
