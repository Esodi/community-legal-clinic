from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional, List
from pydantic import BaseModel
from .models import (
    create_user,
    verify_user,
    verify_token,
    logout_user,
    get_user_by_id,
    invalidate_token,
    soft_delete_user,
    get_all_users,
    update_user_details
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

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='No authorization token provided')
    
    token = authorization.split(' ')[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    
    user = get_user_by_id(payload['user_id'])
    if not user:
        raise HTTPException(status_code=401, detail='Invalid Credentials')
    return {"user": user, "role": payload['role'], "token": token}

# Add this for compatibility with other routes
async def require_auth(authorization: Optional[str] = Header(None)):
    return await get_current_user(authorization)

async def require_admin(current_user = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail='Admin access required')
    return current_user

@router.post("/signup")
async def signup(user: UserCreate, authorization: Optional[str] = Header(None)):
    # Check if admin role is requested and verify admin access
    if user.role == "admin":
        current_user = await get_current_user(authorization)
        await require_admin(current_user)
    
    user_id, error = create_user(
        user.username,
        user.email,
        user.password,
        user.role
    )
    
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    return {
        'message': 'User created successfully',
        'user_id': user_id
    }

@router.post("/login")
async def login(user: UserLogin):
    """
    Authenticate user and return token
    """
    try:
        user_data, error = verify_user(
            user.username_or_email,
            user.password
        )
        
        if error:
            raise HTTPException(status_code=401, detail=error)
        
        if not user_data:
            raise HTTPException(status_code=401, detail="Invalid Credentials")
        
        return {
            'message': 'Login successful',
            'user': {
                'id': user_data['id'],
                'username': user_data['username'],
                'email': user_data['email'],
                'role': user_data['role'],
                'token': user_data['token']
            }
        }
    except Exception as e:
        print(f"Login error: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """
    Logout user and invalidate their token
    """
    try:
        # Invalidate the current token
        invalidate_token(current_user["token"])
        return {'message': 'Logout successful'}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {'user': current_user["user"]}

@router.post("/verify")
async def verify_auth_token(current_user = Depends(get_current_user)):
    """
    Verify a JWT token and return user data if valid
    """
    return {
        'id': current_user["user"]["id"],
        'username': current_user["user"]["username"],
        'email': current_user["user"]["email"],
        'role': current_user["role"]
    }

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user = Depends(require_admin)):
    """
    Soft delete a user by setting their status to deleted and clearing their password.
    Only admins can perform this action.
    """
    try:
        # Check if trying to delete self
        if str(user_id) == str(current_user["user"]["id"]):
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
            
        success, error = soft_delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail=error)
            
        return {'message': 'User deleted successfully'}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def list_users(current_user = Depends(require_admin)):
    """
    Get all non-deleted users.
    Only admins can access this endpoint.
    """
    try:
        users = get_all_users()
        if users is None:
            raise HTTPException(status_code=500, detail="Failed to fetch users")
            
        return {
            'users': users,
            'total': len(users)
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users")
async def update_users(request: UsersUpdateRequest, current_user = Depends(require_admin)):
    """
    Update multiple users' details. Only admins can perform this action.
    Can update username, email, role, status, and optionally password.
    """
    try:
        updated_users = []
        for user_update in request.users:
            # Check if trying to update own role
            if str(user_update.id) == str(current_user["user"]["id"]) and user_update.role != current_user["role"]:
                raise HTTPException(status_code=400, detail="Cannot change your own role")
            
            success, error = update_user_details(
                user_id=user_update.id,
                username=user_update.username,
                email=user_update.email,
                role=user_update.role,
                status=user_update.status,
                password=user_update.password
            )
            
            if not success:
                raise HTTPException(status_code=400, detail=error)
            
            updated_users.append(success)
            
        return {
            'message': 'Users updated successfully',
            'users': updated_users
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 