#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
資料庫設定腳本 - 執行 SQL 並建立範例資料
"""

import os
import requests
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def execute_sql_via_rest_api():
    """透過 REST API 執行 SQL"""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        # 讀取 SQL 檔案
        with open('/Users/angusweng/CascadeProjects/department-store-scheduling/backend/database/schema.sql', 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print("📄 正在執行 SQL 建立資料表...")
        
        # 使用 Supabase SQL API
        headers = {
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'query': sql_content
        }
        
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            print("✅ SQL 執行成功")
            return True
        else:
            print(f"❌ SQL 執行失敗: {response.status_code}")
            print(f"錯誤內容: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 執行 SQL 失敗: {e}")
        return False

def test_connection():
    """測試基本連接"""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        print("🔗 正在測試 Supabase 連接...")
        
        # 測試基本 API 連接
        headers = {
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}'
        }
        
        response = requests.get(
            f"{supabase_url}/rest/v1/",
            headers=headers
        )
        
        if response.status_code == 200:
            print("✅ Supabase 連接成功")
            return True
        else:
            print(f"❌ Supabase 連接失敗: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ 連接測試失敗: {e}")
        return False

def create_sample_data():
    """建立範例資料"""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        headers = {
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        print("🏷️ 正在建立範例品牌資料...")
        
        # 建立品牌
        brands = [
            {"name": "SK-II", "code": "SKII", "description": "高檔保養品牌"},
            {"name": "Lancôme", "code": "LANCOME", "description": "法國化妝品牌"},
            {"name": "Estée Lauder", "code": "ESTEE", "description": "美國化妝品牌"},
            {"name": "Shiseido", "code": "SHISEIDO", "description": "日本化妝品牌"}
        ]
        
        for brand in brands:
            response = requests.post(
                f"{supabase_url}/rest/v1/brands",
                headers=headers,
                json=brand
            )
            if response.status_code in [200, 201]:
                print(f"✅ 品牌建立成功: {brand['name']}")
            else:
                print(f"❌ 品牌建立失敗: {brand['name']} - {response.status_code}")
        
        print("👥 正在建立範例員工資料...")
        
        # 建立員工
        staff = [
            {"employee_id": "E001", "name": "王小美", "brand_id": "1", "phone": "0912-345-678", "monthly_available_hours": 160},
            {"employee_id": "E002", "name": "李小雅", "brand_id": "1", "phone": "0912-345-679", "monthly_available_hours": 160},
            {"employee_id": "E003", "name": "張小婷", "brand_id": "2", "phone": "0912-345-680", "monthly_available_hours": 150},
            {"employee_id": "E004", "name": "陳小雯", "brand_id": "2", "phone": "0912-345-681", "monthly_available_hours": 150}
        ]
        
        for person in staff:
            response = requests.post(
                f"{supabase_url}/rest/v1/staff",
                headers=headers,
                json=person
            )
            if response.status_code in [200, 201]:
                print(f"✅ 員工建立成功: {person['name']}")
            else:
                print(f"❌ 員工建立失敗: {person['name']} - {response.status_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ 建立範例資料失敗: {e}")
        return False

def main():
    """主程式"""
    print("=== Supabase 資料庫設定工具 ===")
    
    # 檢查環境變數
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ 缺少環境變數: {missing_vars}")
        return
    
    # 1. 測試連接
    if not test_connection():
        return
    
    # 2. 執行 SQL
    if not execute_sql_via_rest_api():
        print("⚠️  SQL 執行失敗，請手動在 Supabase Dashboard 執行 schema.sql")
        print("📋 手動執行步驟:")
        print("1. 進入 Supabase Dashboard")
        print("2. 點擊 SQL Editor")
        print("3. 複製 backend/database/schema.sql 內容")
        print("4. 貼上並執行")
        return
    
    # 3. 建立範例資料
    create_sample_data()
    
    print("\n🎉 資料庫設定完成！")

if __name__ == "__main__":
    main()
