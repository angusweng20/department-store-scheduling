#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
工作版本 - 基本功能 + LINE Bot 處理
"""

import os
import json
from datetime import datetime
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

# 初始化 FastAPI
app = FastAPI(
    title="百貨櫃姐排班系統",
    description="Department Store Staff Scheduling System API",
    version="1.0.0"
)

# 健康檢查路由
@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "environment": "production"
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
                    
                    print(f"User message: {user_message}")
                    print(f"Reply token: {reply_token}")
                    
                    # 簡單的回覆邏輯
                    if "你好" in user_message or "hi" in user_message.lower():
                        reply_message = "您好！歡迎使用百貨櫃姐排班系統！\n\n📋 主選單：\n1. 排班查詢\n2. 請假申請\n3. 設定更新\n\n請輸入您需要的服務！"
                    elif "排班" in user_message:
                        reply_message = "📊 排班查詢\n\n請選擇：\n• 今日排班\n• 本週排班\n• 本月排班\n\n請輸入您想查詢的時間範圍！"
                    elif "請假" in user_message:
                        reply_message = "📝 請假申請\n\n請提供：\n• 請假日期\n• 請假類型\n• 請假原因\n\n我們會為您處理申請！"
                    else:
                        reply_message = f"收到您的訊息：{user_message}\n\n📋 主選單：\n1. 排班查詢\n2. 請假申請\n3. 設定更新\n\n請輸入您需要的服務！"
                    
                    # 發送回覆 (這裡只是記錄，實際需要 LINE Bot API)
                    print(f"Reply message: {reply_message}")
                    
        return {"status": "ok"}
        
    except Exception as e:
        print(f"Error processing webhook: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
