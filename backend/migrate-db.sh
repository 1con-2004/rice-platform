#!/bin/bash

# 数据库迁移脚本：从本机数据库导出数据并导入到Docker数据库

echo "正在从本机数据库导出数据..."

# 导出本机数据库数据
mysqldump -h localhost -P 3306 -u root -proot rice_platform > rice_platform_backup.sql

if [ $? -eq 0 ]; then
    echo "数据库导出成功"
else
    echo "数据库导出失败"
    exit 1
fi

echo "等待Docker数据库启动..."
sleep 10

# 检查Docker数据库连接
until docker exec rice-platform-db mysqladmin ping -h"localhost" --silent; do
    echo "等待数据库连接..."
    sleep 2
done

echo "创建数据库..."
docker exec rice-platform-db mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS rice_platform;"

echo "导入数据到Docker数据库..."
docker exec -i rice-platform-db mysql -u root -proot rice_platform < rice_platform_backup.sql

if [ $? -eq 0 ]; then
    echo "数据库迁移完成"
    rm rice_platform_backup.sql
else
    echo "数据库导入失败"
    exit 1
fi