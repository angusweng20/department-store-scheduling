-- 百貨管理資料表
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(20) UNIQUE NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  operating_hours VARCHAR(20) NOT NULL,
  floors TEXT[] NOT NULL,
  stores TEXT[] DEFAULT '{}',
  floor_managers TEXT[] DEFAULT '{}',
  contact_person VARCHAR(100),
  contact_phone VARCHAR(20),
  main_phone VARCHAR(20),
  operating_status VARCHAR(20) NOT NULL DEFAULT '營業中',
  established_date DATE,
  monthly_revenue DECIMAL(15,2),
  total_employees INTEGER DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_departments_uid ON departments(uid);
CREATE INDEX idx_departments_code ON departments(code);
CREATE INDEX idx_departments_status ON departments(operating_status);

-- 插入範例資料
INSERT INTO departments (uid, code, name, address, region, operating_hours, floors, stores, floor_managers, contact_person, contact_phone, main_phone, operating_status, established_date, monthly_revenue, total_employees, parking_spaces, description) VALUES
('DS-2026-001', 'SKM-A11', '新光三越台北信義新天地A11館', '台北市信義區松高路12號', '台北市信義區', '11:00-22:00', ARRAY['B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F'], ARRAY['store-001', 'store-002', 'store-003', 'store-004', 'store-005'], ARRAY['user-006', 'user-007'], '陳經理', '0912345678', '02-8101-2111', '營業中', '2020-01-15', 45000000.00, 850, 1200, '信義區旗艦百貨，13層樓高，包含國際精品與時尚品牌'),
('DS-2026-002', 'SKM-A8', '新光三越台北信義新天地A8館', '台北市信義區松高路19號', '台北市信義區', '11:00-22:00', ARRAY['B2', 'B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F'], ARRAY['store-006', 'store-007', 'store-008'], ARRAY['user-008'], '林經理', '0923456789', '02-8101-2211', '營業中', '2019-03-20', 28000000.00, 620, 800, '時尚生活百貨，以年輕族群為主要客層'),
('DS-2026-003', 'SKM-TC', '新光三越台中中港店', '台中市西區台灣大道二段459號', '台中市西區', '11:00-21:30', ARRAY['B1', '1F', '2F', '3F', '4F', '5F', '6F', '7F', '8F'], ARRAY['store-009', 'store-010', 'store-011'], ARRAY['user-009'], '黃經理', '0934567890', '04-2226-1818', '整修中', '2018-09-10', 18000000.00, 450, 600, '中部地區主要百貨據點，目前正在進行部分樓層整修');

-- 創建觸發器更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE
    ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
