# Supabase 設定指南

## 前置準備

### 1. 建立 Supabase 帳號
1. 前往 [Supabase 官網](https://supabase.com)
2. 點擊 "Start your project" 或 "Sign Up"
3. 使用 GitHub 或 Email 註冊帳號
4. 驗證 Email 地址

### 2. 建立新專案
1. 登入 Supabase Dashboard
2. 點擊 "New Project"
3. 選擇您的組織（Organization）
4. 填寫專案資訊：
   - **Project Name**: `department-store-scheduling`
   - **Database Password**: 設定一個強密碼（請記住）
   - **Region**: 選擇離您最近的區域（建議 Northeast Asia (Seoul)）
5. 點擊 "Create new project"
6. 等待專案建立完成（約需 1-2 分鐘）

### 3. 獲取 API 金鑰
專案建立後，進入專案設定：

1. 點擊左側選單的 "Settings" > "API"
2. 複製以下資訊：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 環境設定

### 1. 建立 .env 檔案
在專案根目錄建立 `.env` 檔案：

```bash
cd /Users/angusweng/CascadeProjects/department-store-scheduling
cp backend/.env.example .env
```

### 2. 編輯 .env 檔案
```env
# Supabase 設定
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# LINE Bot 設定（稍後設定）
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

# FastAPI 設定
DEBUG=true
HOST=0.0.0.0
PORT=8000

# 其他設定
TIMEZONE=Asia/Taipei
LOG_LEVEL=INFO
```

**重要**: 將 `your-project-id`、`your-anon-key-here`、`your-service-role-key-here` 替換為實際值。

## 資料庫設定

### 方法一：使用自動設定腳本（推薦）

1. 確保已安裝 Python 依賴：
```bash
cd backend
pip install -r requirements.txt
```

2. 執行自動設定腳本：
```bash
cd ..
python3 scripts/setup_supabase.py
```

腳本會自動：
- 測試 Supabase 連接
- 執行 schema.sql 建立資料表
- 建立範例品牌資料
- 建立範例員工資料  
- 建立範例排班資料

### 方法二：手動設定

#### 1. 執行 SQL Schema
1. 進入 Supabase Dashboard
2. 點擊左側選單 "SQL Editor"
3. 點擊 "New query"
4. 複製 `backend/database/schema.sql` 的內容
5. 貼上到 SQL 編輯器
6. 點擊 "Run" 執行

#### 2. 驗證資料表建立
執行以下 SQL 查詢確認資料表：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

應該看到以下資料表：
- brands
- staff  
- shift_types
- schedules
- scheduling_rules
- schedule_violations

#### 3. 建立範例資料（可選）
如需手動建立範例資料，可在 SQL Editor 執行：

```sql
-- 範例品牌
INSERT INTO brands (name, code, description) VALUES
('SK-II', 'SKII', '高檔保養品牌'),
('Lancôme', 'LANCOME', '法國化妝品牌'),
('Estée Lauder', 'ESTEE', '美國化妝品牌'),
('Shiseido', 'SHISEIDO', '日本化妝品牌');

-- 範例員工（需要先查詢品牌 ID）
INSERT INTO staff (employee_id, name, brand_id, phone, email, monthly_available_hours, min_rest_days_per_month) 
SELECT 
  'E001', '王小美', id, '0912-345-678', 'wang@department.com', 160, 8
FROM brands WHERE code = 'SKII' LIMIT 1;
```

## 安全設定

### 1. Row Level Security (RLS)
Schema.sql 已包含 RLS 設定，確保：
- 員工只能查看自己的排班
- 員工只能修改自己的資料
- 管理員可查看所有資料

### 2. API 金鑰權限
- **anon key**: 只能讀取公開資料
- **service_role key**: 可執行所有操作（僅後端使用）

## 測試連接

### 1. 使用 Python 腳本測試
```bash
python3 -c "
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()
client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY'))
result = client.table('brands').select('count').execute()
print('✅ 連接成功，品牌數量:', len(result.data))
"
```

### 2. 使用 curl 測試
```bash
curl -X POST 'https://your-project-id.supabase.co/rest/v1/rpc/version' \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

## 常見問題

### Q: 執行 SQL 時出現權限錯誤？
A: 確保使用 service_role key，而非 anon key。

### Q: 資料表建立失敗？
A: 檢查 SQL 語法，確保沒有語法錯誤。可分段執行 SQL。

### Q: 無法連接到 Supabase？
A: 檢查：
1. .env 檔案中的 URL 和金鑰是否正確
2. 網路連接是否正常
3. Supabase 專案是否處於活躍狀態

### Q: RLS 政策導致無法查詢資料？
A: 暫時停用 RLS 測試：
```sql
ALTER TABLE staff DISABLE ROW LEVEL SECURITY;
```

## 下一步

1. **測試排班檢查器**: 更新排班檢查器以連接 Supabase
2. **設定 LINE Bot**: 申請 LINE Bot 開發者帳號
3. **部署後端**: 將 FastAPI 部署到雲端平台
4. **前端開發**: 建立 Web 管理介面（可選）

## 備份與維護

### 定期備份
Supabase 會自動備份，也可手動備份：
1. Dashboard > Settings > Backup
2. 點擊 "Create new backup"

### 監控
1. Dashboard > Settings > Logs 查看執行日誌
2. Dashboard > Settings > Database 查看效能指標
