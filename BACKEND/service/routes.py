from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .models import (
    add_service,
    get_all_services,
    update_service,
    delete_service
)
from auth.routes import require_auth

router = APIRouter()

class ServiceCreate(BaseModel):
    title: str
    description: str
    videoThumbnail: str
    videoUrl: str
    offerings: List[dict]
    status: Optional[str] = 'pending'

class ServiceUpdate(ServiceCreate):
    pass

@router.get("")
async def list_services():
    return get_all_services()

@router.post("")
async def create_service(service: ServiceCreate, current_user = Depends(require_auth)):
    service_id = add_service(
        service.title,
        service.description,
        service.videoThumbnail,
        service.videoUrl,
        service.offerings,
        service.status
    )
    return {'id': service_id, 'message': 'Service added'}

@router.put("/{service_id}")
async def update_service_route(service_id: int, service: ServiceUpdate, current_user = Depends(require_auth)):
    update_service(
        service_id,
        service.title,
        service.description,
        service.videoThumbnail,
        service.videoUrl,
        service.offerings,
        service.status
    )
    return {'message': 'Service updated'}

@router.delete("/{service_id}")
async def delete_service_route(service_id: int, current_user = Depends(require_auth)):
    delete_service(service_id)
    return {'message': 'Service deleted'}
