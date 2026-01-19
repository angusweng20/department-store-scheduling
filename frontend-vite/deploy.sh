#!/bin/bash

echo "🚀 開始部署到 Vercel..."

# 檢查 Vercel CLI 是否安裝
if ! command -v vercel &> /dev/null; then
    echo "📦 安裝 Vercel CLI..."
    npm install -g vercel
fi

# 部署
echo "🔄 部署中..."
vercel --prod --confirm

echo "✅ 部署完成！"
