from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .models import (
    add_hero,
    get_hero,
    get_all_heroes,
    update_hero,
    delete_hero
)
from auth.routes import require_auth

router = APIRouter()

class ChatOption(BaseModel):
    text: str
    icon: str

class ChatData(BaseModel):
    userMessage: str
    botResponse: str
    userName: str
    options: List[ChatOption]

class HeroBase(BaseModel):
    headline: str
    subheadline: str
    ctaText: str
    chatData: ChatData
    status: str

class HeroCreate(HeroBase):
    pass

class HeroUpdate(HeroBase):
    pass

@router.get("")
async def get_hero_route():
    return get_hero()

@router.get("/all")
async def get_all_heroes_route():
    return get_all_heroes()

@router.post("")
async def create_hero(hero: HeroCreate, current_user = Depends(require_auth)):
    chat_data = hero.chatData
    
    hero_id = add_hero(
        hero.headline,
        hero.subheadline,
        hero.ctaText,
        chat_data.userMessage,
        chat_data.botResponse,
        chat_data.userName,
        [{"text": opt.text, "icon": opt.icon} for opt in chat_data.options],
        hero.status
    )
    return {'id': hero_id, 'message': 'Hero added'}

@router.put("/{hero_id}")
async def update_hero_route(hero_id: int, hero: HeroUpdate, current_user = Depends(require_auth)):
    chat_data = hero.chatData
    
    update_hero(
        hero_id,
        hero.headline,
        hero.subheadline,
        hero.ctaText,
        chat_data.userMessage,
        chat_data.botResponse,
        chat_data.userName,
        [{"text": opt.text, "icon": opt.icon} for opt in chat_data.options],
        hero.status
    )
    return {'message': 'Hero updated'}

@router.delete("/{hero_id}")
async def delete_hero_route(hero_id: int, current_user = Depends(require_auth)):
    delete_hero(hero_id)
    return {'message': 'Hero deleted'}    