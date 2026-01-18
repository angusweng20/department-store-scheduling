#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LINE Bot 本地測試腳本
"""

import os
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def check_line_bot_config():
    """檢查 LINE Bot 設定"""
    print("🔍 檢查 LINE Bot 設定...")
    
    access_token = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
    channel_secret = os.getenv("LINE_CHANNEL_SECRET")
    
    if not access_token:
        print("❌ 缺少 LINE_CHANNEL_ACCESS_TOKEN")
        return False
    
    if not channel_secret:
        print("❌ 缺少 LINE_CHANNEL_SECRET")
        return False
    
    print(f"✅ Access Token: {access_token[:20]}...")
    print(f"✅ Channel Secret: {channel_secret[:10]}...")
    
    return True

def generate_ngrok_url():
    """生成 ngrok URL 建議"""
    print("\n🌐 Ngrok 設定建議：")
    print("1. 啟動後端服務：")
    print("   cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000")
    print("\n2. 在新終端視窗啟動 ngrok：")
    print("   ngrok http 8000")
    print("\n3. 複製 ngrok 提供的 https URL")
    print("\n4. 設定 Webhook URL：")
    print("   https://your-ngrok-url.ngrok.io/webhook/line")
    print("\n5. 在 LINE Developers Console 設定 Webhook URL")

def main():
    """主程式"""
    print("=== LINE Bot 設定檢查 ===")
    
    if check_line_bot_config():
        generate_ngrok_url()
        
        print("\n📱 LINE Bot 使用流程：")
        print("1. 在 LINE 中搜尋您的 Bot 或掃描 QR Code")
        print("2. 發送 '主選單' 開始使用")
        print("3. 嘗試各項功能：排班查詢、我的排班、請假申請")
        
        print("\n🎯 測試指令：")
        print("• 主選單 - 顯示主要功能")
        print("• 排班查詢 - 查詢特定日期排班")
        print("• 我的排班 - 查看個人排班")
        print("• 請假申請 - 申請請假")
        print("• 排班規則 - 查看排班規定")
        print("• 聯絡管理員 - 獲取聯絡方式")
        
    else:
        print("\n❌ 請先設定 LINE Bot 憑證")
        print("📋 設定步驟：")
        print("1. 前往 https://developers.line.biz/")
        print("2. 建立新的 Provider 和 Channel")
        print("3. 獲取 Channel Access Token 和 Secret")
        print("4. 更新 .env 檔案")

if __name__ == "__main__":
    main()
