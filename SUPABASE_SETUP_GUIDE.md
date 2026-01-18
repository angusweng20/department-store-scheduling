# 🚀 Supabase 設定完成指南

## ✅ 已完成步驟

1. **✅ Python 環境設定** - 已安裝所有必要套件
2. **✅ 專案結構建立** - 完整的檔案架構已就緒
3. **✅ 自動設定腳本** - `setup_supabase.py` 已準備就緒

## 📋 接下來的設定步驟

### 步驟 1: 建立 Supabase 專案

1. 前往 [Supabase 官網](https://supabase.com)
2. 註冊/登入帳號
3. 點擊 "New Project"
4. 填寫專案資訊：
   - **Project Name**: `department-store-scheduling`
   - **Database Password**: 設定強密碼（請記住）
   - **Region**: Northeast Asia (Seoul) 推薦
5. 等待專案建立完成（1-2 分鐘）

### 步驟 2: 獲取 API 金鑰

1. 進入專案 Dashboard
2. 點擊左側 "Settings" > "API"
3. 複製以下資訊到 `.env` 檔案：

```env
# Supabase 設定
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 步驟 3: 設定環境變數

編輯專案根目錄的 `.env` 檔案：

```bash
# 編輯 .env 檔案
nano /Users/angusweng/CascadeProjects/department-store-scheduling/.env
```

將步驟 2 獲取的 API 金鑰填入。

### 步驟 4: 執行自動設定

```bash
cd /Users/angusweng/CascadeProjects/department-store-scheduling
python3 scripts/setup_supabase.py
```

腳本會自動：
- 🔗 測試 Supabase 連接
- 📊 執行 schema.sql 建立資料表
- 🏷️ 建立範例品牌資料（SK-II, Lancôme, Estée Lauder, Shiseido）
- 👥 建立範例員工資料（6 名員工）
- 📅 建立範例排班資料（2024年1月完整月份）

## 📊 設定完成後的資料結構

### 品牌資料
- SK-II (高檔保養品牌)
- Lancôme (法國化妝品牌)  
- Estée Lauder (美國化妝品牌)
- Shiseido (日本化妝品牌)

### 員工資料
- 王小美 (E001) - SK-II
- 李小雅 (E002) - SK-II
- 張小婷 (E003) - Lancôme
- 陳小雯 (E004) - Lancôme
- 林小萱 (E005) - Estée Lauder
- 黃小婷 (E006) - Shiseido

### 排班規則
- 每班最少人數：2人
- 每月最少休息天數：8天
- 每月最多工作時數：200小時
- 連續工作天數限制：6天

## 🧪 測試連接

### 方法 1: 使用 Python 腳本
```bash
python3 -c "
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY'))

# 測試品牌資料表
brands = client.table('brands').select('*').execute()
print(f'✅ 品牌數量: {len(brands.data)}')

# 測試員工資料表  
staff = client.table('staff').select('*').execute()
print(f'✅ 員工數量: {len(staff.data)}')

# 測試排班資料表
schedules = client.table('schedules').select('*').execute()
print(f'✅ 排班記錄數量: {len(schedules.data)}')
"
```

### 方法 2: 使用排班檢查器
```bash
python3 scripts/schedule_validator.py
```

## 🚨 常見問題解決

### Q: 出現連接錯誤？
**A**: 檢查 `.env` 檔案中的 URL 和金鑰是否正確

### Q: SQL 執行失敗？
**A**: 
1. 確認 Supabase 專案處於活躍狀態
2. 檢查網路連接
3. 嘗試手動執行 schema.sql

### Q: 權限錯誤？
**A**: 確保使用 `service_role` key 而非 `anon` key

## 🎯 設定完成後的下一步

1. **測試 FastAPI 後端**
   ```bash
   cd backend
   python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **設定 LINE Bot**
   - 申請 LINE Bot 開發者帳號
   - 設定 Webhook URL

3. **部署到雲端**
   - Railway / Vercel / Heroku

4. **開發 Web 管理介面**（可選）

## 📞 需要協助？

如果設定過程中遇到問題：
1. 檢查 [docs/supabase-setup.md](docs/supabase-setup.md) 詳細文件
2. 確認所有環境變數正確設定
3. 檢查 Supabase Dashboard 中的專案狀態

---

**🎉 設定完成後，您將擁有一個功能完整的百貨櫃姐排班系統！**
