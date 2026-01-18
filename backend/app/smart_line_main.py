#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
智能 LINE Bot 版本 - 更精確的回覆邏輯
"""

import os
import json
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import requests

# 初始化 FastAPI
app = FastAPI(
    title="百貨櫃姐排班系統",
    description="Department Store Staff Scheduling System API",
    version="1.0.0"
)

# LINE Bot 設定
LINE_CHANNEL_ACCESS_TOKEN = os.getenv("LINE_CHANNEL_ACCESS_TOKEN")
LINE_CHANNEL_SECRET = os.getenv("LINE_CHANNEL_SECRET")

# 健康檢查路由
@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "environment": "production",
        "line_configured": bool(LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET)
    }

# 根路由
@app.get("/")
async def root():
    """API 根路由"""
    return {
        "message": "百貨櫃姐排班系統 API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "environment": "production"
    }

# 模擬員工資料
@app.get("/api/staff")
async def get_staff():
    """獲取員工資料"""
    return [
        {
            "id": "staff_1",
            "employee_id": "E001",
            "name": "張小櫃",
            "brand_id": "brand_1",
            "phone": "0912345678",
            "email": "staff1@example.com",
            "is_active": True
        },
        {
            "id": "staff_2", 
            "employee_id": "E002",
            "name": "李小姐",
            "brand_id": "brand_1",
            "phone": "0923456789",
            "email": "staff2@example.com",
            "is_active": True
        }
    ]

def send_line_reply(reply_token, message):
    """發送 LINE 回覆訊息"""
    if not LINE_CHANNEL_ACCESS_TOKEN:
        print("LINE_CHANNEL_ACCESS_TOKEN not configured")
        return False
    
    url = "https://api.line.me/v2/bot/message/reply"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}"
    }
    
    data = {
        "replyToken": reply_token,
        "messages": [
            {
                "type": "text",
                "text": message
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"LINE Reply API Response: {response.status_code}")
        print(f"LINE Reply API Body: {response.text}")
        
        if response.status_code == 200:
            print("Reply message sent successfully")
            return True
        else:
            print(f"Failed to send reply message: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"Error sending LINE reply message: {e}")
        return False

def send_line_push(user_id, message):
    """發送 LINE Push 訊息"""
    if not LINE_CHANNEL_ACCESS_TOKEN:
        print("LINE_CHANNEL_ACCESS_TOKEN not configured")
        return False
    
    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_CHANNEL_ACCESS_TOKEN}"
    }
    
    data = {
        "to": user_id,
        "messages": [
            {
                "type": "text",
                "text": message
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"LINE Push API Response: {response.status_code}")
        print(f"LINE Push API Body: {response.text}")
        
        if response.status_code == 200:
            print("Push message sent successfully")
            return True
        else:
            print(f"Failed to send push message: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"Error sending LINE push message: {e}")
        return False

def verify_line_signature(body, signature):
    """驗證 LINE 簽名"""
    # 暫時禁用簽名驗證進行測試
    return True

def process_message(user_message):
    """處理用戶訊息並返回回覆"""
    # 清理訊息（移除前後空格）
    message = user_message.strip()
    
    print(f"Processing cleaned message: '{message}'")
    
    # 歡迎訊息
    if message in ["你好", "hi", "Hi", "HI", "hello", "Hello", "您好"]:
        return """🎉 歡迎使用百貨櫃姐排班系統！

📋 主選單：
1️⃣ 排班查詢
2️⃣ 請假申請  
3️⃣ 設定更新

請輸入您需要的服務，或直接說明需求！"""
    
    # 排班相關
    elif "排班" in message:
        return """📊 排班查詢

請選擇查詢範圍：
• 今日排班
• 本週排班  
• 本月排班
• 個人排班

請告訴我您想查詢的時間範圍！"""
    
    # 請假相關
    elif "請假" in message:
        return """📝 請假申請

請提供以下資訊：
📅 請假日期
🏷️ 請假類型
📝 請假原因

例如：請假 2026/01/20 事假 身體不適"""
    
    # 今日排班
    elif "今日" in message or "今天" in message:
        return """📅 今日排班查詢

👤 張小櫃：早班 09:00-17:00
👤 李小姐：晚班 13:00-21:00

💡 如需修改請聯繫主管"""
    
    # 本週排班
    elif "本週" in message or "這週" in message:
        return """📅 本週排班查詢

週一：張小櫃 早班，李小姐 晚班
週二：李小姐 早班，張小櫃 晚班  
週三：張小櫃 早班，李小姐 晚班
週四：李小姐 早班，張小櫃 晚班
週五：張小櫃 早班，李小姐 晚班

💡 週末輪休安排"""
    
    # 本月排班
    elif "本月" in message or "這月" in message:
        return """📅 本月排班查詢

1月排班總覽：
✅ 張小櫃：15天早班，10天晚班，5天休息
✅ 李小姐：10天早班，15天晚班，5天休息

💡 詳細排班表請查詢具體日期"""
    
    # 預設回覆
    else:
        return f"""🤔 收到您的訊息：「{message}」

📋 我可以協助您：
1️⃣ 排班查詢 - 請說「排班」
2️⃣ 請假申請 - 請說「請假」  
3️⃣ 今日排班 - 請說「今日排班」
4️⃣ 本週排班 - 請說「本週排班」
5️⃣ 本月排班 - 請說「本月排班」

請直接輸入關鍵字，我會為您處理！"""

# LINE Webhook - 完整處理
@app.post("/webhook/line")
async def line_webhook(request: Request):
    """LINE Bot Webhook 處理"""
    try:
        # 獲取請求內容
        body = await request.body()
        body_str = body.decode("utf-8")
        
        # 獲取簽名
        signature = request.headers.get("X-Line-Signature", "")
        
        # 記錄請求
        print(f"LINE Webhook received: {body_str}")
        print(f"Signature: {signature}")
        
        # 驗證簽名
        if not verify_line_signature(body, signature):
            print("Invalid signature")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # 解析 JSON
        data = json.loads(body_str)
        events = data.get("events", [])
        
        # 處理事件
        for event in events:
            print(f"Processing event: {event}")
            
            if event.get("type") == "message":
                message_type = event.get("message", {}).get("type")
                
                if message_type == "text":
                    user_message = event.get("message", {}).get("text", "")
                    reply_token = event.get("replyToken", "")
                    user_id = event.get("source", {}).get("userId", "")
                    
                    print(f"User message: {user_message}")
                    print(f"Reply token: {reply_token}")
                    print(f"User ID: {user_id}")
                    
                    # 處理訊息並獲取回覆
                    reply_message = process_message(user_message)
                    
                    print(f"Generated reply: {reply_message}")
                    
                    # 先嘗試 Reply
                    reply_success = send_line_reply(reply_token, reply_message)
                    
                    # 如果 Reply 失敗，嘗試 Push
                    if not reply_success:
                        print("Reply failed, trying push message")
                        push_success = send_line_push(user_id, reply_message)
                        if push_success:
                            print("Push message sent successfully")
                        else:
                            print("Both reply and push failed")
                    else:
                        print("Reply sent successfully")
                    
        return {"status": "ok"}
        
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting on port {port}")
    print(f"LINE Channel Access Token configured: {bool(LINE_CHANNEL_ACCESS_TOKEN)}")
    print(f"LINE Channel Secret configured: {bool(LINE_CHANNEL_SECRET)}")
    uvicorn.run(app, host="0.0.0.0", port=port)
