# 实时公交更新后端

这个仓库部署在 Vercel 上，用于给实时公交 Android 客户端提供自动更新信息。

可访问域名：

- `https://ccbbc-backend.vercel.app/`
- `https://ccbbc-backend-ccbbcs-projects.vercel.app/`
- `https://www.ccbbc.asia/`

## 接口

```text
GET /api/update
```

返回示例：

```json
{
  "appId": "com.codex.minimalbus",
  "versionCode": 2,
  "versionName": "1.1",
  "force": false,
  "releaseNotes": "新增自动更新检查。",
  "apkUrl": "https://ccbbc-backend.vercel.app/downloads/minimal-bus-v2.apk"
}
```

Android 客户端会比较远端 `versionCode` 与本地 `BuildConfig.VERSION_CODE`。远端更高时弹出更新提示，并打开 `apkUrl` 下载。

## 发布新版本

1. 在 Android 项目中递增 `versionCode` 和 `versionName`。
2. 构建 APK。
3. 将 APK 放入 `public/downloads/`。
4. 修改 `api/update.js` 中的版本号、说明和 APK 文件名。
5. 推送到 GitHub，Vercel 会自动部署。
