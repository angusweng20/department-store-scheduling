#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
簡化版 FastAPI 應用 - 用於測試基本連接
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

# 測試環境變數
@app.get("/env-test")
async def env_test():
    """測試環境變數"""
    return {
        "supabase_url": os.getenv("SUPABASE_URL") is not None,
        "line_token": os.getenv("LINE_CHANNEL_ACCESS_TOKEN") is not None,
        "line_secret": os.getenv("LINE_CHANNEL_SECRET") is not None,
        "env_vars": {
            "SUPABASE_URL": "✅" if os.getenv("SUPABASE_URL") else "❌",
            "LINE_CHANNEL_ACCESS_TOKEN": "✅" if os.getenv("LINE_CHANNEL_ACCESS_TOKEN") else "❌",
            "LINE_CHANNEL_SECRET": "✅" if os.getenv("LINE_CHANNEL_SECRET") else "❌"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
