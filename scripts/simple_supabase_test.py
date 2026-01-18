#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
簡單的 Supabase 連接測試
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# 載入環境變數
load_dotenv()

def test_supabase_connection():
    """測試 Supabase 連接"""
    try:
        print("🔗 正在測試 Supabase 連接...")
        
        # 建立客戶端
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        print(f"URL: {supabase_url}")
        print(f"Key: {supabase_key[:20]}...")
        
        client = create_client(supabase_url, supabase_key)
        
        # 測試簡單查詢
        result = client.table('brands').select('count').execute()
        print("✅ Supabase 連接成功")
        print(f"查詢結果: {result}")
        
        return True
        
    except Exception as e:
        print(f"❌ Supabase 連接失敗: {e}")
        return False

if __name__ == "__main__":
    test_supabase_connection()
