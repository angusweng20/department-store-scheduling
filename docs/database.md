# 資料庫設計文件

## 概述

百貨櫃姐排班系統使用 Supabase (PostgreSQL) 作為資料庫，採用關聯式資料庫設計，支援多品牌、多員工的排班管理。

## 資料表結構

### 1. brands (品牌資料表)
儲存百貨公司內的各個品牌資訊。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| name | VARCHAR(100) | 品牌名稱 | NOT NULL |
| code | VARCHAR(20) | 品牌代碼 | UNIQUE, NOT NULL |
| description | TEXT | 品牌描述 | - |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | 更新時間 | DEFAULT NOW() |

### 2. staff (專櫃人員資料表)
儲存專櫃人員的基本資訊和工作限制。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| employee_id | VARCHAR(20) | 員工編號 | UNIQUE, NOT NULL |
| name | VARCHAR(50) | 姓名 | NOT NULL |
| brand_id | UUID | 所屬品牌 | FOREIGN KEY → brands.id |
| phone | VARCHAR(20) | 電話 | - |
| email | VARCHAR(100) | Email | - |
| monthly_available_hours | INTEGER | 每月可用時數 | DEFAULT 160 |
| min_rest_days_per_month | INTEGER | 每月最少休息天數 | DEFAULT 8 |
| is_active | BOOLEAN | 是否在職 | DEFAULT true |
| line_user_id | VARCHAR(100) | LINE User ID | - |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | 更新時間 | DEFAULT NOW() |

### 3. shift_types (班別資料表)
定義各種班別的時間和持續時間。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| name | VARCHAR(20) | 班別名稱 | NOT NULL |
| start_time | TIME | 開始時間 | NOT NULL |
| end_time | TIME | 結束時間 | NOT NULL |
| duration_hours | INTEGER | 持續時數 | NOT NULL |
| description | TEXT | 班別描述 | - |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |

### 4. schedules (排班表資料表)
核心排班資料，記錄每個員工的具體排班。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| staff_id | UUID | 負責人員 | FOREIGN KEY → staff.id |
| shift_type_id | UUID | 班別 | FOREIGN KEY → shift_types.id |
| schedule_date | DATE | 排班日期 | NOT NULL |
| status | VARCHAR(20) | 狀態 | DEFAULT 'scheduled' |
| notes | TEXT | 備註 | - |
| created_by | UUID | 建立者 | FOREIGN KEY → staff.id |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | 更新時間 | DEFAULT NOW() |

**唯一約束**: UNIQUE(staff_id, schedule_date) - 確保同一人同一天不會重複排班

### 5. scheduling_rules (排班規則資料表)
定義各種排班規則和限制。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| brand_id | UUID | 適用品牌 | FOREIGN KEY → brands.id (NULL 表示全店通用) |
| rule_name | VARCHAR(100) | 規則名稱 | NOT NULL |
| rule_type | VARCHAR(50) | 規則類型 | NOT NULL |
| rule_value | INTEGER | 規則數值 | NOT NULL |
| description | TEXT | 規則描述 | - |
| is_active | BOOLEAN | 是否啟用 | DEFAULT true |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | 更新時間 | DEFAULT NOW() |

**規則類型**:
- `min_staff_per_shift`: 每班最少人數
- `max_monthly_hours`: 每月最多工作時數
- `min_rest_days`: 每月最少休息天數
- `max_consecutive_days`: 連續工作天數限制

### 6. schedule_violations (排班衝突記錄表)
記錄排班違規和衝突情況。

| 欄位名稱 | 資料類型 | 說明 | 約束 |
|---------|---------|------|------|
| id | UUID | 主鍵 | PRIMARY KEY |
| schedule_id | UUID | 相關排班 | FOREIGN KEY → schedules.id |
| rule_id | UUID | 違反的規則 | FOREIGN KEY → scheduling_rules.id |
| violation_type | VARCHAR(50) | 衝突類型 | NOT NULL |
| description | TEXT | 衝突描述 | NOT NULL |
| severity | VARCHAR(20) | 嚴重程度 | DEFAULT 'warning' |
| is_resolved | BOOLEAN | 是否已解決 | DEFAULT false |
| created_at | TIMESTAMPTZ | 建立時間 | DEFAULT NOW() |

## 索引設計

為提升查詢效能，建立以下索引：

```sql
CREATE INDEX idx_staff_brand_id ON staff(brand_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_schedules_staff_id ON schedules(staff_id);
CREATE INDEX idx_schedules_date ON schedules(schedule_date);
CREATE INDEX idx_schedules_shift_type ON schedules(shift_type_id);
CREATE INDEX idx_scheduling_rules_brand ON scheduling_rules(brand_id);
```

## 安全性設定

採用 Row Level Security (RLS) 保護資料：

1. **員工權限**:
   - 只能查看自己的排班記錄
   - 只能查看和修改自己的個人資料

2. **管理員權限**:
   - 可查看所有排班資料
   - 可修改所有排班和員工資料

## 資料關聯圖

```
brands (1) ──── (N) staff
  │                     │
  │                     │ (1) ──── (N) schedules
  │                     │                     │
  │                     │              (N) ──── (1) shift_types
  │                     │
  │                     │ (1) ──── (N) schedule_violations
  │
  │ (1) ──── (N) scheduling_rules
        │
        └─── (1) ──── (N) schedule_violations
```

## 預設資料

### 預設班別
- **早班**: 09:00-17:00 (8小時)
- **晚班**: 13:00-21:00 (8小時)  
- **全日班**: 09:00-21:00 (12小時，含休息時間)

### 預設規則
- 每班最少人數: 2人
- 每月最少休息天數: 8天
- 每月最多工作時數: 200小時
- 連續工作天數限制: 6天

## 使用範例

### 查詢某員工的月度排班
```sql
SELECT s.*, st.name as shift_name, st.start_time, st.end_time
FROM schedules s
JOIN shift_types st ON s.shift_type_id = st.id
WHERE s.staff_id = '員工UUID'
  AND EXTRACT(YEAR FROM s.schedule_date) = 2024
  AND EXTRACT(MONTH FROM s.schedule_date) = 1
ORDER BY s.schedule_date;
```

### 檢查某日班次人力配置
```sql
SELECT 
  s.schedule_date,
  st.name as shift_name,
  COUNT(DISTINCT s.staff_id) as staff_count,
  STRING_AGG(staff.name, ', ') as staff_names
FROM schedules s
JOIN shift_types st ON s.shift_type_id = st.id
JOIN staff ON s.staff_id = staff.id
WHERE s.schedule_date = '2024-01-15'
  AND s.status = 'scheduled'
GROUP BY s.schedule_date, st.name
ORDER BY st.start_time;
```

### 統計員工月度工作時數
```sql
SELECT 
  staff.name,
  SUM(st.duration_hours) as total_hours,
  COUNT(DISTINCT s.schedule_date) as work_days
FROM schedules s
JOIN staff ON s.staff_id = staff.id
JOIN shift_types st ON s.shift_type_id = st.id
WHERE EXTRACT(YEAR FROM s.schedule_date) = 2024
  AND EXTRACT(MONTH FROM s.schedule_date) = 1
  AND s.status = 'scheduled'
GROUP BY staff.id, staff.name
ORDER BY total_hours DESC;
```
