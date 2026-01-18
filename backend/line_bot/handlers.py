#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LINE Bot 訊息處理器
處理用戶通過 LINE 發送的各种請求
"""

from datetime import datetime, date, timedelta
from typing import Dict, List, Optional
from linebot import LineBotApi, WebhookHandler
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
    TemplateSendMessage, ButtonsTemplate, CarouselTemplate,
    CarouselColumn, PostbackAction, MessageAction,
    URIAction, PostbackEvent
)
from linebot.exceptions import LineBotApiError

class ScheduleBotHandler:
    """排班機器人處理器"""
    
    def __init__(self, line_bot_api: LineBotApi, handler: WebhookHandler):
        self.line_bot_api = line_bot_api
        self.handler = handler
        self.user_states = {}  # 儲存用戶對話狀態
        
    def handle_text_message(self, event: MessageEvent):
        """處理文字訊息"""
        user_id = event.source.user_id
        message_text = event.message.text.strip()
        
        # 檢查用戶狀態
        if user_id in self.user_states:
            self._handle_stateful_message(user_id, message_text, event.reply_token)
            return
            
        # 主要功能路由
        if message_text == "排班查詢":
            self._send_schedule_query_menu(event.reply_token)
        elif message_text == "我的排班":
            self._send_my_schedule(user_id, event.reply_token)
        elif message_text == "請假申請":
            self._send_leave_request_menu(event.reply_token)
        elif message_text == "排班規則":
            self._send_scheduling_rules(event.reply_token)
        elif message_text == "聯絡管理員":
            self._send_admin_contact(event.reply_token)
        else:
            self._send_main_menu(event.reply_token)
    
    def handle_postback(self, event: PostbackEvent):
        """處理 Postback 事件（按鈕點擊）"""
        user_id = event.source.user_id
        data = event.postback.data
        
        # 解析 Postback 數據
        if data.startswith("schedule_query_"):
            self._handle_schedule_query(user_id, data, event.reply_token)
        elif data.startswith("leave_request_"):
            self._handle_leave_request(user_id, data, event.reply_token)
        elif data == "main_menu":
            self._send_main_menu(event.reply_token)
        else:
            self._send_text_message(event.reply_token, "功能開發中，請稍後再試。")
    
    def _send_main_menu(self, reply_token: str):
        """發送主選單"""
        buttons_template = ButtonsTemplate(
            title="百貨櫃姐排班系統",
            text="請選擇您需要的功能：",
            actions=[
                MessageAction(label="排班查詢", text="排班查詢"),
                MessageAction(label="我的排班", text="我的排班"),
                MessageAction(label="請假申請", text="請假申請"),
                MessageAction(label="排班規則", text="排班規則")
            ]
        )
        
        template_message = TemplateSendMessage(
            alt_text="主選單",
            template=buttons_template
        )
        
        self._send_template_message(reply_token, template_message)
    
    def _send_schedule_query_menu(self, reply_token: str):
        """發送排班查詢選單"""
        today = date.today()
        dates = []
        
        # 生成未來7天的選項
        for i in range(7):
            query_date = today + timedelta(days=i)
            date_str = query_date.strftime("%m/%d (%a)")
            dates.append((query_date, date_str))
        
        # 創建 Carousel 模板
        columns = []
        for query_date, date_str in dates[:3]:  # LINE Carousel 最多顯示3個
            column = CarouselTemplate(
                thumbnail_image_url="https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=排班查詢",
                title=f"{date_str} 排班",
                text="點擊查看當日排班詳情",
                actions=[
                    PostbackAction(
                        label="查看早班",
                        data=f"schedule_query_{query_date}_早班"
                    ),
                    PostbackAction(
                        label="查看晚班", 
                        data=f"schedule_query_{query_date}_晚班"
                    ),
                    PostbackAction(
                        label="查看全日",
                        data=f"schedule_query_{query_date}_全日班"
                    )
                ]
            )
            columns.append(column)
        
        carousel_template = CarouselTemplate(columns=columns)
        template_message = TemplateSendMessage(
            alt_text="排班查詢選單",
            template=carousel_template
        )
        
        self._send_template_message(reply_token, template_message)
    
    def _send_my_schedule(self, user_id: str, reply_token: str):
        """發送個人排班"""
        # TODO: 從資料庫查詢用戶的排班
        # 這裡先發送範例訊息
        
        today = date.today()
        current_month = today.strftime("%Y年%m月")
        
        schedule_text = f"""
📅 {current_month} 個人排班表

本週排班：
• 週一 (今天) - 早班 09:00-17:00
• 週二 - 早班 09:00-17:00  
• 週三 - 休息
• 週四 - 晚班 13:00-21:00
• 週五 - 晚班 13:00-21:00
• 週六 - 早班 09:00-17:00
• 週日 - 休息

本月統計：
• 已工作時數：128小時
• 剩餘可用時數：32小時
• 已休息天數：6天
• 剩餘需休息：2天

