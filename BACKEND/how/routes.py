from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .models import (
    add_how,
    get_how,
    get_all_hows,
    update_how,
    delete_how
)
from auth.routes import require_auth

router = APIRouter()

class Step(BaseModel):
    id: int
    title: str
    description: str
    icon: str

class HowBase(BaseModel):
    title: str
    subtitle: str
    steps: List[Step]
    status: str = "active"

class HowCreate(HowBase):
    pass

class HowUpdate(HowBase):
    pass

class HowResponse(HowBase):
    id: int
    created_at: datetime
    updated_at: datetime

@router.get("", response_model=HowResponse)
async def get_how_route():
    result = get_how()
    if not result:
        raise HTTPException(status_code=404, detail="How section not found")
    return result

@router.get("/all", response_model=List[HowResponse])
async def get_all_hows_route():
    return get_all_hows()

@router.post("")
async def create_how(how: HowCreate, current_user = Depends(require_auth)):
    how_id = add_how(
        how.title,
        how.subtitle,
        [step.dict() for step in how.steps],
        how.status
    )
    return {'id': how_id, 'message': 'How section added'}

@router.put("/{how_id}")
async def update_how_route(how_id: int, how: HowUpdate, current_user = Depends(require_auth)):
    try:
        update_how(
            how_id,
            how.title,
            how.subtitle,
            [step.dict() for step in how.steps],
            how.status
        )
        return {'message': 'How section updated'}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{how_id}")
async def delete_how_route(how_id: int, current_user = Depends(require_auth)):
    delete_how(how_id)
    return {'message': 'How section deleted'} 