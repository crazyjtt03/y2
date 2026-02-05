# 部署到 Claw Cloud 指南 (App Launchpad 版)

由于 Claw Cloud 使用 App Launchpad (基于 Kubernetes) 进行部署，我们需要直接使用**Docker 镜像**。
好消息是：你的 GitHub Actions 已经自动为你构建好了镜像！

## 1. 准备工作 (已完成)

*   [x] 代码推送到 GitHub。
*   [x] GitHub Actions自动构建镜像完成。
*   **镜像地址**: `ghcr.io/crazyjtt03/y2:latest`

## 2. 在 Claw Cloud 上部署

请按照你在截图里看到的界面进行填写：

1.  **Application Name (应用名称)**:
    *   随便填，比如 `soulbind-portal`。

2.  **Image (镜像)**:
    *   先选择 **Public** (公开)。
    *   **Image Name (镜像名称)**: 复制下面的地址填进去：
        ```text
        ghcr.io/crazyjtt03/y2:latest
        ```

3.  **Replicas (副本数)**:
    *   保持 `1` 即可。

4.  **Resources (资源)**:
    *   保持默认 (CPU 0.2, Memory 256M 对这个网页足够了)。

5.  **点击 Deploy Application (部署应用)**。

---

### ⚠️ 如果部署失败显示 "ImagePullBackOff" 或权限错误
这意味着包含镜像的 GitHub 软件包是**私有**的。你需要把它设为公开：

1.  回到你的 GitHub 仓库主页。
2.  点击右侧的 **Packages** (如果没有，点击你的头像 -> Your profile -> Packages)。
3.  找到 `y2` (或 `soulbind-portal`) 这个包点击进入。
4.  找到 **Package settings** (通常在右侧栏)。
5.  向下滚动找到 **Danger Zone** -> **Change visibility**。
6.  选择 **Public** 并确认。
7.  回到 Claw Cloud 点击重试 (Redeploy)。