💡 提醒：本月還需休息2天才能達到規定要求
        """
        
        self._send_text_message(reply_token, schedule_text.strip())
    
    def _send_leave_request_menu(self, reply_token: str):
        """發送請假申請選單"""
        buttons_template = ButtonsTemplate(
            title="請假申請",
            text="請選擇請假類型：",
            actions=[
                PostbackAction(label="事假", data="leave_request_personal"),
                PostbackAction(label="病假", data="leave_request_sick"),
                PostbackAction(label="年假", data="leave_request_annual"),
                PostbackAction(label="特休", data="leave_request_special")
            ]
        )
        
        template_message = TemplateSendMessage(
            alt_text="請假申請選單",
            template=buttons_template
        )
        
        self._send_template_message(reply_token, template_message)
    
    def _send_scheduling_rules(self, reply_token: str):
        """發送排班規則說明"""
        rules_text = """
📋 排班規則說明

【基本規則】
• 每班至少需要 2 人
• 每月至少休息 8 天
• 每月最多工作 200 小時
• 最多連續工作 6 天

【班別時間】
• 早班：09:00-17:00 (8小時)
• 晚班：13:00-21:00 (8小時)
• 全日班：09:00-21:00 (12小時)

【請假規定】
• 請假需提前1天申請
• 病假需提供醫生證明
• 年假需提前1週申請

如有其他問題，請聯絡管理員。
        """
        
        self._send_text_message(reply_token, rules_text.strip())
    
    def _send_admin_contact(self, reply_token: str):
        """發送管理員聯絡方式"""
        contact_text = """
📞 管理員聯絡方式

【排班管理員】
• 姓名：陳經理
• 電話：02-1234-5678
• Email：manager@department.com

【人事部門】
• 電話：02-1234-5679
• 工作時間：週一至週五 09:00-18:00

【緊急聯絡】
• 24小時緊急電話：0912-345-678

如遇緊急情況，請立即撥打緊急聯絡電話。
        """
        
        self._send_text_message(reply_token, contact_text.strip())
    
    def _handle_schedule_query(self, user_id: str, data: str, reply_token: str):
        """處理排班查詢"""
        # 解析數據格式: schedule_query_2024-01-15_早班
        parts = data.split("_")
        if len(parts) < 4:
            self._send_text_message(reply_token, "查詢格式錯誤，請重新選擇。")
            return
            
        query_date_str = f"{parts[2]}-{parts[3]}-{parts[4]}"
        shift_type = parts[5]
        
        try:
            query_date = datetime.strptime(query_date_str, "%Y-%m-%d").date()
            date_str = query_date.strftime("%m月%d日(%a)")
            
            # TODO: 從資料庫查詢實際排班資料
            # 這裡先發送範例資料
            
            schedule_info = f"""
📅 {date_str} {shift_type} 排班

【值班人員】
• 王小美 (員工編號: E001)
• 李小雅 (員工編號: E002)

【班別時間】
• 早班：09:00-17:00
• 地點：1樓化妝品專櫃

【備註】
• 今日有新品上架活動
• 請準時到班並做好交接
            """
            
            self._send_text_message(reply_token, schedule_info.strip())
            
        except ValueError:
            self._send_text_message(reply_token, "日期格式錯誤，請重新選擇。")
    
    def _handle_leave_request(self, user_id: str, data: str, reply_token: str):
        """處理請假申請"""
        leave_type = data.replace("leave_request_", "")
        
        # 設置用戶狀態，等待輸入請假日期
        self.user_states[user_id] = {
            "action": "leave_request",
            "leave_type": leave_type,
            "step": "input_date"
        }
        
        leave_type_map = {
            "personal": "事假",
            "sick": "病假", 
            "annual": "年假",
            "special": "特休"
        }
        
        type_name = leave_type_map.get(leave_type, leave_type)
        
        prompt_message = f"""
請假申請 - {type_name}

請輸入請假日期，格式：MM/DD (例如：01/20)

或輸入「取消」退出請假申請。
        """
        
        self._send_text_message(reply_token, prompt_message.strip())
    
    def _handle_stateful_message(self, user_id: str, message_text: str, reply_token: str):
        """處理有狀態的對話"""
        if user_id not in self.user_states:
            return
            
        user_state = self.user_states[user_id]
        
        if message_text == "取消":
            del self.user_states[user_id]
            self._send_main_menu(reply_token)
            return
        
        if user_state["action"] == "leave_request":
            if user_state["step"] == "input_date":
                # 驗證日期格式
                try:
                    leave_date = datetime.strptime(message_text, "%m/%d").date()
                    leave_date = leave_date.replace(year=date.today().year)
                    
                    # 進入下一步：輸入請假原因
                    user_state["step"] = "input_reason"
                    user_state["leave_date"] = leave_date
                    
                    prompt_message = f"""
請假日期：{leave_date.strftime('%m月%d日')}

請輸入請假原因：
                    """
                    
                    self._send_text_message(reply_token, prompt_message.strip())
                    
                except ValueError:
                    self._send_text_message(reply_token, "日期格式錯誤，請使用 MM/DD 格式，例如：01/20")
    
    def _send_text_message(self, reply_token: str, text: str):
        """發送文字訊息"""
        try:
            self.line_bot_api.reply_message(
                reply_token,
                TextSendMessage(text=text)
            )
        except LineBotApiError as e:
            print(f"發送訊息失敗: {e}")
    
    def _send_template_message(self, reply_token: str, template_message):
        """發送模板訊息"""
        try:
            self.line_bot_api.reply_message(
                reply_token,
                template_message
            )
        except LineBotApiError as e:
            print(f"發送模板訊息失敗: {e}")
