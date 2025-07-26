#!/bin/bash

# Docker开发环境启动脚本

echo "====================================="
echo "      Rice Platform Docker开发环境"
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
echo "     数据库: rice_platform"
echo ""
echo "🔧 常用命令："
echo "   查看日志: docker-compose logs -f"
echo "   停止服务: docker-compose down"
echo "   重启服务: docker-compose restart"
echo ""