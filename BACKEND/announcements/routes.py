from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from .models import (
    get_all_announcements,
    add_announcement,
    update_announcement,
    delete_announcement,
    toggle_announcement_status
)
from auth.routes import require_auth

router = APIRouter()

class AnnouncementDate(BaseModel):
    day: str
    month: str
    year: str

class AnnouncementBase(BaseModel):
    title: str
    description: str
    date: AnnouncementDate
    isNew: Optional[bool] = True
    status: Optional[str] = "active"

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(AnnouncementBase):
    pass


@router.get("")
async def get_announcements():
    """Get all announcements"""
    print("Getting all announcements")
    return get_all_announcements()

@router.post("")
async def add_announcement_route(announcement: AnnouncementCreate, current_user = Depends(require_auth)):
    """Add a new announcement"""
    date = announcement.date
    
    add_announcement(
        announcement.title,
        announcement.description,
        date.day,
        date.month,
        date.year,
        announcement.isNew,
        announcement.status
    )
    
    return {'message': 'Announcement added successfully'}

@router.put("/{announcement_id}")
async def update_announcement_route(
    announcement_id: int, 
    announcement: AnnouncementUpdate, 
    current_user = Depends(require_auth)
):
    """Update an existing announcement"""
    date = announcement.date
    
    update_announcement(
        announcement_id,
        announcement.title,
        announcement.description,
        date.day,
        date.month,
        date.year,
        announcement.isNew,
        announcement.status
    )
    
    return {'message': 'Announcement updated successfully'}

@router.delete("/{announcement_id}")
async def delete_announcement_route(announcement_id: int, current_user = Depends(require_auth)):
    """Delete an announcement"""
    delete_announcement(announcement_id)
    return {'message': 'Announcement deleted successfully'}
