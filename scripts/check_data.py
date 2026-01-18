#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
檢查資料庫內容
"""

import os
import requests
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def check_database_content():
    """檢查資料庫內容"""
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        headers = {
            'apikey': service_key,
            'Authorization': f'Bearer {service_key}',
            'Content-Type': 'application/json'
        }
        
        print("🔍 檢查資料庫內容...")
        
        # 檢查品牌
        brands_response = requests.get(f"{supabase_url}/rest/v1/brands", headers=headers)
        brands = brands_response.json()
        print(f"📊 品牌數量: {len(brands)}")
        for brand in brands:
            print(f"  • {brand['name']} ({brand['code']})")
        
        # 檢查員工
        staff_response = requests.get(f"{supabase_url}/rest/v1/staff", headers=headers)
        staff = staff_response.json()
        print(f"\n👥 員工數量: {len(staff)}")
        for person in staff:
            print(f"  • {person['name']} ({person['employee_id']})")
        
        # 檢查班別
        shifts_response = requests.get(f"{supabase_url}/rest/v1/shift_types", headers=headers)
        shifts = shifts_response.json()
        print(f"\n⏰ 班別數量: {len(shifts)}")
        for shift in shifts:
            print(f"  • {shift['name']} ({shift['start_time']}-{shift['end_time']})")
        
        # 檢查排班
        schedules_response = requests.get(f"{supabase_url}/rest/v1/schedules?limit=10", headers=headers)
        schedules = schedules_response.json()
        print(f"\n📅 排班記錄數量: {len(schedules)} (顯示前10筆)")
        for schedule in schedules:
            print(f"  • {schedule['schedule_date']} - {schedule['notes']}")
        
        # 檢查規則
        rules_response = requests.get(f"{supabase_url}/rest/v1/scheduling_rules", headers=headers)
        rules = rules_response.json()
        print(f"\n📋 排班規則數量: {len(rules)}")
        for rule in rules:
            print(f"  • {rule['rule_name']}: {rule['rule_value']}")
        
        return True
        
    except Exception as e:
        print(f"❌ 檢查失敗: {e}")
        return False

if __name__ == "__main__":
    check_database_content()
