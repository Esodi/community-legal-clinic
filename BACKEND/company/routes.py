from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from .models import (
    get_company_details,
    update_about_us,
    update_contact_us,
    update_useful_links,
    update_social_links
)
from auth.routes import require_auth

router = APIRouter()

class AboutUpdate(BaseModel):
    title: str
    description: str

class ContactItem(BaseModel):
    label: str
    value: Optional[str] = Field(default=None)
    isMain: bool = Field(default=False, alias="is_main")
    isAddress: bool = Field(default=False, alias="is_address")
    isContact: bool = Field(default=False, alias="is_contact")

    class Config:
        json_schema_extra = {
            "example": {
                "label": "Community Legal Clinic (CLC)",
                "value": None,
                "isMain": True,
                "isAddress": False,
                "isContact": False
            }
        }
        populate_by_name = True

class ContactUpdate(BaseModel):
    title: str
    items: List[ContactItem]

class UsefulLinkItem(BaseModel):
    label: str
    href: str

class UsefulLinksUpdate(BaseModel):
    title: str
    items: List[UsefulLinkItem]

class SocialLink(BaseModel):
    platform: str
    url: str
    icon: str
    ariaLabel: str = Field(default="", alias="aria_label")

    class Config:
        populate_by_name = True
        allow_population_by_field_name = True

class SocialLinksUpdate(BaseModel):
    socialLinks: List[SocialLink]

@router.get("")
async def get_details():
    """Get all company details"""
    return get_company_details()

@router.put("/about")
async def update_about(data: AboutUpdate, current_user = Depends(require_auth)):
    """Update about us section"""
    update_about_us(data.title, data.description)
    return {'message': 'About us section updated'}

@router.put("/contact")
async def update_contact(data: ContactUpdate, current_user = Depends(require_auth)):
    """Update contact us section"""
    items = []
    for item in data.items:
        items.append({
            "label": item.label,
            "value": item.value,
            "isMain": item.isMain,
            "isAddress": item.isAddress,
            "isContact": item.isContact
        })
    update_contact_us(data.title, items)
    return {'message': 'Contact us section updated'}

@router.put("/useful-links")
async def update_links(data: UsefulLinksUpdate, current_user = Depends(require_auth)):
    """Update useful links section"""
    update_useful_links(data.title, [dict(item) for item in data.items])
    return {'message': 'Useful links section updated'}

@router.put("/social-links")
async def update_social(data: SocialLinksUpdate, current_user = Depends(require_auth)):
    """Update social links"""
    links = []
    for link in data.socialLinks:
        links.append({
            "platform": link.platform,
            "url": link.url,
            "icon": link.icon,
            "ariaLabel": link.ariaLabel
        })
    update_social_links(links)
    return {'message': 'Social links updated'} 