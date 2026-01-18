#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
手動建立範例資料
"""

import os
import requests
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def create_manual_data():
    """手動建立範例資料"""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        headers = {
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        print("🏷️ 建立更多品牌...")
        
        # 建立更多品牌
        brands = [
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
                brand_data = response.json()
                print(f"✅ 品牌建立成功: {brand['name']} (ID: {brand_data['id']})")
            else:
                print(f"⚠️ 品牌可能已存在: {brand['name']}")
        
        print("\n👥 建立員工...")
        
        # 建立員工
        staff = [
            {"employee_id": "E001", "name": "王小美", "phone": "0912-345-678", "monthly_available_hours": 160, "min_rest_days_per_month": 8, "line_user_id": "U1234567890"},
            {"employee_id": "E002", "name": "李小雅", "phone": "0912-345-679", "monthly_available_hours": 160, "min_rest_days_per_month": 8, "line_user_id": "U1234567891"},
            {"employee_id": "E003", "name": "張小婷", "phone": "0912-345-680", "monthly_available_hours": 150, "min_rest_days_per_month": 8, "line_user_id": "U1234567892"},
            {"employee_id": "E004", "name": "陳小雯", "phone": "0912-345-681", "monthly_available_hours": 150, "min_rest_days_per_month": 8, "line_user_id": "U1234567893"}
        ]
        
        for person in staff:
            response = requests.post(
                f"{supabase_url}/rest/v1/staff",
                headers=headers,
                json=person
            )
            if response.status_code in [200, 201]:
                staff_data = response.json()
                print(f"✅ 員工建立成功: {person['name']} ({person['employee_id']})")
            else:
                print(f"⚠️ 員工可能已存在: {person['name']}")
        
        print("\n📅 建立一些排班...")
        
        # 獲取員工和班別資料
        staff_response = requests.get(f"{supabase_url}/rest/v1/staff", headers=headers)
        staff_list = staff_response.json()
        
        shifts_response = requests.get(f"{supabase_url}/rest/v1/shift_types", headers=headers)
        shift_types = shifts_response.json()
        
        # 建立幾個範例排班
        from datetime import date, timedelta
        
        schedules = [
            {
                "staff_id": staff_list[0]['id'] if len(staff_list) > 0 else None,
                "shift_type_id": shift_types[0]['id'] if len(shift_types) > 0 else None,  # 早班
                "schedule_date": (date.today() + timedelta(days=1)).isoformat(),
                "status": "scheduled",
                "notes": "測試排班1"
            },
            {
                "staff_id": staff_list[1]['id'] if len(staff_list) > 1 else None,
                "shift_type_id": shift_types[1]['id'] if len(shift_types) > 1 else None,  # 晚班
                "schedule_date": (date.today() + timedelta(days=1)).isoformat(),
                "status": "scheduled",
                "notes": "測試排班2"
            }
        ]
        
        for schedule in schedules:
            if schedule['staff_id'] and schedule['shift_type_id']:
                response = requests.post(
                    f"{supabase_url}/rest/v1/schedules",
                    headers=headers,
                    json=schedule
                )
                if response.status_code in [200, 201]:
                    print(f"✅ 排班建立成功: {schedule['notes']}")
                else:
                    print(f"❌ 排班建立失敗: {response.status_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ 建立資料失敗: {e}")
        return False

def main():
    """主程式"""
    print("=== 手動建立範例資料 ===")
    
    if create_manual_data():
        print("\n🎉 資料建立完成！")
        print("\n🚀 現在可以測試系統了：")
        print("1. 啟動 FastAPI 後端")
        print("2. 測試排班檢查器")
        print("3. 設定 LINE Bot")
    else:
        print("\n❌ 資料建立失敗")

if __name__ == "__main__":
    main()
