from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from db import init_db
from auth.routes import router as auth_router
from service.routes import router as services_router
from testimonial.routes import router as testimonials_router
from hero.routes import router as hero_router
from company.routes import router as company_router
from announcements.routes import router as announcements_router
from how.routes import router as how_router
from webpages.routes import router as webpages_router
import json
import os
import asyncio
from typing import Set, Dict, Optional
from datetime import datetime, timedelta
import signal
import sys
import logging
import jwt
from pydantic import BaseModel
from webpages.routes import web_data
# JWT Configuration
JWT_SECRET_KEY = "your-super-secret-key-keep-it-safe"  # In production, use environment variable
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TokenData(BaseModel):
    username: str
    role: str = "user"
    exp: Optional[datetime] = None

def create_access_token(data: dict) -> str:
    """
    Create a new JWT access token
    """
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        logger.info(f"Created token for user: {data.get('username')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating token: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not create token")

def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return its payload if valid
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("username")
        role: str = payload.get("role", "user")
        
        if username is None:
            logger.warning("Token missing username")
            return None
            
        token_data = TokenData(
            username=username,
            role=role,
            exp=datetime.fromtimestamp(payload.get("exp"))
        )
        logger.info(f"Token verified for user: {username}")
        return payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        return None
    except jwt.JWTError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        return None

app = FastAPI()

# Initialize SQLite database
init_db()

# CORS configuration
origins = [
    "http://0.0.0.0:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:8000",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://localhost:3000",
    "https://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)

# Include all routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(services_router, prefix="/services", tags=["services"])
app.include_router(testimonials_router, prefix="/testimonials", tags=["testimonials"])
app.include_router(hero_router, prefix="/hero", tags=["hero"])
app.include_router(company_router, prefix="/company-details", tags=["company-details"])
app.include_router(announcements_router, prefix="/announcements", tags=["announcements"])
app.include_router(how_router, prefix="/how", tags=["how"])
app.include_router(webpages_router, prefix="/webpages", tags=["webpages"])

@app.get("/generate-test-token")
async def generate_test_token():
    """
    Generate a test token for development purposes
    """
    try:
        token_data = {
            "username": "test_user",
            "role": "user",
            "sub": "test_user"
        }
        token = create_access_token(token_data)
        logger.info("Generated test token successfully")
        return JSONResponse(content={"token": token})
    except Exception as e:
        logger.error(f"Error generating test token: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not generate test token")

@app.get("/status")
async def root():
    """
    Root endpoint to check server status
    """
    status = {
        "status": "online",
        "time": datetime.now().isoformat()
    }

    return status


if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    
    config = uvicorn.Config(
        app=app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True,
        timeout_keep_alive=30,
        ws_ping_interval=20,
        ws_ping_timeout=30,
        reload=True,  # Enable auto-reload for development
        reload_dirs=["BACKEND"],  # Watch the BACKEND directory for changes
        reload_includes=["*.py", "*.json"],  # Watch Python and JSON files
        reload_excludes=["*.pyc", "*.pyo", "__pycache__"]  # Exclude cache files
    )
    server = uvicorn.Server(config)
    server.run() 