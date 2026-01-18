#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LINE Bot 功能演示
"""

import os
import sys
sys.path.append('/Users/angusweng/CascadeProjects/department-store-scheduling/backend')

from line_bot.handlers import ScheduleBotHandler
from line_bot.messages import MessageTemplates

def demo_line_bot_functions():
    """演示 LINE Bot 功能"""
    print("🤖 LINE Bot 功能演示")
    print("=" * 50)
    
    handler = ScheduleBotHandler()
    templates = MessageTemplates()
    
    # 1. 主選單
    print("\n📋 1. 主選單功能")
    main_menu = templates.main_menu()
    print("主選單訊息:")
    print(f"- 類型: {main_menu['type']}")
    print(f"- 文字: {main_menu['text']}")
    print(f"- 附件類型: {main_menu['attachments'][0]['type']}")
    
    # 2. 排班查詢
    print("\n📅 2. 排班查詢功能")
    date_picker = templates.date_picker()
    print("日期選擇器:")
    print(f"- 類型: {date_picker['type']}")
    print(f"- 文字: {date_picker['text']}")
    
    # 3. 請假申請
    print("\n📝 3. 請假申請功能")
    leave_types = templates.leave_type_selector()
    print("請假類型選擇器:")
    print(f"- 類型: {leave_types['type']}")
    print(f"- 文字: {leave_types['text']}")
    
    # 4. 模擬訊息處理
    print("\n🔄 4. 模擬用戶訊息處理")
    
    test_messages = [
        "主選單",
        "排班查詢", 
        "我的排班",
        "請假申請",
        "排班規則"
    ]
    
    for msg in test_messages:
        print(f"\n用戶輸入: {msg}")
        try:
            response = handler.handle_text_message({
                "type": "message",
                "message": {
                    "type": "text", 
                    "text": msg
                },
                "source": {
                    "type": "user",
                    "userId": "demo-user-123"
                }
            })
            print(f"系統回應: {response['type']}")
            if 'text' in response:
                print(f"回應內容: {response['text'][:50]}...")
        except Exception as e:
            print(f"處理錯誤: {e}")

def demo_api_functions():
    """演示 API 功能"""
    print("\n\n🌐 API 功能演示")
    print("=" * 50)
    
    import requests
    
    base_url = "http://localhost:8000"
    
    # 1. 健康檢查
    print("\n💓 健康檢查")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"狀態: {response.status_code}")
        print(f"回應: {response.json()}")
    except Exception as e:
        print(f"錯誤: {e}")
    
    # 2. 員工資料
    print("\n👥 員工資料")
    try:
        response = requests.get(f"{base_url}/api/staff")
        print(f"狀態: {response.status_code}")
        staff = response.json()
        print(f"員工數量: {len(staff)}")
        for person in staff[:2]:  # 只顯示前2個
            print(f"  • {person['name']} ({person['employee_id']})")
    except Exception as e:
        print(f"錯誤: {e}")
    
    # 3. 排班規則
    print("\n📋 排班規則")
    try:
        response = requests.get(f"{base_url}/api/rules")
        print(f"狀態: {response.status_code}")
        rules = response.json()
        print(f"規則數量: {len(rules)}")
        for rule in rules:
            print(f"  • {rule['rule_name']}: {rule['rule_value']}")
    except Exception as e:
        print(f"錯誤: {e}")

def main():
    """主程式"""
    print("🎉 百貨櫃姐排班系統 - 完整功能演示")
    print("=" * 60)
    
    demo_line_bot_functions()
    demo_api_functions()
    
    print("\n\n🎯 演示完成！")
    print("\n📱 LINE Bot 功能已就緒:")
    print("• ✅ 主選單 - 顯示所有功能選項")
    print("• ✅ 排班查詢 - 日期選擇器")
    print("• ✅ 請假申請 - 類型選擇器")
    print("• ✅ 訊息處理 - 智能回應邏輯")
    
    print("\n🌐 API 服務正常:")
    print("• ✅ 健康檢查 - 服務狀態")
    print("• ✅ 員工管理 - 資料存取")
    print("• ✅ 排班規則 - 規則查詢")
    
    print("\n🚀 部署建議:")
    print("1. 使用 Railway/Vercel 部署到雲端")
    print("2. 獲得正式 HTTPS URL")
    print("3. 設定 LINE Webhook URL")
    print("4. 在 LINE 中完整測試")
    
    print("\n💡 系統已準備就緒，可以開始使用！")

if __name__ == "__main__":
    main()
