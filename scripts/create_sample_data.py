#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
建立範例資料腳本
"""

import os
import requests
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

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
        
        brand_ids = {}
        for brand in brands:
            response = requests.post(
                f"{supabase_url}/rest/v1/brands",
                headers=headers,
                json=brand
            )
            if response.status_code in [200, 201]:
                brand_data = response.json()
                brand_ids[brand['code']] = brand_data['id']
                print(f"✅ 品牌建立成功: {brand['name']} (ID: {brand_data['id']})")
            else:
                print(f"❌ 品牌建立失敗: {brand['name']} - {response.status_code}")
                print(f"錯誤: {response.text}")
        
        print("👥 正在建立範例員工資料...")
        
        # 建立員工
        staff = [
            {"employee_id": "E001", "name": "王小美", "brand_id": brand_ids.get("SKII"), "phone": "0912-345-678", "monthly_available_hours": 160, "min_rest_days_per_month": 8, "line_user_id": "U1234567890"},
            {"employee_id": "E002", "name": "李小雅", "brand_id": brand_ids.get("SKII"), "phone": "0912-345-679", "monthly_available_hours": 160, "min_rest_days_per_month": 8, "line_user_id": "U1234567891"},
            {"employee_id": "E003", "name": "張小婷", "brand_id": brand_ids.get("LANCOME"), "phone": "0912-345-680", "monthly_available_hours": 150, "min_rest_days_per_month": 8, "line_user_id": "U1234567892"},
            {"employee_id": "E004", "name": "陳小雯", "brand_id": brand_ids.get("LANCOME"), "phone": "0912-345-681", "monthly_available_hours": 150, "min_rest_days_per_month": 8, "line_user_id": "U1234567893"},
            {"employee_id": "E005", "name": "林小萱", "brand_id": brand_ids.get("ESTEE"), "phone": "0912-345-682", "monthly_available_hours": 140, "min_rest_days_per_month": 8, "line_user_id": "U1234567894"},
            {"employee_id": "E006", "name": "黃小婷", "brand_id": brand_ids.get("SHISEIDO"), "phone": "0912-345-683", "monthly_available_hours": 140, "min_rest_days_per_month": 8, "line_user_id": "U1234567895"}
        ]
        
        staff_ids = {}
        for person in staff:
            response = requests.post(
                f"{supabase_url}/rest/v1/staff",
                headers=headers,
                json=person
            )
            if response.status_code in [200, 201]:
                staff_data = response.json()
                staff_ids[person['employee_id']] = staff_data['id']
                print(f"✅ 員工建立成功: {person['name']} ({person['employee_id']})")
            else:
                print(f"❌ 員工建立失敗: {person['name']} - {response.status_code}")
                print(f"錯誤: {response.text}")
        
        print("📅 正在建立範例排班資料...")
        
        # 獲取班別資料
        shift_response = requests.get(f"{supabase_url}/rest/v1/shift_types", headers=headers)
        shift_types = shift_response.json()
        
        from datetime import date, timedelta
        import random
        
        # 生成一個月的排班
        base_date = date(2024, 1, 1)
        schedules_created = 0
        
        for day in range(1, 32):  # 1月有31天
            current_date = base_date + timedelta(days=day - 1)
            weekday = current_date.weekday()  # 0=週一, 6=週日
            
            # 週末排班 (人數較少)
            if weekday >= 5:  # 週六、週日
                selected_staff_ids = random.sample(list(staff_ids.values()), min(3, len(staff_ids)))
                
                for staff_id in selected_staff_ids:
                    # 週末主要排早班
                    shift_type = random.choice(["早班", "早班", "全日班"])
                    shift_id = next(s['id'] for s in shift_types if s['name'] == shift_type)
                    
                    schedule_data = {
                        "staff_id": staff_id,
                        "shift_type_id": shift_id,
                        "schedule_date": current_date.isoformat(),
                        "status": "scheduled",
                        "notes": f"週末{shift_type}"
                    }
                    
                    response = requests.post(
                        f"{supabase_url}/rest/v1/schedules",
                        headers=headers,
                        json=schedule_data
                    )
                    if response.status_code in [200, 201]:
                        schedules_created += 1
            
            else:  # 平日
                selected_staff_ids = random.sample(list(staff_ids.values()), min(4, len(staff_ids)))
                
                for i, staff_id in enumerate(selected_staff_ids):
                    # 平日早班和晚班都要有人
                    shift_type = "早班" if i % 2 == 0 else "晚班"
                    shift_id = next(s['id'] for s in shift_types if s['name'] == shift_type)
                    
                    schedule_data = {
                        "staff_id": staff_id,
                        "shift_type_id": shift_id,
                        "schedule_date": current_date.isoformat(),
                        "status": "scheduled",
                        "notes": f"平日{shift_type}"
                    }
                    
                    response = requests.post(
                        f"{supabase_url}/rest/v1/schedules",
                        headers=headers,
                        json=schedule_data
                    )
                    if response.status_code in [200, 201]:
                        schedules_created += 1
        
        print(f"✅ 排班資料建立完成，共建立 {schedules_created} 筆排班記錄")
        
        # 建立排班規則
        print("📋 正在建立排班規則...")
        
        rules = [
            {"rule_name": "每班最少人數", "rule_type": "min_staff_per_shift", "rule_value": 2, "description": "每個班次至少需要2名員工"},
            {"rule_name": "每月最少休息天數", "rule_type": "min_rest_days", "rule_value": 8, "description": "每位員工每月至少休息8天"},
            {"rule_name": "每月最多工作時數", "rule_type": "max_monthly_hours", "rule_value": 200, "description": "每位員工每月最多工作200小時"},
            {"rule_name": "連續工作天數限制", "rule_type": "max_consecutive_days", "rule_value": 6, "description": "員工最多連續工作6天"}
        ]
        
        for rule in rules:
            response = requests.post(
                f"{supabase_url}/rest/v1/scheduling_rules",
                headers=headers,
                json=rule
            )
            if response.status_code in [200, 201]:
                print(f"✅ 規則建立成功: {rule['rule_name']}")
            else:
                print(f"❌ 規則建立失敗: {rule['rule_name']} - {response.status_code}")
        
        return True
        
    except Exception as e:
        print(f"❌ 建立範例資料失敗: {e}")
        return False

def main():
    """主程式"""
    print("=== 建立範例資料 ===")
    
    # 檢查環境變數
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ 缺少環境變數: {missing_vars}")
        return
    
    # 建立範例資料
    if create_sample_data():
        print("\n🎉 範例資料建立完成！")
        print("\n📊 建立的資料包括：")
        print("• 4 個品牌 (SK-II, Lancôme, Estée Lauder, Shiseido)")
        print("• 6 名員工 (E001-E006)")
        print("• 2024年1月完整排班")
        print("• 4 個排班規則")
        print("\n🚀 現在可以測試系統功能了！")
    else:
        print("\n❌ 範例資料建立失敗")

if __name__ == "__main__":
    main()
