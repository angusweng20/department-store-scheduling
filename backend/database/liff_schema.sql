-- ============================================
-- LIFF 整合 - Database Schema
-- 百貨專櫃排班系統 (LIFF 版本)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table: shifts (正式班表)
-- ============================================
CREATE TABLE IF NOT EXISTS shifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,                    -- 對應 LIFF userId
    date DATE NOT NULL,                        -- YYYY-MM-DD
    shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'evening', 'full')), -- 班別類型
    is_published BOOLEAN DEFAULT FALSE,          -- 店長發布後才看得到
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, date)                      -- 同一用戶同一天只能有一個班
);

-- ============================================
-- Table: leave_requests (劃假申請)
-- ============================================
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,                    -- 對應 LIFF userId
    date DATE NOT NULL,                        -- YYYY-MM-DD
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reason TEXT,                               -- 劃假原因 (可選)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, date)                      -- 同一用戶同一天只能有一筆申請
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Shifts indexes
CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON shifts(user_id);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_user_date ON shifts(user_id, date);
CREATE INDEX IF NOT EXISTS idx_shifts_published ON shifts(is_published);

-- Leave requests indexes
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_date ON leave_requests(date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_date ON leave_requests(user_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for shifts
-- ============================================

-- Users can only see their own shifts
CREATE POLICY "Users can view own shifts" ON shifts
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can only insert their own shifts (if needed)
CREATE POLICY "Users can insert own shifts" ON shifts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can only update their own shifts (if needed)
CREATE POLICY "Users can update own shifts" ON shifts
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can only delete their own shifts (if needed)
CREATE POLICY "Users can delete own shifts" ON shifts
    FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- RLS Policies for leave_requests
-- ============================================

-- Users can only view their own leave requests
CREATE POLICY "Users can view own leave requests" ON leave_requests
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can insert their own leave requests
CREATE POLICY "Users can insert own leave requests" ON leave_requests
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own leave requests
CREATE POLICY "Users can update own leave requests" ON leave_requests
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own leave requests
CREATE POLICY "Users can delete own leave_requests" ON leave_requests
    FOR DELETE USING (auth.uid()::text = user_id);

-- ============================================
-- Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample shifts (remove in production)
INSERT INTO shifts (user_id, date, shift_type, is_published) VALUES
    ('mock-user-id', '2026-01-05', 'morning', true),
    ('mock-user-id', '2026-01-06', 'evening', true),
    ('mock-user-id', '2026-01-07', 'full', true),
    ('mock-user-id', '2026-01-12', 'morning', true),
    ('mock-user-id', '2026-01-15', 'evening', true),
    ('mock-user-id', '2026-01-20', 'full', true)
ON CONFLICT (user_id, date) DO NOTHING;

-- Insert sample leave requests (remove in production)
INSERT INTO leave_requests (user_id, date, status, reason) VALUES
    ('mock-user-id', '2026-01-10', 'pending', '家裡有事'),
    ('mock-user-id', '2026-01-25', 'approved', '身體不適')
ON CONFLICT (user_id, date) DO NOTHING;

-- ============================================
-- Grant permissions
-- ============================================

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
