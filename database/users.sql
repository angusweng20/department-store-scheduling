-- 人員管理資料表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uid VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone VARCHAR(20),
  employee_id VARCHAR(20) UNIQUE,
  line_user_id VARCHAR(50),
  position VARCHAR(100),
  original_role VARCHAR(50) NOT NULL,
  所属单位 TEXT,
  current_store UUID REFERENCES stores(id),
  management_scope TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT '在職',
  test_mode_enabled BOOLEAN DEFAULT false,
  current_simulated_role VARCHAR(50),
  temporary_target TEXT,
  email TEXT,
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_line_user_id ON users(line_user_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_current_store ON users(current_store);

-- 插入範例資料
INSERT INTO users (uid, name, phone, employee_id, line_user_id, position, original_role, 所属单位, current_store, management_scope, status, test_mode_enabled, current_simulated_role, temporary_target, email, role) VALUES
('USR-2026-001', '系統管理員', '0912345678', 'EMP001', 'U1234567890', '系統管理員', 'system_admin', NULL, NULL, ARRAY['dept-001', 'dept-002', 'dept-003'], '在職', true, NULL, NULL, 'admin@department-store.com', 'system_admin'),
('USR-2026-002', '張總經理', '0923456789', 'EMP002', 'AREA_MANAGER_USER', '總經理', 'hq_admin', 'company-001', NULL, ARRAY['store-001', 'store-002', 'store-003'], '在職', false, NULL, NULL, 'zhang@nike.com.tw', 'hq_admin'),
('USR-2026-003', '陳樓管', '0934567890', 'EMP003', 'FLOOR_MANAGER_USER', '樓管', 'floor_manager', 'dept-001', NULL, ARRAY['store-001', 'store-002'], '在職', false, NULL, NULL, 'chen@skm-a11.com.tw', 'floor_manager'),
('USR-2026-004', '李櫃長', '0945678901', 'EMP004', 'STORE_MANAGER_USER', '櫃長', 'store_manager', 'company-001', (SELECT id FROM stores WHERE uid = 'ST-2026-001'), ARRAY['store-001'], '在職', false, NULL, NULL, 'li@nike-a11.com.tw', 'store_manager'),
('USR-2026-005', '王專員', '0955555555', 'EMP005', 'STAFF_USER', '銷售專員', 'staff', 'company-001', (SELECT id FROM stores WHERE uid = 'ST-2026-001'), ARRAY[], '在職', false, NULL, NULL, 'wang@nike-a11.com.tw', 'staff'),
('USR-2026-006', '測試人員', '0966666666', 'EMP006', 'TESTER_USER', '測工程師', 'tester', NULL, NULL, ARRAY['dept-001', 'dept-002'], '在職', true, 'store_manager', 'store-001', 'tester@department-store.com', 'tester');

-- 創建觸發器更新 updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
    ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
