# 🚀 部署指南

## 📋 部署選項

### 1. Vercel (推薦) ⭐

#### **優勢**
- 🌐 **免費**: 無需付費
- ⚡ **快速部署**: 自動部署
- 🔄 **自動更新**: Git 推送自動部署
- 🌍 **全球 CDN**: 快速載入
- 🔒 **HTTPS**: 免費 SSL 憑證
- 🎯 **適合**: React/Vite 專案

#### **部署步驟**

1. **前往 Vercel**
   - 開啟 [vercel.com](https://vercel.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "New Project"
   - 選擇 GitHub 倉庫
   - 選擇 `frontend-vite` 資料夾

3. **配置專案**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **設置環境變數**
   ```env
   VITE_API_BASE_URL=https://department-store-scheduling.onrender.com
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **部署**
   - 點擊 "Deploy"
   - 等待部署完成

#### **部署後**
- 🌐 **網址**: `https://your-project-name.vercel.app`
- 🔄 **自動更新**: Git 推送自動重新部署
- 📊 **分析**: Vercel Dashboard 查看統計

---

### 2. Netlify

#### **優勢**
- 🌐 **免費**: 無需付費
- 📝 **表單處理**: 內建表單功能
- 🔧 **簡單**: 拖拽部署
- 🔄 **自動部署**: Git 整合

#### **部署步驟**

1. **前往 Netlify**
   - 開啟 [netlify.com](https://netlify.com)
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "New site from Git"
   - 選擇 GitHub 倉庫
   - 選擇 `frontend-vite` 資料夾

3. **配置設定**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **設置環境變數**
   - 在 Site settings > Environment variables
   - 添加所有必要環境變數

---

### 3. GitHub Pages

#### **優勢**
- 🌐 **免費**: 完全免費
- 🔄 **簡單**: 直接從 GitHub 部署
- 📝 **開源**: 適合開源專案

#### **部署步驟**

1. **修改 Vite 配置**
   ```ts
   // vite.config.ts
   export default defineConfig({
     base: '/your-repo-name/',
     build: {
       outDir: 'dist'
     }
   })
   ```

2. **創建 GitHub Actions**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

---

## 🔧 部署前準備

### 1. 環境變數設置

#### **創建 .env.production**
```env
# 生產環境
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 2. 建置測試

```bash
cd frontend-vite
npm run build
npm run preview
```

### 3. 檢查建置結果

- 📁 **dist 資料夾**: 確認檔案生成
- 🌐 **本地測試**: `npm run preview` 測試
- 🔍 **檢查錯誤**: 瀏覽器控制台檢查

---

## 🌐 部署後檢查

### 1. 功能測試

- ✅ **頁面載入**: 首頁正常顯示
- ✅ **導航功能**: 頁面切換正常
- ✅ **API 連接**: 後端 API 正常
- ✅ **搜尋功能**: 搜尋過濾正常
- ✅ **表單功能**: 新增編輯正常

### 2. 性能檢查

- ⚡ **載入速度**: Google PageSpeed Insights
- 📱 **響應式**: 不同設備測試
- 🔍 **SEO 檢查**: Meta 標籤檢查

### 3. 錯誤監控

- 📊 **Vercel Analytics**: 錯誤追蹤
- 🔍 **瀏覽器控制台**: 檢查 JavaScript 錯誤
- 📝 **日誌檢查**: 服務器日誌檢查

---

## 🎯 推薦部署流程

### **步驟 1: 選擇平台**
- 🥇 **Vercel**: 最適合 React/Vite 專案
- 🥈 **Netlify**: 簡單易用
- 🥉 **GitHub Pages**: 開源專案

### **步驟 2: 準備專案**
- 🔧 **環境變數**: 設置生產環境變數
- 🏗️ **建置測試**: 本地建置成功
- 📁 **檔案檢查**: 確認所有檔案

### **步驟 3: 部署**
- 🚀 **上傳**: 按照平台步驟部署
- ⏱️ **等待**: 等待部署完成
- 🌐 **測試**: 測試部署結果

### **步驟 4: 優化**
- 📊 **監控**: 設置錯誤監控
- 🔧 **優化**: 根據數據優化
- 🔄 **更新**: 定期更新維護

---

## 🆘 故障排除

### 常見問題

1. **建置失敗**
   - 檢查 `package.json` 腳本
   - 確認 Node.js 版本
   - 檢查依賴安裝

2. **API 連接失敗**
   - 檢查環境變數
   - 確認 CORS 設置
   - 檢查 API 端點

3. **路由問題**
   - 檢查 `vercel.json` 配置
   - 確認 SPA 路由設置
   - 檢查 404 錯誤

4. **CSS/JS 載入失敗**
   - 檢查檔案路徑
   - 確認 `base` 配置
   - 檢查資源引用

---

## 📚 參考資源

- [Vercel 部署指南](https://vercel.com/docs/frameworks/vite)
- [Netlify 部署指南](https://docs.netlify.com/frameworks/vite/)
- [GitHub Pages 部署](https://docs.github.com/en/pages)
- [Vite 建置配置](https://vitejs.dev/config/build-options)
