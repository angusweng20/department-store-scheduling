#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LINE Bot 訊息模板
提供各種標準化的訊息模板
"""

class MessageTemplates:
    """訊息模板類別"""
    
    @staticmethod
    def welcome_message():
        """歡迎訊息"""
        return """
🎉 歡迎使用百貨櫃姐排班系統！

我是您的排班小助手，可以協助您：
• 查詢個人排班
• 申請請假
• 查看排班規則
• 聯絡管理員

請點擊下方選單開始使用，或輸入「主選單」查看所有功能。
        """
    
    @staticmethod
    def schedule_confirmed_message(date: str, shift_type: str):
        """排班確認訊息"""
        return f"""
✅ 排班已確認

日期：{date}
班別：{shift_type}
狀態：已排班

請準時到班，如有問題請聯絡管理員。
        """
    
    @staticmethod
    def leave_request_submitted(leave_type: str, date: str, reason: str):
        """請假申請提交訊息"""
        return f"""
📝 請假申請已提交

請假類型：{leave_type}
請假日期：{date}
請假原因：{reason}

申請已送交管理員審核，請等待審核結果。
        """
    
    @staticmethod
    def leave_request_approved(leave_type: str, date: str):
        """請假申請核准訊息"""
        return f"""
✅ 請假申請已核准

請假類型：{leave_type}
請假日期：{date}

祝您休假愉快！
        """
    
    @staticmethod
    def leave_request_rejected(leave_type: str, date: str, reason: str):
        """請假申請拒絕訊息"""
        return f"""
❌ 請假申請未通過

請假類型：{leave_type}
請假日期：{date}
拒絕原因：{reason}

如有疑問請聯絡管理員。
        """
    
    @staticmethod
    def schedule_violation_alert(violations: list):
        """排班違規警告訊息"""
        violation_text = "\n".join([f"• {v['description']}" for v in violations])
        
        return f"""
⚠️ 排班規則檢查結果

發現以下違規情況：
{violation_text}

請及時調整排班以符合規定要求。
        """
    
    @staticmethod
    def shift_reminder(date: str, shift_type: str, start_time: str):
        """班次提醒訊息"""
        return f"""
⏰ 班次提醒

明天 {date} 您有 {shift_type}
時間：{start_time}

請準備好相關物品，準時到班。
        """
    
    @staticmethod
    def monthly_schedule_summary(month: str, stats: dict):
        """月度排班統計訊息"""
        return f"""
📊 {month} 排班統計

• 工作天數：{stats['work_days']} 天
• 工作時數：{stats['total_hours']} 小時
• 休息天數：{stats['rest_days']} 天
• 請假天數：{stats['leave_days']} 天

剩餘可用時數：{stats['remaining_hours']} 小時
還需休息天數：{stats['needed_rest_days']} 天
        """
    
    @staticmethod
    def error_message(error_type: str):
        """錯誤訊息"""
        error_messages = {
            "user_not_found": "找不到您的員工資料，請聯絡管理員。",
            "schedule_not_found": "找不到相關排班資料。",
            "invalid_date": "日期格式錯誤，請使用 MM/DD 格式。",
            "permission_denied": "您沒有權限執行此操作。",
            "system_error": "系統發生錯誤，請稍後再試。",
            "duplicate_schedule": "該日期已有排班，無法重複安排。",
            "rule_violation": "此排班違反規定，無法建立。"
        }
        
        return f"""
❌ 操作失敗

{error_messages.get(error_type, "發生未知錯誤。")}

如有疑問請聯絡管理員。
        """
    
    @staticmethod
    def success_message(action: str):
        """成功訊息"""
        success_messages = {
            "schedule_created": "排班建立成功。",
            "schedule_updated": "排班更新成功。",
            "schedule_deleted": "排班刪除成功。",
            "profile_updated": "個人資料更新成功。",
            "settings_saved": "設定儲存成功。"
        }
        
        return f"""
✅ {success_messages.get(action, "操作成功。")}
        """
    
    @staticmethod
    def help_message():
        """幫助訊息"""
        return """
📖 使用說明

【基本指令】
• 主選單 - 顯示主要功能選單
• 排班查詢 - 查詢特定日期排班
• 我的排班 - 查看個人排班表
• 請假申請 - 申請各類請假
• 排班規則 - 查看排班相關規定
• 聯絡管理員 - 獲取管理員聯絡方式

【快速操作】
• 直接輸入日期 (如：01/20) 查詢當日排班
• 輸入「請假」快速開始請假申請
• 輸入「統計」查看本月排班統計

【注意事項】
• 請假需提前申請，緊急情況請聯絡管理員
• 排班異動請及時通知相關人員
• 系統會自動檢查排班規則，違規時會提醒

如需更多協助，請聯絡管理員。
        """


class QuickReplyTemplates:
    """快速回覆模板"""
    
    @staticmethod
    def main_menu():
        """主選單快速回覆"""
        from linebot.models import QuickReply, QuickReplyButton, MessageAction
        
        return QuickReply(items=[
            QuickReplyButton(action=MessageAction(label="排班查詢", text="排班查詢")),
            QuickReplyButton(action=MessageAction(label="我的排班", text="我的排班")),
            QuickReplyButton(action=MessageAction(label="請假申請", text="請假申請")),
            QuickReplyButton(action=MessageAction(label="排班規則", text="排班規則"))
        ])
    
    @staticmethod
    def date_selection():
        """日期選擇快速回覆"""
        from linebot.models import QuickReply, QuickReplyButton, MessageAction
        from datetime import date, timedelta
        
        today = date.today()
        items = []
        
        # 生成未來7天的快速選項
        for i in range(7):
            query_date = today + timedelta(days=i)
            date_str = query_date.strftime("%m/%d")
            weekday = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"][query_date.weekday()]
            
            items.append(
                QuickReplyButton(
                    action=MessageAction(label=f"{date_str} {weekday}", text=date_str)
                )
            )
        
        return QuickReply(items=items[:4])  # 最多顯示4個
    
    @staticmethod
    def leave_type_selection():
        """請假類型選擇快速回覆"""
        from linebot.models import QuickReply, QuickReplyButton, MessageAction
        
        return QuickReply(items=[
            QuickReplyButton(action=MessageAction(label="事假", text="事假")),
            QuickReplyButton(action=MessageAction(label="病假", text="病假")),
            QuickReplyButton(action=MessageAction(label="年假", text="年假")),
            QuickReplyButton(action=MessageAction(label="特休", text="特休"))
        ])
