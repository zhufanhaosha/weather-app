# 🌤️ 天气查询站

一个基于 Open-Meteo API 的轻量级天气查询应用，包含15天趋势、国际新闻和生日提醒。

## 功能

- 🔍 搜索任意城市天气
- ⚡ 快捷城市按钮（石家庄、北京、上海、广州、深圳）
- 🌡️ 显示当前温度、湿度、风速、体感温度
- 📅 **15天天气趋势**（每日最高/最低温度）
- 📰 **国际新闻**（BBC 实时新闻）
- 🎂 **生日提醒**（楚楚：6月5日，沐沐：7月10日）
- 🧸 **可爱玩偶照片**（生日区域展示）
- ⚡ 皮卡丘主题背景
- 🎨 渐变配色，响应式布局
- 📱 支持手机端

## 技术栈

- HTML5 + CSS3 + Vanilla JavaScript
- Open-Meteo API（天气，无需 API Key）
- RSS2JSON API（新闻，无需 API Key）
- 部署在 Cloudflare Pages

## 本地运行

```bash
# 直接用浏览器打开
open index.html
```

或使用本地服务器：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

## 部署

1. 推送到 GitHub 仓库
2. 在 Cloudflare Dashboard → Workers & Pages → Create → Pages
3. 连接 GitHub 仓库，自动部署
4. 绑定自定义域名

## API

- [Open-Meteo](https://open-meteo.com/) 免费天气 API
- [RSS2JSON](https://rss2json.com/) RSS 转 JSON 服务

## License

MIT
