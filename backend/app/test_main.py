#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
最簡單的測試應用程式
"""

from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "port": os.getenv("PORT", "8000")}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"Starting on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
