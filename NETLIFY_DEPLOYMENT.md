# 🌐 Netlify 部署指南

## 🚀 快速部署到 Netlify

### 方法 1: 拖拽部署 (最快)

1. **本地建置**
   ```bash
   cd frontend-vite
   npm run build
   ```

2. **前往 Netlify**
   - 開啟 [netlify.com](https://netlify.com)
   - 登入或創建帳號

3. **拖拽部署**
   - 將 `dist` 資料夾拖拽到 Netlify 部署區域
   - 等待部署完成

### 方法 2: Git 部署

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push
   ```

2. **連接 GitHub**
   - 在 Netlify 點擊 "Add new site"
   - 選擇 "Import an existing project"
   - 選擇 GitHub
   - 選擇 `department-store-scheduling` 倉庫

3. **配置設定**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### 🔧 環境變數設置

在 Netlify Dashboard 中添加：
```env
VITE_API_BASE_URL=https://department-store-scheduling.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🌐 部署結果

部署完成後，網址格式：
```
https://your-project-name.netlify.app
```

### ✅ 優勢

- 🌐 **穩定**: Netlify 非常穩定
- 🚀 **快速**: 拖拽部署極快
- 🔄 **自動**: Git 推送自動部署
- 📊 **分析**: 內建分析工具
- 🔒 **HTTPS**: 免費 SSL 憑證
