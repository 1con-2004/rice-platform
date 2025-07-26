#!/bin/bash

# Mac系统提示音脚本 - 播放3下系统提示音
# 用法: ./notify_complete.sh

echo "任务完成提醒..."

# 播放5次系统提示音
for i in {1..2}; do
    afplay /System/Library/Sounds/Blow.aiff
    sleep 0.1  # 每次播放间隔0.1秒
done

echo "提醒完成！"