# Docker轻量化开发环境配置指南

这是一个轻量化的Docker开发环境配置方案，适合前后端分离项目快速搭建开发环境。

## 配置思路概述

### 核心设计理念
1. **轻量化开发环境**：使用Docker仅用于开发环境，不涉及生产部署
2. **端口隔离**：Docker环境使用不同端口，避免与本地开发冲突
3. **数据迁移**：自动从本地数据库迁移数据到Docker数据库
4. **环境切换**：前端API自动根据端口检测环境并切换后端地址
5. **一键启动**：通过脚本一键启动完整开发环境

### 端口规划
- 本地开发：前端3000，后端3001，数据库3306
- Docker开发：前端4000，后端4001，数据库3307

## 详细配置步骤

### 1. 后端Docker配置

#### 1.1 创建Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 4001

# Start the application
CMD ["pnpm", "start"]
```

#### 1.2 创建Docker环境变量文件 (.env.docker)
```env
# Docker开发环境配置
# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_secret_key_docker
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4001
NODE_ENV=docker
```

#### 1.3 配置CORS支持
在后端主文件中添加Docker前端端口支持：
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite本地开发
    'http://localhost:3000',  // 前端本地开发
    'http://localhost:4000'   // Docker前端环境
  ],
  credentials: true
}));
```

#### 1.4 创建.dockerignore
```
node_modules
npm-debug.log
.git
.gitignore
README.md
Dockerfile
.dockerignore
dist
uploads
```

### 2. 前端Docker配置

#### 2.1 修改Dockerfile为开发模式
```dockerfile
# Docker开发环境
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 4000

# 启动开发服务器
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "4000"]
```

#### 2.2 配置API环境自动切换
在API配置文件中添加环境检测：
```typescript
// API 基础配置 - 根据环境自动切换
const getApiBaseUrl = () => {
  // 检查是否在Docker环境中运行
  if (window.location.hostname === 'localhost' && window.location.port === '4000') {
    // Docker环境
    return 'http://localhost:4001/api'
  }
  // 本地开发环境
  return 'http://localhost:3001/api'
}

const API_BASE_URL = getApiBaseUrl()
```

### 3. 数据库迁移脚本

#### 3.1 创建migrate-db.sh
```bash
#!/bin/bash

# 数据库迁移脚本：从本机数据库导出数据并导入到Docker数据库

echo "正在从本机数据库导出数据..."

# 导出本机数据库数据
mysqldump -h localhost -P 3306 -u root -proot your_database_name > database_backup.sql

if [ $? -eq 0 ]; then
    echo "数据库导出成功"
else
    echo "数据库导出失败"
    exit 1
fi

echo "等待Docker数据库启动..."
sleep 10

# 检查Docker数据库连接
until docker exec your-project-db mysqladmin ping -h"localhost" --silent; do
    echo "等待数据库连接..."
    sleep 2
done

echo "创建数据库..."
docker exec your-project-db mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS your_database_name;"

echo "导入数据到Docker数据库..."
docker exec -i your-project-db mysql -u root -proot your_database_name < database_backup.sql

if [ $? -eq 0 ]; then
    echo "数据库迁移完成"
    rm database_backup.sql
else
    echo "数据库导入失败"
    exit 1
fi
```

### 4. Docker Compose配置

#### 4.1 创建docker-compose.yml
```yaml
services:
  # 数据库服务
  db:
    image: mysql:8.0
    container_name: your-project-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: your_database_name
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - your-project-network

  # 后端服务
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4001:4001"
    container_name: your-project-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=docker
    env_file:
      - ./backend/.env.docker
    volumes:
      - ./backend/uploads:/app/uploads
    networks:
      - your-project-network
    depends_on:
      - db

  # 前端服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    container_name: your-project-frontend
    restart: unless-stopped
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    networks:
      - your-project-network
    depends_on:
      - backend

networks:
  your-project-network:
    driver: bridge

volumes:
  mysql_data:
```

### 5. 一键启动脚本

#### 5.1 创建script/docker-dev.sh
```bash
#!/bin/bash

# Docker开发环境启动脚本

echo "====================================="
echo "      Your Project Docker开发环境"
echo "====================================="

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未启动，请先启动Docker"
    exit 1
fi

echo "🚀 启动Docker开发环境..."

# 停止并删除现有容器
echo "🧹 清理现有容器..."
docker-compose down

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 15

# 执行数据库迁移
echo "💾 执行数据库迁移..."
cd backend && ./migrate-db.sh && cd ..

echo ""
echo "✅ Docker开发环境启动完成！"
echo ""
echo "📍 服务信息："
echo "   前端地址: http://localhost:4000/"
echo "   后端地址: http://localhost:4001/"
echo "   数据库连接:"
echo "     主机: localhost"
echo "     端口: 3307"
echo "     用户名: root"
echo "     密码: root"
echo "     数据库: your_database_name"
echo ""
echo "🔧 常用命令："
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo ""
```

## 使用方法

### 初次使用
1. 确保本地数据库有数据
2. 根据项目修改配置文件中的数据库名、项目名等
3. 给脚本添加执行权限：`chmod +x script/docker-dev.sh`
4. 给迁移脚本添加执行权限：`chmod +x backend/migrate-db.sh`

### 启动开发环境
```bash
./script/docker-dev.sh
```

### 停止开发环境
```bash
docker-compose down
```

## 配置要点总结

### 关键配置点
1. **端口隔离**：Docker环境使用+1000的端口避免冲突
2. **环境检测**：前端根据端口自动切换API地址
3. **数据同步**：自动从本地数据库迁移到Docker
4. **热重载**：挂载源码目录支持实时开发
5. **依赖管理**：容器内外使用相同的包管理器

### 优势特点
- ✅ 轻量化：仅开发环境使用Docker
- ✅ 隔离性：不影响本地开发环境
- ✅ 一致性：团队成员开发环境统一
- ✅ 便捷性：一键启动完整环境
- ✅ 灵活性：支持本地和Docker环境切换

### 适用场景
- 前后端分离项目
- 需要数据库的Web应用
- 团队协作开发
- 快速环境搭建

## 注意事项

1. 确保本地Docker已启动
2. 确保端口4000、4001、3307未被占用
3. 首次运行需要构建镜像，时间较长
4. 数据库密码等敏感信息请根据实际情况修改
5. 生产环境请使用专门的生产配置，不要使用此开发配置

## 故障排除

### 常见问题
1. **端口冲突**：检查端口是否被占用，修改docker-compose.yml中的端口映射
2. **数据库连接失败**：检查容器名称是否正确，等待时间是否足够
3. **CORS错误**：检查后端CORS配置是否包含Docker前端端口
4. **构建失败**：检查Dockerfile语法，确保依赖文件存在

### 调试命令
```bash
# 查看容器状态
docker-compose ps

# 查看容器日志
docker-compose logs -f [service_name]

# 进入容器调试
docker exec -it container_name bash

# 重启特定服务
docker-compose restart [service_name]
```

这个配置方案提供了一个轻量化、易维护的Docker开发环境，适合快速迭代和团队协作。