from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, List
from pydantic import BaseModel
from auth.models import (
    get_all_users,
)
from hero.models import (
    get_hero,
)
from company.models import (
    get_company_details,
)
from testimonial.models import (
    get_all_testimonials,
)
from service.models import (
    get_all_services,
)
from how.models import (
    get_how,
)
from announcements.models import (
    get_all_announcements,
)


from functools import wraps

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserUpdate(BaseModel):
    id: str
    username: str
    email: str
    role: str
    status: str
    password: Optional[str] = None

class UsersUpdateRequest(BaseModel):
    users: List[UserUpdate]


@router.get("")
async def web_data():
    """
    Retrieve all webpages data.
    """
    try:
        users = get_all_users()
        company = get_company_details()
        hero = get_hero()
        testimonials = get_all_testimonials()
        services = get_all_services()
        how = get_how()
        announcements = get_all_announcements()

        if users is None:
            raise HTTPException(status_code=500, detail="Failed to fetch users")
            
        # Calculate statistics
        stats = {
            "testimonialCount": len(testimonials["testimonials"]) if testimonials and "testimonials" in testimonials else 0,
            "serviceCount": len(services["packages"]) if services and "packages" in services else 0,
            "userCount": len(users) if users else 0
        }
            
        data = {
            'headerData': 'success',
            'footerData': company,
            'headerData': {
                "navigationLinks": company["usefulLinks"]["items"]
            },
            'heroData': hero,
            'testimonialsData': testimonials,
            'servicesData': services,
            'howData': how,
            'announcementsData': announcements,
            'stats': stats
        }
        return data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_stats():
    """
    Get statistics about the website content.
    """
    try:
        users = get_all_users()
        testimonials = get_all_testimonials()
        services = get_all_services()
        
        stats = {
            "testimonialCount": len(testimonials["testimonials"]) if testimonials and "testimonials" in testimonials else 0,
            "serviceCount": len(services["packages"]) if services and "packages" in services else 0,
            "userCount": len(users) if users else 0
        }
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
