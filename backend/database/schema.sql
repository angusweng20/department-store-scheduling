-- 百貨櫃姐排班系統資料庫結構
-- 使用 Supabase (PostgreSQL)

-- 品牌資料表
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,           -- 品牌名稱
    code VARCHAR(20) UNIQUE NOT NULL,     -- 品牌代碼
    description TEXT,                     -- 品牌描述
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 專櫃人員資料表
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(20) UNIQUE NOT NULL,  -- 員工編號
    name VARCHAR(50) NOT NULL,                -- 姓名
    brand_id UUID REFERENCES brands(id),      -- 所屬品牌
    phone VARCHAR(20),                        -- 電話
    email VARCHAR(100),                       -- Email
    monthly_available_hours INTEGER DEFAULT 160, -- 每月可用時數
    min_rest_days_per_month INTEGER DEFAULT 8, -- 每月最少休息天數
    is_active BOOLEAN DEFAULT true,           -- 是否在職
    line_user_id VARCHAR(100),                -- LINE User ID (用於 Bot 通知)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 班別資料表
CREATE TABLE shift_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL,          -- 班別名稱 (早班/晚班/全日班)
    start_time TIME NOT NULL,           -- 開始時間
    end_time TIME NOT NULL,             -- 結束時間
    duration_hours INTEGER NOT NULL,    -- 持續時數
    description TEXT,                   -- 班別描述
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 排班表資料表
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES staff(id),      -- 負責人員
    shift_type_id UUID REFERENCES shift_types(id), -- 班別
    schedule_date DATE NOT NULL,            -- 排班日期
    status VARCHAR(20) DEFAULT 'scheduled', -- 狀態 (scheduled/completed/absent)
    notes TEXT,                             -- 備註
    created_by UUID REFERENCES staff(id),   -- 建立者
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 確保同一人同一天不會重複排班
    UNIQUE(staff_id, schedule_date)
);

-- 排班規則資料表
CREATE TABLE scheduling_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),     -- 適用品牌 (NULL 表示全店通用)
    rule_name VARCHAR(100) NOT NULL,        -- 規則名稱
    rule_type VARCHAR(50) NOT NULL,         -- 規則類型 (min_staff/max_hours/rest_days)
    rule_value INTEGER NOT NULL,            -- 規則數值
    description TEXT,                       -- 規則描述
    is_active BOOLEAN DEFAULT true,          -- 是否啟用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 排班衝突記錄表
CREATE TABLE schedule_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES schedules(id), -- 相關排班
    rule_id UUID REFERENCES scheduling_rules(id), -- 違反的規則
    violation_type VARCHAR(50) NOT NULL,     -- 衝突類型
    description TEXT NOT NULL,               -- 衝突描述
    severity VARCHAR(20) DEFAULT 'warning',  -- 嚴重程度 (warning/error)
    is_resolved BOOLEAN DEFAULT false,       -- 是否已解決
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 建立索引以提升查詢效能
CREATE INDEX idx_staff_brand_id ON staff(brand_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_schedules_staff_id ON schedules(staff_id);
CREATE INDEX idx_schedules_date ON schedules(schedule_date);
CREATE INDEX idx_schedules_shift_type ON schedules(shift_type_id);
CREATE INDEX idx_scheduling_rules_brand ON scheduling_rules(brand_id);

-- 插入預設資料

-- 預設班別
INSERT INTO shift_types (name, start_time, end_time, duration_hours, description) VALUES
('早班', '09:00:00', '17:00:00', 8, '上午9點至下午5點'),
('晚班', '13:00:00', '21:00:00', 8, '下午1點至晚上9點'),
('全日班', '09:00:00', '21:00:00', 12, '上午9點至晚上9點（含休息時間）');

-- 預設排班規則
INSERT INTO scheduling_rules (rule_name, rule_type, rule_value, description) VALUES
('每班最少人數', 'min_staff_per_shift', 2, '每個班次至少需要2名員工'),
('每月最少休息天數', 'min_rest_days', 8, '每位員工每月至少休息8天'),
('每月最多工作時數', 'max_monthly_hours', 200, '每位員工每月最多工作200小時'),
('連續工作天數限制', 'max_consecutive_days', 6, '員工最多連續工作6天');

-- RLS (Row Level Security) 設定
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_violations ENABLE ROW LEVEL SECURITY;

-- 員工只能查看自己的排班
CREATE POLICY "Staff can view own schedules" ON schedules
    FOR SELECT USING (
        auth.uid() = staff_id OR 
        EXISTS (SELECT 1 FROM staff WHERE id = auth.uid() AND is_active = true)
    );

-- 員工只能查看自己的資料
CREATE POLICY "Staff can view own data" ON staff
    FOR SELECT USING (auth.uid() = id);
