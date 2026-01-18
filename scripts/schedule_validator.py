#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
百貨櫃姐排班系統 - 排班規則檢查器
用於自動檢查排班是否違反店鋪規則
"""

from datetime import datetime, date, timedelta
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
import json


@dataclass
class Staff:
    """專櫃人員資料"""
    id: str
    employee_id: str
    name: str
    brand_id: str
    monthly_available_hours: int = 160
    min_rest_days_per_month: int = 8
    is_active: bool = True


@dataclass
class Schedule:
    """排班資料"""
    id: str
    staff_id: str
    shift_type: str
    schedule_date: date
    duration_hours: int
    status: str = 'scheduled'


@dataclass
class SchedulingRule:
    """排班規則"""
    id: str
    rule_name: str
    rule_type: str
    rule_value: int
    description: str


@dataclass
class Violation:
    """排班衝突"""
    schedule_id: str
    rule_id: str
    violation_type: str
    description: str
    severity: str = 'warning'


class ScheduleValidator:
    """排班規則檢查器"""
    
    def __init__(self):
        self.violations: List[Violation] = []
        
    def validate_schedule(self, 
                         schedules: List[Schedule], 
                         staff_list: List[Staff], 
                         rules: List[SchedulingRule]) -> List[Violation]:
        """
        檢查排班是否符合所有規則
        
        Args:
            schedules: 排班列表
            staff_list: 員工列表
            rules: 排班規則列表
            
        Returns:
            違規列表
        """
        self.violations = []
        
        # 檢查各種規則
        self._check_min_staff_per_shift(schedules, rules)
        self._check_monthly_rest_days(schedules, staff_list, rules)
        self._check_monthly_working_hours(schedules, staff_list, rules)
        self._check_consecutive_working_days(schedules, staff_list, rules)
        self._check_duplicate_schedule(schedules)
        
        return self.violations
    
    def _check_min_staff_per_shift(self, schedules: List[Schedule], rules: List[SchedulingRule]):
        """檢查每班最少人數規則"""
        min_staff_rule = next((r for r in rules if r.rule_type == 'min_staff_per_shift'), None)
        if not min_staff_rule:
            return
            
        # 按日期和班別分組統計人數
        shift_groups = {}
        for schedule in schedules:
            if schedule.status != 'scheduled':
                continue
                
            key = (schedule.schedule_date, schedule.shift_type)
            if key not in shift_groups:
                shift_groups[key] = []
            shift_groups[key].append(schedule)
        
        # 檢查每個班組的人數
        for (schedule_date, shift_type), shift_schedules in shift_groups.items():
            staff_count = len(set(s.staff_id for s in shift_schedules))
            if staff_count < min_staff_rule.rule_value:
                violation = Violation(
                    schedule_id=shift_schedules[0].id,
                    rule_id=min_staff_rule.id,
                    violation_type='min_staff_violation',
                    description=f'{schedule_date} {shift_type} 只有 {staff_count} 人，少於規定的 {min_staff_rule.rule_value} 人',
                    severity='error'
                )
                self.violations.append(violation)
    
    def _check_monthly_rest_days(self, schedules: List[Schedule], staff_list: List[Staff], rules: List[SchedulingRule]):
        """檢查每月最少休息天數"""
        rest_days_rule = next((r for r in rules if r.rule_type == 'min_rest_days'), None)
        if not rest_days_rule:
            return
            
        # 按員工和月份分組統計工作天數
        staff_monthly_work = {}
        for schedule in schedules:
            if schedule.status != 'scheduled':
                continue
                
            staff_id = schedule.staff_id
            month_key = (staff_id, schedule.schedule_date.year, schedule.schedule_date.month)
            
            if month_key not in staff_monthly_work:
                staff_monthly_work[month_key] = set()
            staff_monthly_work[month_key].add(schedule.schedule_date)
        
        # 檢查每個員工的休息天數
        for staff in staff_list:
            for (staff_id, year, month), work_days in staff_monthly_work.items():
                if staff_id != staff.id:
                    continue
                    
                # 計算該月天數
                if month == 12:
                    next_month = date(year + 1, 1, 1)
                else:
                    next_month = date(year, month + 1, 1)
                first_day = date(year, month, 1)
                days_in_month = (next_month - first_day).days
                
                work_days_count = len(work_days)
                rest_days = days_in_month - work_days_count
                
                if rest_days < staff.min_rest_days_per_month:
                    violation = Violation(
                        schedule_id='',  # 這是整體規則違規，不特定到某個排班
                        rule_id=rest_days_rule.id,
                        violation_type='insufficient_rest_days',
                        description=f'{staff.name} 在 {year}年{month}月 只休息 {rest_days} 天，少於規定的 {staff.min_rest_days_per_month} 天',
                        severity='error'
                    )
                    self.violations.append(violation)
    
    def _check_monthly_working_hours(self, schedules: List[Schedule], staff_list: List[Staff], rules: List[SchedulingRule]):
        """檢查每月最多工作時數"""
        max_hours_rule = next((r for r in rules if r.rule_type == 'max_monthly_hours'), None)
        if not max_hours_rule:
            return
            
        # 按員工和月份統計工作時數
        staff_monthly_hours = {}
        for schedule in schedules:
            if schedule.status != 'scheduled':
                continue
                
            staff_id = schedule.staff_id
            month_key = (staff_id, schedule.schedule_date.year, schedule.schedule_date.month)
            
            if month_key not in staff_monthly_hours:
                staff_monthly_hours[month_key] = 0
            staff_monthly_hours[month_key] += schedule.duration_hours
        
        # 檢查每個員工的工作時數
        for staff in staff_list:
            for (staff_id, year, month), total_hours in staff_monthly_hours.items():
                if staff_id != staff.id:
                    continue
                    
                if total_hours > max_hours_rule.rule_value:
                    violation = Violation(
                        schedule_id='',
                        rule_id=max_hours_rule.id,
                        violation_type='excessive_working_hours',
                        description=f'{staff.name} 在 {year}年{month}月 工作時數 {total_hours} 小時，超過規定的 {max_hours_rule.rule_value} 小時',
                        severity='error'
                    )
                    self.violations.append(violation)
    
    def _check_consecutive_working_days(self, schedules: List[Schedule], staff_list: List[Staff], rules: List[SchedulingRule]):
        """檢查連續工作天數限制"""
        consecutive_rule = next((r for r in rules if r.rule_type == 'max_consecutive_days'), None)
        if not consecutive_rule:
            return
            
        # 按員工整理排班日期
        staff_schedules = {}
        for schedule in schedules:
            if schedule.status != 'scheduled':
                continue
                
            if schedule.staff_id not in staff_schedules:
                staff_schedules[schedule.staff_id] = []
            staff_schedules[schedule.staff_id].append(schedule.schedule_date)
        
        # 檢查每個員工的連續工作天數
        for staff in staff_list:
            if staff.id not in staff_schedules:
                continue
                
            work_dates = sorted(set(staff_schedules[staff.id]))
            
            consecutive_count = 0
            max_consecutive = 0
            
            for i, work_date in enumerate(work_dates):
                if i == 0:
                    consecutive_count = 1
                else:
                    prev_date = work_dates[i - 1]
                    if (work_date - prev_date).days == 1:
                        consecutive_count += 1
                    else:
                        consecutive_count = 1
                
                max_consecutive = max(max_consecutive, consecutive_count)
                
                if consecutive_count > consecutive_rule.rule_value:
                    violation = Violation(
                        schedule_id='',
                        rule_id=consecutive_rule.id,
                        violation_type='excessive_consecutive_days',
                        description=f'{staff.name} 連續工作 {consecutive_count} 天，超過規定的 {consecutive_rule.rule_value} 天',
                        severity='warning'
                    )
                    self.violations.append(violation)
    
    def _check_duplicate_schedule(self, schedules: List[Schedule]):
        """檢查重複排班"""
        staff_schedule_map = {}
        
        for schedule in schedules:
            key = (schedule.staff_id, schedule.schedule_date)
            if key in staff_schedule_map:
                violation = Violation(
                    schedule_id=schedule.id,
                    rule_id='',
                    violation_type='duplicate_schedule',
                    description=f'員工在 {schedule.schedule_date} 有重複排班',
                    severity='error'
                )
                self.violations.append(violation)
            else:
                staff_schedule_map[key] = schedule


def generate_sample_data():
    """生成範例資料用於測試"""
    # 範例員工
    staff_list = [
        Staff("1", "E001", "王小美", "brand_1", 160, 8),
        Staff("2", "E002", "李小雅", "brand_1", 160, 8),
        Staff("3", "E003", "張小婷", "brand_2", 150, 8),
        Staff("4", "E004", "陳小雯", "brand_2", 150, 8),
    ]
    
    # 範例排班 (2024年1月)
    base_date = date(2024, 1, 1)
    schedules = []
    
    # 生成一個月的排班範例
    for day in range(1, 32):  # 1月有31天
        current_date = base_date + timedelta(days=day - 1)
        
        # 週末排班
        if current_date.weekday() >= 5:  # 週六、週日
            schedules.extend([
                Schedule(f"s_{day}_1", "1", "早班", current_date, 8),
                Schedule(f"s_{day}_2", "2", "早班", current_date, 8),
                Schedule(f"s_{day}_3", "3", "晚班", current_date, 8),
            ])
        else:  # 平日
            schedules.extend([
                Schedule(f"s_{day}_1", "1", "早班", current_date, 8),
                Schedule(f"s_{day}_2", "2", "早班", current_date, 8),
                Schedule(f"s_{day}_3", "3", "晚班", current_date, 8),
                Schedule(f"s_{day}_4", "4", "晚班", current_date, 8),
            ])
    
    # 範例規則
    rules = [
        SchedulingRule("1", "每班最少人數", "min_staff_per_shift", 2, "每個班次至少需要2名員工"),
        SchedulingRule("2", "每月最少休息天數", "min_rest_days", 8, "每位員工每月至少休息8天"),
        SchedulingRule("3", "每月最多工作時數", "max_monthly_hours", 200, "每位員工每月最多工作200小時"),
        SchedulingRule("4", "連續工作天數限制", "max_consecutive_days", 6, "員工最多連續工作6天"),
    ]
    
    return staff_list, schedules, rules


def main():
    """主程式 - 測試排班檢查功能"""
    print("=== 百貨櫃姐排班系統 - 規則檢查器 ===")
    
    # 生成範例資料
    staff_list, schedules, rules = generate_sample_data()
    
    # 建立檢查器並執行檢查
    validator = ScheduleValidator()
    violations = validator.validate_schedule(schedules, staff_list, rules)
    
    # 輸出檢查結果
    print(f"\n檢查完成！發現 {len(violations)} 個違規：")
    
    if violations:
        for i, violation in enumerate(violations, 1):
            print(f"\n{i}. 【{violation.severity.upper()}】{violation.violation_type}")
            print(f"   說明：{violation.description}")
    else:
        print("✅ 排班符合所有規則！")
    
    # 保存結果到 JSON 檔案
    result = {
        "check_time": datetime.now().isoformat(),
        "total_schedules": len(schedules),
        "total_violations": len(violations),
        "violations": [
            {
                "type": v.violation_type,
                "severity": v.severity,
                "description": v.description
            } for v in violations
        ]
    }
    
    with open('/Users/angusweng/CascadeProjects/department-store-scheduling/validation_result.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"\n檢查結果已保存到 validation_result.json")


if __name__ == "__main__":
    main()
