-- 專櫃管理資料表
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(20) UNIQUE NOT NULL,
  counter_code VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_name TEXT,
  company_id UUID REFERENCES companies(id),
  company_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  department_name TEXT NOT NULL,
  location TEXT,
  type VARCHAR(20) NOT NULL DEFAULT '正櫃',
  area DECIMAL(5,2),
  floor_manager_id TEXT,
  floor_manager_name VARCHAR(100),
  staff TEXT[] DEFAULT '{}',
  entry_date DATE,
  exit_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT '營業中',
  phone VARCHAR(20),
  email TEXT,
  monthly_revenue DECIMAL(15,2),
  employee_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_stores_uid ON stores(uid);
CREATE INDEX idx_stores_counter_code ON stores(counter_code);
CREATE INDEX idx_stores_company_id ON stores(company_id);
CREATE INDEX idx_stores_department_id ON stores(department_id);
CREATE INDEX idx_stores_status ON stores(status);

-- 插入範例資料
INSERT INTO stores (uid, counter_code, name, brand_name, company_id, company_name, department_id, department_name, location, type, area, floor_manager_id, floor_manager_name, staff, entry_date, exit_date, status, phone, email, monthly_revenue, employee_count) VALUES
('ST-2026-001', 'V1023', 'Nike A11 店', 'Nike', (SELECT id FROM companies WHERE uid = 'CO-2026-001'), '耐克台灣股份有限公司', (SELECT id FROM departments WHERE uid = 'DS-2026-001'), '新光三越台北信義新天地A11館', '4F 區域 A', '正櫃', 25.00, 'user-006', '陳樓管', ARRAY['user-003', 'user-004', 'user-005'], '2023-01-15', NULL, '營業中', '02-8101-2123', 'nike-a11@nike.com.tw', 2500000.00, 8),
('ST-2026-002', 'V1024', 'Adidas A11 店', 'Adidas', (SELECT id FROM companies WHERE uid = 'CO-2026-002'), '阿迪達斯台灣股份有限公司', (SELECT id FROM departments WHERE uid = 'DS-2026-001'), '新光三越台北信義新天地A11館', '4F 區域 B', '正櫃', 30.00, 'user-006', '陳樓管', ARRAY['user-011', 'user-012'], '2023-02-01', NULL, '營業中', '02-8101-2124', 'adidas-a11@adidas.com.tw', 2200000.00, 6),
('ST-2026-003', 'V1025', 'Uniqlo A11 店', 'Uniqlo', (SELECT id FROM companies WHERE uid = 'CO-2026-003'), '優衣庫台灣股份有限公司', (SELECT id FROM departments WHERE uid = 'DS-2026-001'), '新光三越台北信義新天地A11館', '5F 區域 C', '正櫃', 45.00, 'user-007', '林樓管', ARRAY['user-015', 'user-016', 'user-017'], '2023-03-15', NULL, '營業中', '02-8101-2125', 'uniqlo-a11@uniqlo.com.tw', 3800000.00, 12),
('ST-2026-004', 'V1026', 'Nike 快閃店', 'Nike', (SELECT id FROM companies WHERE uid = 'CO-2026-001'), '耐克台灣股份有限公司', (SELECT id FROM departments WHERE uid = 'DS-2026-002'), '新光三越台北信義新天地A8館', '1F 中庭', '快閃櫃', 15.00, 'user-008', '黃樓管', ARRAY['user-018'], '2025-12-01', '2026-02-28', '營業中', '02-8101-2226', 'nike-popup@nike.com.tw', 800000.00, 3);

-- 創建觸發器更新 updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE
    ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
