#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Supabase 設定腳本
自動建立 Supabase 專案、設定資料表和初始資料
"""

import os
import json
import time
from typing import Dict, List, Optional
from supabase import create_client
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

class SupabaseSetup:
    """Supabase 設定管理器"""
    
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not all([self.supabase_url, self.supabase_key, self.supabase_service_key]):
            raise ValueError("請在 .env 檔案中設定 SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY")
        
        self.client = create_client(self.supabase_url, self.supabase_service_key)
    
    def execute_sql_file(self, file_path: str) -> bool:
        """執行 SQL 檔案"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                sql_content = f.read()
            
            # 將 SQL 內容分割成個別語句
            sql_statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
            
            print(f"📄 正在執行 SQL 檔案: {file_path}")
            print(f"📊 共有 {len(sql_statements)} 個 SQL 語句")
            
            success_count = 0
            for i, statement in enumerate(sql_statements, 1):
                try:
                    # 跳過註解和空語句
                    if statement.startswith('--') or not statement.strip():
                        continue
                    
                    print(f"執行語句 {i}/{len(sql_statements)}: {statement[:50]}...")
                    
                    # 使用 Supabase RPC 執行 SQL
                    result = self.client.rpc('exec_sql', {'sql': statement}).execute()
                    success_count += 1
                    
                except Exception as e:
                    print(f"❌ 語句 {i} 執行失敗: {e}")
                    print(f"語句內容: {statement}")
                    continue
            
            print(f"✅ SQL 執行完成，成功 {success_count}/{len(sql_statements)} 個語句")
            return True
            
        except FileNotFoundError:
            print(f"❌ 找不到 SQL 檔案: {file_path}")
            return False
        except Exception as e:
            print(f"❌ 執行 SQL 檔案失敗: {e}")
            return False
    
    def create_sample_brands(self) -> bool:
        """建立範例品牌資料"""
        try:
            brands_data = [
                {
                    "name": "SK-II",
                    "code": "SKII", 
                    "description": "高檔保養品牌"
                },
                {
                    "name": "Lancôme",
                    "code": "LANCOME",
                    "description": "法國化妝品牌"
                },
                {
                    "name": "Estée Lauder",
                    "code": "ESTEE",
                    "description": "美國化妝品牌"
                },
                {
                    "name": "Shiseido",
                    "code": "SHISEIDO",
                    "description": "日本化妝品牌"
                }
            ]
            
            print("🏷️ 正在建立範例品牌資料...")
            
            for brand in brands_data:
                result = self.client.table('brands').insert(brand).execute()
                if result.data:
                    print(f"✅ 品牌建立成功: {brand['name']}")
                else:
                    print(f"❌ 品牌建立失敗: {brand['name']}")
            
            return True
            
        except Exception as e:
            print(f"❌ 建立品牌資料失敗: {e}")
            return False
    
    def create_sample_staff(self) -> bool:
        """建立範例員工資料"""
        try:
            # 先獲取品牌 ID
            brands_result = self.client.table('brands').select('*').execute()
            brands = {brand['code']: brand['id'] for brand in brands_result.data}
            
            staff_data = [
                {
                    "employee_id": "E001",
                    "name": "王小美",
                    "brand_id": brands.get("SKII"),
                    "phone": "0912-345-678",
                    "email": "wang@department.com",
                    "monthly_available_hours": 160,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567890"
                },
                {
                    "employee_id": "E002", 
                    "name": "李小雅",
                    "brand_id": brands.get("SKII"),
                    "phone": "0912-345-679",
                    "email": "lee@department.com",
                    "monthly_available_hours": 160,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567891"
                },
                {
                    "employee_id": "E003",
                    "name": "張小婷", 
                    "brand_id": brands.get("LANCOME"),
                    "phone": "0912-345-680",
                    "email": "chang@department.com",
                    "monthly_available_hours": 150,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567892"
                },
                {
                    "employee_id": "E004",
                    "name": "陳小雯",
                    "brand_id": brands.get("LANCOME"), 
                    "phone": "0912-345-681",
                    "email": "chen@department.com",
                    "monthly_available_hours": 150,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567893"
                },
                {
                    "employee_id": "E005",
                    "name": "林小萱",
                    "brand_id": brands.get("ESTEE"),
                    "phone": "0912-345-682", 
                    "email": "lin@department.com",
                    "monthly_available_hours": 140,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567894"
                },
                {
                    "employee_id": "E006",
                    "name": "黃小婷",
                    "brand_id": brands.get("SHISEIDO"),
                    "phone": "0912-345-683",
                    "email": "huang@department.com", 
                    "monthly_available_hours": 140,
                    "min_rest_days_per_month": 8,
                    "line_user_id": "U1234567895"
                }
            ]
            
            print("👥 正在建立範例員工資料...")
            
            for staff in staff_data:
                result = self.client.table('staff').insert(staff).execute()
                if result.data:
                    print(f"✅ 員工建立成功: {staff['name']} ({staff['employee_id']})")
                else:
                    print(f"❌ 員工建立失敗: {staff['name']}")
            
            return True
            
        except Exception as e:
            print(f"❌ 建立員工資料失敗: {e}")
            return False
    
    def create_sample_schedules(self) -> bool:
        """建立範例排班資料"""
        try:
            # 獲取員工和班別資料
            staff_result = self.client.table('staff').select('*').execute()
            staff_list = staff_result.data
            
            shift_result = self.client.table('shift_types').select('*').execute()
            shift_types = {shift['name']: shift['id'] for shift in shift_result.data}
            
            from datetime import date, timedelta
            import random
            
            print("📅 正在建立範例排班資料...")
            
            base_date = date(2024, 1, 1)
            schedules_created = 0
            
            # 生成一個月的排班
            for day in range(1, 32):  # 1月有31天
                current_date = base_date + timedelta(days=day - 1)
                weekday = current_date.weekday()  # 0=週一, 6=週日
                
                # 週末排班 (人數較少)
                if weekday >= 5:  # 週六、週日
                    # 隨機選擇 2-3 名員工
                    selected_staff = random.sample(staff_list, min(3, len(staff_list)))
                    
                    for staff in selected_staff:
                        # 週末主要排早班
                        shift_type = random.choice(["早班", "早班", "全日班"])
                        
                        schedule_data = {
                            "staff_id": staff['id'],
                            "shift_type_id": shift_types[shift_type],
                            "schedule_date": current_date.isoformat(),
                            "status": "scheduled",
                            "notes": f"週末{shift_type}"
                        }
                        
                        result = self.client.table('schedules').insert(schedule_data).execute()
                        if result.data:
                            schedules_created += 1
                
                else:  # 平日
                    # 平日排更多人
                    selected_staff = random.sample(staff_list, min(4, len(staff_list)))
                    
                    for i, staff in enumerate(selected_staff):
                        # 平日早班和晚班都要有人
                        shift_type = "早班" if i % 2 == 0 else "晚班"
                        
                        schedule_data = {
                            "staff_id": staff['id'],
                            "shift_type_id": shift_types[shift_type],
                            "schedule_date": current_date.isoformat(),
                            "status": "scheduled",
                            "notes": f"平日{shift_type}"
                        }
                        
                        result = self.client.table('schedules').insert(schedule_data).execute()
                        if result.data:
                            schedules_created += 1
            
            print(f"✅ 排班資料建立完成，共建立 {schedules_created} 筆排班記錄")
            return True
            
        except Exception as e:
            print(f"❌ 建立排班資料失敗: {e}")
            return False
    
    def test_connection(self) -> bool:
        """測試資料庫連接"""
        try:
            print("🔗 正在測試 Supabase 連接...")
            
            # 測試簡單查詢
            result = self.client.table('brands').select('count').execute()
            
            print("✅ Supabase 連接成功")
            return True
            
        except Exception as e:
            print(f"❌ Supabase 連接失敗: {e}")
            return False
    
    def setup_complete_database(self) -> bool:
        """完整設定資料庫"""
        try:
            print("🚀 開始完整設定 Supabase 資料庫...")
            
            # 1. 測試連接
            if not self.test_connection():
                return False
            
            # 2. 執行 schema.sql
            schema_path = "/Users/angusweng/CascadeProjects/department-store-scheduling/backend/database/schema.sql"
            if not self.execute_sql_file(schema_path):
                return False
            
            # 等待資料表建立完成
            print("⏳ 等待資料表建立完成...")
            time.sleep(3)
            
            # 3. 建立範例資料
            if not self.create_sample_brands():
                return False
            
            if not self.create_sample_staff():
                return False
            
            if not self.create_sample_schedules():
                return False
            
            print("🎉 Supabase 資料庫設定完成！")
            return True
            
        except Exception as e:
            print(f"❌ 資料庫設定失敗: {e}")
            return False


def main():
    """主程式"""
    print("=== Supabase 百貨櫃姐排班系統設定工具 ===")
    
    # 檢查環境變數
    required_env_vars = ["SUPABASE_URL", "SUPABASE_KEY", "SUPABASE_SERVICE_KEY"]
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ 缺少以下環境變數:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n請在 .env 檔案中設定這些變數，或設定系統環境變數。")
        return
    
    try:
        # 建立設定器
        setup = SupabaseSetup()
        
        # 執行完整設定
        success = setup.setup_complete_database()
        
        if success:
            print("\n🎯 設定完成！接下來您可以:")
            print("1. 使用 FastAPI 後端連接到 Supabase")
            print("2. 測試 LINE Bot 功能")
            print("3. 部署到生產環境")
        else:
            print("\n❌ 設定失敗，請檢查錯誤訊息並重試。")
    
    except Exception as e:
        print(f"❌ 設定過程發生錯誤: {e}")


if __name__ == "__main__":
    main()
