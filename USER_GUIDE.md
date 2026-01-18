# 🚀 百貨櫃姐排班系統使用指南

## 📋 系統概述

百貨櫃姐排班系統是一個基於 LINE Bot 的智能排班管理系統，提供：
- 📅 智能排班管理
- 🤖 LINE Bot 介面
- 📊 排班規則自動檢查
- 📱 行動裝置友善操作

## 🛠️ 系統啟動

### 1. 啟動 FastAPI 後端服務

```bash
# 進入後端目錄
cd /Users/angusweng/CascadeProjects/department-store-scheduling/backend

# 啟動服務
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

成功啟動後會看到：
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 2. 訪問 API 文件

開啟瀏覽器訪問：http://localhost:8000/docs

您會看到完整的 API 文件介面，包含：
- 員工管理 API
- 排班管理 API  
- 排班規則 API
- 統計分析 API

## 📱 LINE Bot 使用方式

### 主要功能指令

| 指令 | 功能 | 說明 |
|--------|------|------|
| `主選單` | 顯示主要功能選單 | 查看所有可用功能 |
| `排班查詢` | 查詢特定日期排班 | 按日期和班別查詢 |
| `我的排班` | 查看個人排班表 | 顯示個人排班和統計 |
| `請假申請` | 申請各類請假 | 支援事假、病假、年假、特休 |
| `排班規則` | 查看排班規則 | 顯示排班相關規定 |
| `聯絡管理員` | 獲取聯絡方式 | 管理員聯絡資訊 |

### 使用流程

#### 1. 查詢排班
```
您: 排班查詢
系統: [顯示日期選擇選單]
您: [點擊特定日期]
系統: [顯示該日各班次人員]
```

#### 2. 查看個人排班
```
您: 我的排班
系統: [顯示本週排班表]
     [顯示本月統計資訊]
     [顯示工作時數和休息天數]
```

#### 3. 申請請假
```
您: 請假申請
系統: [顯示請假類型選單]
您: [選擇請假類型]
系統: [要求輸入請假日期]
您: 01/20
系統: [要求輸入請假原因]
您: 家中有事
系統: [確認申請已提交]
```

## 🖥️ Web 管理介面

### API 端點說明

#### 員工管理
- `GET /api/staff` - 獲取所有員工
- `POST /api/staff` - 建立新員工
- `PUT /api/staff/{id}` - 更新員工資料
- `DELETE /api/staff/{id}` - 刪除員工

#### 排班管理
- `GET /api/schedules` - 獲取排班資料
- `POST /api/schedules` - 建立新排班
- `PUT /api/schedules/{id}` - 更新排班
- `DELETE /api/schedules/{id}` - 刪除排班

#### 排班檢查
- `POST /api/validate-schedules` - 檢查排班規則
- `GET /api/stats/monthly` - 獲取月度統計

### 使用範例

#### 1. 查詢員工資料
```bash
curl -X GET "http://localhost:8000/api/staff" \
  -H "accept: application/json"
```

#### 2. 建立新排班
```bash
curl -X POST "http://localhost:8000/api/schedules" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "staff_id": "staff_1",
    "shift_type_id": "shift_1", 
    "schedule_date": "2024-01-20",
    "status": "scheduled"
  }'
```

#### 3. 檢查排班規則
```bash
curl -X POST "http://localhost:8000/api/validate-schedules?date_from=2024-01-01&date_to=2024-01-31"
```

## 🔧 排班規則檢查器

### 獨立使用排班檢查器

```bash
# 執行排班規則檢查
python3 scripts/schedule_validator.py
```

檢查器會：
- ✅ 檢查每班最少人數
- ✅ 檢查每月最少休息天數
- ✅ 檢查每月最多工作時數
- ✅ 檢查連續工作天數限制
- ✅ 檢查重複排班

### 檢查結果範例
```
=== 百貨櫃姐排班系統 - 規則檢查器 ===

檢查完成！發現 0 個違規：

✅ 排班符合所有規則！

檢查結果已保存到 validation_result.json
```

## 📊 系統監控

### 健康檢查
```bash
curl -X GET "http://localhost:8000/health"
```

回應範例：
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 日誌查看
後端服務運行時會顯示詳細日誌：
- API 請求記錄
- 資料庫操作日誌
- 錯誤和警告訊息

## 🎯 日常使用場景

### 場景 1: 排班經理日常工作
1. **晨間檢查**: 查詢當日排班狀況
2. **人力調整**: 根據需求修改排班
3. **規則檢查**: 確保排班符合規定
4. **異常處理**: 處理臨時請假和替班

### 場景 2: 專櫃人員使用
1. **查看排班**: 透過 LINE Bot 查看個人排班
2. **請假申請**: 需要請假時透過 LINE 申請
3. **班次提醒**: 接收系統自動提醒
4. **規則查詢**: 查看排班相關規定

### 場景 3: 系統管理員
1. **資料維護**: 管理員工和品牌資料
2. **規則設定**: 調整排班規則參數
3. **統計分析**: 查看排班統計報表
4. **系統監控**: 確保系統正常運行

## ⚠️ 注意事項

### 安全性
- 🔒 API 金鑰請妥善保管
- 🔒 LINE Bot Token 不要外洩
- 🔒 資料庫密碼定期更換

### 效能建議
- 📈 定期清理歷史排班資料
- 📈 監控 API 回應時間
- 📈 優化資料庫查詢

### 備份策略
- 💾 定期備份 Supabase 資料庫
- 💾 備份重要設定檔案
- 💾 記錄系統變更歷史

## 🆘 故障排除

### 常見問題

#### Q: 後端無法啟動？
**A**: 檢查：
1. Python 環境是否正確
2. 依賴套件是否安裝
3. Port 8000 是否被佔用

#### Q: LINE Bot 無回應？
**A**: 檢查：
1. Webhook URL 是否正確設定
2. LINE Channel Access Token 是否有效
3. 網路連接是否正常

#### Q: 資料庫連接失敗？
**A**: 檢查：
1. .env 檔案中的連接資訊
2. Supabase 專案狀態
3. API 金鑰是否有效

### 聯絡支援
如遇到技術問題：
1. 查看系統日誌
2. 檢查 API 文件
3. 聯絡系統管理員

---

🎉 **開始使用您的百貨櫃姐排班系統吧！**
