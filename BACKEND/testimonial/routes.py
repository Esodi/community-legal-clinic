from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from .models import (
    add_testimonial,
    get_all_testimonials,
    update_testimonial,
    delete_testimonial
)
from auth.routes import require_auth

router = APIRouter()

class TestimonialBase(BaseModel):
    name: str
    location: str
    text: str
    image: Optional[str] = None
    status: Optional[str] = 'pending'

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    pass

@router.get("")
async def list_testimonials():
    return get_all_testimonials()

@router.post("")
async def create_testimonial(testimonial: TestimonialCreate, current_user = Depends(require_auth)):
    testimonial_id = add_testimonial(
        testimonial.name,
        testimonial.location,
        testimonial.text,
        testimonial.image,
        testimonial.status
    )
    return {'id': testimonial_id, 'message': 'Testimonial added'}

@router.put("/{testimonial_id}")
async def update_testimonial_route(testimonial_id: int, testimonial: TestimonialUpdate, current_user = Depends(require_auth)):
    update_testimonial(
        testimonial_id,
        testimonial.name,
        testimonial.location,
        testimonial.text,
        testimonial.image,
        testimonial.status
    )
    return {'message': 'Testimonial updated'}

@router.delete("/{testimonial_id}")
async def delete_testimonial_route(testimonial_id: int, current_user = Depends(require_auth)):
    delete_testimonial(testimonial_id)
    return {'message': 'Testimonial deleted'}