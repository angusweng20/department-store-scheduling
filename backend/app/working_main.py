#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
工作版本 - 基本功能 + 健康檢查
"""

import os
from datetime import datetime
from fastapi import FastAPI
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

# 模擬員工資料 (暫時不連接 Supabase)
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

# LINE Webhook (暫時簡化)
@app.post("/webhook/line")
async def line_webhook():
    """LINE Bot Webhook 處理"""
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
