-- 建立 leave_requests 資料表
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 確保同一位員工在同一天只能有一筆劃假紀錄
    UNIQUE(user_id, date)
);

-- 建立索引以提升查詢性能
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_date ON leave_requests(date);
CREATE INDEX idx_leave_requests_user_date ON leave_requests(user_id, date);

-- 建立觸發器自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leave_requests_updated_at 
    BEFORE UPDATE ON leave_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 啟用 RLS (Row Level Security)
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- RLS 政策：用戶只能讀寫自己的劃假紀錄
CREATE POLICY "Users can view own leave requests" ON leave_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leave requests" ON leave_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leave requests" ON leave_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leave requests" ON leave_requests
    FOR DELETE USING (auth.uid() = user_id);

-- 管理員可以查看所有劃假紀錄 (可選)
CREATE POLICY "Admins can view all leave requests" ON leave_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- 備註：如果要與 staff 表關聯，可以添加外鍵約束
-- ALTER TABLE leave_requests 
-- ADD CONSTRAINT fk_leave_requests_staff 
-- FOREIGN KEY (user_id) REFERENCES staff(id) ON DELETE CASCADE;
