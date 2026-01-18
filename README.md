# 百貨櫃姐排班系統

基於 LINE Bot 的百貨公司專櫃人員排班管理系統。

## 系統架構

```
department-store-scheduling/
├── backend/                 # 後端服務
│   ├── app/                # 主要應用程式
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI 主程式
│   │   ├── models/         # 資料模型
│   │   ├── services/       # 業務邏輯
│   │   └── utils/          # 工具函式
│   ├── database/           # 資料庫相關
│   │   ├── schema.sql      # Supabase 資料表結構
│   │   └── migrations/     # 資料庫遷移檔案
│   ├── line_bot/           # LINE Bot 相關
│   │   ├── __init__.py
│   │   ├── handlers.py     # 訊息處理器
│   │   └── messages.py     # 訊息模板
│   ├── requirements.txt    # Python 依賴套件
│   └── .env.example        # 環境變數範例
├── frontend/               # 前端管理介面（可選）
│   └── web/               # Web 管理介面
├── docs/                  # 文件
│   ├── api.md            # API 文件
│   └── database.md       # 資料庫設計文件
└── scripts/               # 工具腳本
    ├── schedule_validator.py  # 排班規則檢查器
    └── data_seeder.py         # 測試資料生成器
```

## 主要功能

- 專櫃人員管理
- 智能排班系統
- 排班規則自動檢查
- LINE Bot 介面
- 排班表查詢與修改

## 技術棧

- **後端**: Python + FastAPI
- **資料庫**: Supabase (PostgreSQL)
- **通訊介面**: LINE Bot API
- **部署**: Docker + Railway/Vercel
