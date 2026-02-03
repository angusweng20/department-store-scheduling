-- 修復權限問題：禁用 RLS 並設置公開權限

-- 禁用所有表格的 RLS
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 設置公開權限
GRANT ALL ON departments TO anon;
GRANT ALL ON companies TO anon;
GRANT ALL ON stores TO anon;
GRANT ALL ON users TO anon;

-- 設置序列權限
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 檢查權限
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
