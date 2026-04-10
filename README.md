# RBTI Web

`RBTI` 是一个面向原神玩家的娱乐化人格测试网页原型，用树脂、原石、深渊、剧情和整活习惯来“审判”玩家在提瓦特到底是个什么人格。

当前版本特性：

- 36 道长题库
- 每 6 题插入一次系统吐槽卡
- 12 个常规人格
- 4 个隐藏人格
- 可复制结果文案，方便发群试水

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 Vercel

这是标准 Vite 静态站点，直接导入到 Vercel 即可。

1. 把项目推到 GitHub 公开仓库
2. 在 Vercel 中选择 `Add New Project`
3. 导入该 GitHub 仓库
4. Framework Preset 选择 `Vite`
5. 保持默认构建设置并部署

默认配置通常为：

- Build Command: `npm run build`
- Output Directory: `dist`

## 当前调研重点

建议上线后重点观察：

- 玩家是否愿意答完 36 题
- 中途吐槽卡是否能提升停留
- 哪些人格最容易被截图传播
- 哪些题目最容易在评论区引发认领和互相补刀
