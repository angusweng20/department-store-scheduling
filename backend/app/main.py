#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
百貨櫃姐排班系統 - FastAPI 主程式
提供 RESTful API 和 LINE Bot Webhook 功能
"""

import os
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

# LINE Bot 相關
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, PostbackEvent

# 本地模組
from line_bot.handlers import ScheduleBotHandler
from line_bot.messages import MessageTemplates

# 初始化 FastAPI
app = FastAPI(
    title="百貨櫃姐排班系統",
    description="Department Store Staff Scheduling System API",
    version="1.0.0"
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LINE Bot 初始化
line_bot_api = LineBotApi(os.getenv("LINE_CHANNEL_ACCESS_TOKEN"))
handler = WebhookHandler(os.getenv("LINE_CHANNEL_SECRET"))
bot_handler = ScheduleBotHandler(line_bot_api, handler)

# 資料模型
class Staff(BaseModel):
    id: Optional[str] = None
    employee_id: str
    name: str
    brand_id: str
    phone: Optional[str] = None
    email: Optional[str] = None
    monthly_available_hours: int = 160
    min_rest_days_per_month: int = 8
    is_active: bool = True
    line_user_id: Optional[str] = None

class Schedule(BaseModel):
    id: Optional[str] = None
    staff_id: str
    shift_type_id: str
    schedule_date: str
    status: str = "scheduled"
    notes: Optional[str] = None
    created_by: Optional[str] = None

class SchedulingRule(BaseModel):
    id: Optional[str] = None
    brand_id: Optional[str] = None
    rule_name: str
    rule_type: str
    rule_value: int
    description: Optional[str] = None
    is_active: bool = True

# 記憶體資料儲存 (實際應用中應使用 Supabase)
staff_db = {}
schedule_db = {}
rules_db = {}

# 根路由
@app.get("/")
async def root():
    """API 根路由"""
    return {
        "message": "百貨櫃姐排班系統 API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

# LINE Bot Webhook
@app.post("/webhook/line")
async def line_webhook(request: Request):
    """LINE Bot Webhook 處理"""
    signature = request.headers.get("X-Line-Signature", "")
    body = await request.body()
    
    try:
        handler.handle(body.decode("utf-8"), signature)
    except InvalidSignatureError:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    return JSONResponse(content={"status": "ok"})

# LINE Bot 事件處理器
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    """處理文字訊息"""
    bot_handler.handle_text_message(event)

@handler.add(PostbackEvent)
def handle_postback(event):
    """處理 Postback 事件"""
    bot_handler.handle_postback(event)

# 員工管理 API
@app.get("/api/staff", response_model=List[Staff])
async def get_all_staff():
    """獲取所有員工資料"""
    return list(staff_db.values())

@app.get("/api/staff/{staff_id}", response_model=Staff)
async def get_staff(staff_id: str):
    """獲取特定員工資料"""
    if staff_id not in staff_db:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff_db[staff_id]

@app.post("/api/staff", response_model=Staff)
async def create_staff(staff: Staff):
    """建立新員工"""
    staff.id = f"staff_{len(staff_db) + 1}"
    staff_db[staff.id] = staff
    return staff

@app.put("/api/staff/{staff_id}", response_model=Staff)
async def update_staff(staff_id: str, staff: Staff):
    """更新員工資料"""
    if staff_id not in staff_db:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    staff.id = staff_id
    staff_db[staff_id] = staff
    return staff

@app.delete("/api/staff/{staff_id}")
async def delete_staff(staff_id: str):
    """刪除員工資料"""
    if staff_id not in staff_db:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    del staff_db[staff_id]
    return {"message": "Staff deleted successfully"}

# 排班管理 API
@app.get("/api/schedules", response_model=List[Schedule])
async def get_schedules(
    staff_id: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None
):
    """獲取排班資料"""
    schedules = list(schedule_db.values())
    
    # 過濾條件
    if staff_id:
        schedules = [s for s in schedules if s.staff_id == staff_id]
    
    if date_from:
        schedules = [s for s in schedules if s.schedule_date >= date_from]
    
    if date_to:
        schedules = [s for s in schedules if s.schedule_date <= date_to]
    
    return schedules

@app.get("/api/schedules/{schedule_id}", response_model=Schedule)
async def get_schedule(schedule_id: str):
    """獲取特定排班資料"""
    if schedule_id not in schedule_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule_db[schedule_id]

@app.post("/api/schedules", response_model=Schedule)
async def create_schedule(schedule: Schedule):
    """建立新排班"""
    # TODO: 檢查排班規則
    # TODO: 檢查時間衝突
    
    schedule.id = f"schedule_{len(schedule_db) + 1}"
    schedule_db[schedule.id] = schedule
    return schedule

@app.put("/api/schedules/{schedule_id}", response_model=Schedule)
async def update_schedule(schedule_id: str, schedule: Schedule):
    """更新排班資料"""
    if schedule_id not in schedule_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    # TODO: 檢查排班規則
    # TODO: 檢查時間衝突
    
    schedule.id = schedule_id
    schedule_db[schedule_id] = schedule
    return schedule

@app.delete("/api/schedules/{schedule_id}")
async def delete_schedule(schedule_id: str):
    """刪除排班資料"""
    if schedule_id not in schedule_db:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    del schedule_db[schedule_id]
    return {"message": "Schedule deleted successfully"}

# 排班規則 API
@app.get("/api/rules", response_model=List[SchedulingRule])
async def get_rules():
    """獲取所有排班規則"""
    return list(rules_db.values())

@app.post("/api/rules", response_model=SchedulingRule)
async def create_rule(rule: SchedulingRule):
    """建立新排班規則"""
    rule.id = f"rule_{len(rules_db) + 1}"
    rules_db[rule.id] = rule
    return rule

@app.put("/api/rules/{rule_id}", response_model=SchedulingRule)
async def update_rule(rule_id: str, rule: SchedulingRule):
    """更新排班規則"""
    if rule_id not in rules_db:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    rule.id = rule_id
    rules_db[rule_id] = rule
    return rule

@app.delete("/api/rules/{rule_id}")
async def delete_rule(rule_id: str):
    """刪除排班規則"""
    if rule_id not in rules_db:
        raise HTTPException(status_code=404, detail="Rule not found")
    
    del rules_db[rule_id]
    return {"message": "Rule deleted successfully"}

# 排班檢查 API
@app.post("/api/validate-schedules")
async def validate_schedules(date_from: str, date_to: str):
    """檢查排班是否符合規則"""
    # TODO: 實作排班規則檢查邏輯
    # 這裡應該調用 scripts/schedule_validator.py 中的邏輯
    
    return {
        "date_from": date_from,
        "date_to": date_to,
        "total_schedules": len(schedule_db),
        "violations": [],
        "is_valid": True
    }

# 統計 API
@app.get("/api/stats/monthly")
async def get_monthly_stats(year: int, month: int):
    """獲取月度統計資料"""
    # TODO: 實作統計邏輯
    
    return {
        "year": year,
        "month": month,
        "total_staff": len(staff_db),
        "total_schedules": len(schedule_db),
        "total_working_hours": 0,
        "average_hours_per_staff": 0
    }

# 健康檢查
@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# 初始化範例資料
def init_sample_data():
    """初始化範例資料"""
    # 範例員工
    sample_staff = [
        Staff(
            id="staff_1",
            employee_id="E001",
            name="王小美",
            brand_id="brand_1",
            phone="0912-345-678",
            monthly_available_hours=160,
            min_rest_days_per_month=8
        ),
        Staff(
            id="staff_2", 
            employee_id="E002",
            name="李小雅",
            brand_id="brand_1",
            phone="0912-345-679",
            monthly_available_hours=160,
            min_rest_days_per_month=8
        ),
        Staff(
            id="staff_3",
            employee_id="E003", 
            name="張小婷",
            brand_id="brand_2",
            phone="0912-345-680",
            monthly_available_hours=150,
            min_rest_days_per_month=8
        )
    ]
    
    # 範例規則
    sample_rules = [
        SchedulingRule(
            id="rule_1",
            rule_name="每班最少人數",
            rule_type="min_staff_per_shift",
            rule_value=2,
            description="每個班次至少需要2名員工"
        ),
        SchedulingRule(
            id="rule_2",
            rule_name="每月最少休息天數", 
            rule_type="min_rest_days",
            rule_value=8,
            description="每位員工每月至少休息8天"
        ),
        SchedulingRule(
            id="rule_3",
            rule_name="每月最多工作時數",
            rule_type="max_monthly_hours", 
            rule_value=200,
            description="每位員工每月最多工作200小時"
        )
    ]
    
    # 儲存到記憶體資料庫
    for staff in sample_staff:
        staff_db[staff.id] = staff
    
    for rule in sample_rules:
        rules_db[rule.id] = rule

# 啟動時初始化
@app.on_event("startup")
async def startup_event():
    """應用啟動時執行"""
    init_sample_data()
    print("🚀 百貨櫃姐排班系統已啟動")
    print("📊 範例資料已初始化")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("DEBUG", "false").lower() == "true"
    )
