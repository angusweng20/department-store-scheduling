# Supabase 整合指南

## 📋 設置步驟

### 1. 創建 Supabase 專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 點擊 "New Project"
3. 選擇您的組織
4. 輸入專案名稱（例如：`department-store-scheduling`）
5. 設置資料庫密碼
6. 選擇地區
7. 點擊 "Create new project"

### 2. 獲取連接資訊

專案創建後，在專案設置中找到：

- **Project URL**: `https://your-project-id.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 設置環境變數

在前端專案中創建 `.env` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# API 配置
VITE_API_BASE_URL=https://department-store-scheduling.onrender.com
```

### 4. 創建資料庫表

在 Supabase SQL Editor 中執行以下 SQL：

```sql
-- 員工表
CREATE TABLE staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  monthly_available_hours INTEGER DEFAULT 160,
  min_rest_days_per_month INTEGER DEFAULT 8,
  is_active BOOLEAN DEFAULT true,
  line_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 排班表
CREATE TABLE schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  shift_type_id TEXT NOT NULL,
  schedule_date DATE NOT NULL,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 請假申請表
CREATE TABLE leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_schedules_staff_id ON schedules(staff_id);
CREATE INDEX idx_schedules_date ON schedules(schedule_date);
CREATE INDEX idx_leave_requests_staff_id ON leave_requests(staff_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);

-- 啟用 RLS (Row Level Security)
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- 創建 RLS 策略
CREATE POLICY "Allow all operations on staff" ON staff FOR ALL USING (true);
CREATE POLICY "Allow all operations on schedules" ON schedules FOR ALL USING (true);
CREATE POLICY "Allow all operations on leave_requests" ON leave_requests FOR ALL USING (true);

-- 插入示例資料
INSERT INTO staff (employee_id, name, brand_id, phone, email, monthly_available_hours, min_rest_days_per_month) VALUES
('E001', '王小美', 'brand_1', '0912345678', 'wang@example.com', 160, 8),
('E002', '李小明', 'brand_1', '0923456789', 'li@example.com', 160, 8),
('E003', '張小華', 'brand_2', '0934567890', 'zhang@example.com', 150, 10),
('E004', '陳小芳', 'brand_2', '0945678901', 'chen@example.com', 170, 6),
('E005', '林小強', 'brand_3', '0956789012', 'lin@example.com', 180, 8);

INSERT INTO schedules (staff_id, shift_type_id, schedule_date, status, notes) VALUES
('E001', '早班', '2026-01-20', 'scheduled', '正常排班'),
('E002', '中班', '2026-01-20', 'scheduled', '正常排班'),
('E003', '晚班', '2026-01-20', 'scheduled', '正常排班'),
('E001', '早班', '2026-01-21', 'scheduled', '正常排班'),
('E002', '大夜班', '2026-01-21', 'scheduled', '特殊排班');

INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, reason, status) VALUES
('E001', '事假', '2026-01-25', '2026-01-26', '家中有急事', 'pending'),
('E002', '病假', '2026-01-22', '2026-01-23', '身體不適', 'approved'),
('E003', '年假', '2026-01-28', '2026-01-30', '休假', 'pending');
```

### 5. 啟用實時功能

在 Supabase Dashboard 中：

1. 前往 "Database" > "Replication"
2. 確保 `staff`、`schedules`、`leave_requests` 表已啟用實時
3. 點擊 "Enable" 按鈕

### 6. 測試連接

啟動前端應用並檢查瀏覽器控制台：

```bash
cd frontend-vite
npm run dev
```

檢查是否有 Supabase 連接錯誤。

## 🔧 故障排除

### 常見問題

1. **連接錯誤**: 檢查環境變數是否正確設置
2. **權限錯誤**: 確保 RLS 策略正確配置
3. **實時不工作**: 確認實時功能已啟用

### 調試技巧

1. 打開瀏覽器開發者工具
2. 查看 Console 錯誤訊息
3. 檢查 Network 標籤中的 API 請求
4. 在 Supabase Dashboard 中查看資料庫日誌

## 🚀 部署

### 前端部署

確保 `.env` 文件包含正確的 Supabase 憑證。

### 後端整合

如果需要同時使用後端 API，可以：

1. 保持現有 FastAPI 後端
2. 使用 Supabase 作為主要資料庫
3. 後端連接到 Supabase PostgreSQL

## 📚 參考資源

- [Supabase 文檔](https://supabase.com/docs)
- [Supabase JavaScript 客戶端](https://supabase.com/docs/reference/javascript)
- [Supabase 實時功能](https://supabase.com/docs/guides/realtime)
