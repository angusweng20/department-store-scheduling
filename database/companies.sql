-- 公司管理資料表
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(20) UNIQUE NOT NULL,
  tax_id VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  legal_name TEXT NOT NULL,
  manager_id TEXT,
  manager_name VARCHAR(100),
  address TEXT NOT NULL,
  phone VARCHAR(20),
  email TEXT,
  system_account_id TEXT,
  stores TEXT[] DEFAULT '{}',
  employees TEXT[] DEFAULT '{}',
  account_status VARCHAR(20) NOT NULL DEFAULT '啟用',
  business_status VARCHAR(20) NOT NULL DEFAULT '營運中',
  established_date DATE,
  registered_capital DECIMAL(15,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_companies_uid ON companies(uid);
CREATE INDEX idx_companies_tax_id ON companies(tax_id);
CREATE INDEX idx_companies_status ON companies(account_status);

-- 插入範例資料
INSERT INTO companies (uid, tax_id, name, legal_name, manager_id, manager_name, address, phone, email, system_account_id, stores, employees, account_status, business_status, established_date, registered_capital, description) VALUES
('CO-2026-001', '12345678', '耐克台灣股份有限公司', '耐克台灣股份有限公司', 'user-002', '張總經理', '台北市信義區松仁路100號12樓', '02-8789-1234', 'contact@nike.com.tw', 'user-002', ARRAY['store-001', 'store-002', 'store-003'], ARRAY['user-003', 'user-004', 'user-005'], '啟用', '營運中', '2015-06-15', 50000000.00, '全球知名運動品牌台灣分公司'),
('CO-2026-002', '87654321', '阿迪達斯台灣股份有限公司', '阿迪達斯台灣股份有限公司', 'user-010', '李總經理', '台北市大安區敦化南路二段76號15樓', '02-2700-5678', 'info@adidas.com.tw', 'user-010', ARRAY['store-004', 'store-005', 'store-006'], ARRAY['user-011', 'user-012', 'user-013'], '啟用', '營運中', '2014-03-20', 45000000.00, '德國運動品牌台灣總代理'),
('CO-2026-003', '98765432', '優衣庫台灣股份有限公司', '優衣庫台灣股份有限公司', 'user-014', '王總經理', '台北市中山區南京東路三段217號14樓', '02-2508-1234', 'service@uniqlo.com.tw', 'user-014', ARRAY['store-007', 'store-008'], ARRAY['user-015', 'user-016'], '試用中', '營運中', '2018-09-01', 30000000.00, '日本服飾品牌台灣分公司');

-- 創建觸發器更新 updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE
    ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
