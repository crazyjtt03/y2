# 部署到 Claw Cloud 指南

本指南将协助你将 "Soulbind Portal" 应用部署到 [Claw Cloud](https://run.claw.cloud/)。

## 1. 准备工作

在开始之前，请确保你的代码已经推送到 GitHub 仓库。

1.  **提交代码**: 确保最新的代码（包括我刚刚创建的 `Dockerfile` 和 `nginx.conf`）都已经提交并推送到你的 GitHub 仓库。
    ```bash
    git add .
    git commit -m "Add Dockerfile and deployment config"
    git push
    ```

## 2. 在 Claw Cloud 上创建项目

1.  登录 [Claw Cloud Console](https://run.claw.cloud/)。
2.  点击 **"New Project"** (新建项目) 按钮。
3.  选择 **"Import Git Repository"** (导入 Git 仓库)。
4.  如果你还没有连接 GitHub，请先点击连接并授权访问你的仓库。
5.  在列表里选择这个项目的仓库。

## 3. 配置部署选项

Claw Cloud 会自动检测 Dockerfile，但我们建议确认以下设置：

*   **Project Name (项目名称)**: 可以保持默认或修改为你喜欢的名字（例如 `soulbind-portal`）。
*   **Branch (分支)**: 选择 `main` (或你代码所在的分支)。
*   **Root Directory (根目录)**: 保持默认 `/` (或者 `.` )，除非你的代码在子目录下。
*   **Framework Preset (框架预设)**:这也应该会自动识别为 `Docker`。如果没有，请手动选择 `Docker`。
*   **Environment Variables (环境变量)**:
    *   这个项目目前看起来是纯前端静态构筑，通常不需要运行时的环境变量。
    *   *如果*你的构建过程需要 API Key (例如 `.env.local` 里的 `GEMINI_API_KEY`)，你需要在这里添加。鉴于这是一个纯前端项目，API Key 通常是在构建时嵌入的（如果是 `VITE_` 开头）或者在运行时使用的。
    *   **注意**: 检查你的 `.env.local`。如果代码里用了 `import.meta.env.VITE_GEMINI_API_KEY`，你需要在 Claw Cloud 的 Environment Variables 里添加 `VITE_GEMINI_API_KEY` 和对应的值，这样构建时才能读到。
    
    *(检查代码发现 `package.json` 依赖了 `@google/genai`，但 `App.tsx` 似乎没有直接用 API。如果这个项目未来需要 API Key，请务必在这里配置。)*

## 4. 部署 (Deploy)

1.  点击 **"Deploy"** 按钮。
2.  Claw Cloud 将开始构建你的 Docker 镜像。你可以查看构建日志。
    *   它会执行 `Dockerfile` 里的步骤：`npm install` -> `npm run build` -> `nginx` 启动。
3.  等待构建完成。通常需要几分钟。

## 5. 验证

1.  部署成功后，Claw Cloud 会提供一个访问域（例如 `https://soulbind-portal-xxxx.claw.cloud`）。
2.  点击该链接访问。
3.  验证页面是否正常加载，花瓣飘落动画、音乐播放等功能是否正常。

## 常见问题排查

*   **构建失败**: 查看 "Build Logs"。如果显示 `npm error`，可能是依赖包版本问题。
*   **404 Not Found**: 确保 `nginx.conf` 正确复制，并且 `location /` 配置正确处理了 History 路由（`try_files $uri $uri/ /index.html;` 这行非常重要）。
*   **环境变量不生效**: 记住 Vite 应用的环境变量（`VITE_` 前缀）是在**构建时**替换的。如果在部署后修改了环境变量，需要点击 **"Redeploy"** 重新触发构建才能生效。

---
祝你在云端部署顺利！✨
