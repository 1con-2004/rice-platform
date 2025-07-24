# rice-platform

# 前端

## 前端热重载开发步骤
1. 进入前端目录 `cd frontend`
2. 安装pnpm `pnpm install`
3. 运行项目 `pnpm run dev`

## Docker与前端配合的开发步骤
在终端进入前端目录后输入`docker-compose up --build`来运行Docker
之后可以在 http://localhost:3000访问.
如果不需要前台查看Docker日志，可以输入`docker-compose up -d来后台运行`

# 后端
1. 进入后端目录 `cd backend`
2. 安装pnpm `pnpm install`
3. 运行项目 `pnpm run dev`

# 数据库

# 其他
1. px转换问题

  - 开发时只需写px ✅
  -
  PostCSS在开发模式下也生效，Vite会自动处理
  - 前端服务器：http://localhost:3000

  2. 后端启动

  后端已经成功启动：
  - 端口：3001
  - 数据库连接成功
  - API地址：http://localhost:3001/api/

  3. 登录问题解决方案

  你需要同时运行两个服务器：

  终端1 - 启动后端：
  cd backend
  pnpm run dev

  终端2 - 启动前端：
  cd frontend
  pnpm run dev

  现在你可以在浏览器访问
  http://localhost:3000 测试登录功能。

  后端API已经在3001端口运行，前端会自动调用
  后端接口进行登录验证。用户名newuser和密码
  123456应该可以正常登录了。