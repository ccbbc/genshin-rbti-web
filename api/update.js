const VERSION = {
  appId: "com.codex.minimalbus",
  versionCode: 2,
  versionName: "1.1",
  force: false,
  releaseDate: "2026-04-24",
  releaseNotes: [
    "新增自动更新检查。",
    "拆分 HTML、CSS、JS，后续维护更轻松。",
    "优化实时公交最近车辆计算与自动刷新稳定性。"
  ].join("\n")
};

module.exports = function handler(request, response) {
  const protocol = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "ccbbc-backend.vercel.app";
  const origin = `${protocol}://${host}`;
  const apkPath = "/downloads/minimal-bus-v2.apk";

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Cache-Control", "no-store, max-age=0");
  response.status(200).json({
    ...VERSION,
    apkUrl: `${origin}${apkPath}`,
    pageUrl: `${origin}/`,
    checksum: "",
    sizeBytes: 0
  });
};
