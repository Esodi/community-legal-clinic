from db import get_connection
from datetime import datetime, timedelta
import hashlib
import secrets
import jwt
import os
from passlib.context import CryptContext
import bcrypt
from typing import Optional, Tuple, Dict, Any, List

# JWT configuration
JWT_SECRET = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-keep-it-safe')  # Use the same key as in main.py
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def generate_token(user_id, role):
    """Generate a JWT token for the user"""
    try:
        expires_at = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        payload = {
            'user_id': user_id,
            'role': role,
            'exp': expires_at.timestamp(),
            'iat': datetime.utcnow().timestamp()
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        # Store token in database
        conn = get_connection()
        c = conn.cursor()
        
        # Invalidate any existing tokens for this user
        c.execute("""
            UPDATE tokens 
            SET is_valid = 0 
            WHERE user_id = ?
        """, (user_id,))
        
        # Insert new token
        c.execute("""
            INSERT INTO tokens (user_id, token, expires_at, is_valid)
            VALUES (?, ?, ?, 1)
        """, (user_id, token, expires_at.isoformat()))
        
        conn.commit()
        conn.close()
        
        return token
    except Exception as e:
        print(f"Error generating token: {str(e)}")
        raise Exception("Could not generate token")

def verify_token(token):
    """Verify a JWT token and return user info if valid"""
    try:
        # First verify JWT signature and expiration
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            print("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {str(e)}")
            return None
        
        # Then check if token is valid in database
        conn = get_connection()
        c = conn.cursor()
        
        current_time = datetime.utcnow().isoformat()
        
        c.execute("""
            SELECT t.user_id, t.expires_at, u.role, u.status
            FROM tokens t
            JOIN users u ON t.user_id = u.id
            WHERE t.token = ? 
            AND t.is_valid = 1 
            AND t.expires_at > ?
            AND u.status = 'active'
        """, (token, current_time))
        
        token_data = c.fetchone()
        conn.close()
        
        if not token_data:
            print("Token not found in database or invalidated")
            return None
            
        # Check if token is expired
        expires_at = datetime.fromisoformat(token_data[1])
        if expires_at < datetime.utcnow():
            print("Token has expired")
            return None
            
        return {
            'user_id': token_data[0],
            'role': token_data[2],
            'exp': expires_at.timestamp()
        }
        
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        if 'conn' in locals():
            conn.close()
        return None

def invalidate_token(token):
    """Invalidate a token in the database"""
    try:
        conn = get_connection()
        c = conn.cursor()
        
        # Mark token as invalid
        c.execute("""
            UPDATE tokens 
            SET is_valid = 0 
            WHERE token = ?
        """, (token,))
        
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error invalidating token: {str(e)}")
        return False

def create_user(username, email, password, role='user'):
    """Create a new user"""
    conn = get_connection()
    c = conn.cursor()
    
    # Check if username or email already exists
    c.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
    if c.fetchone():
        conn.close()
        return None, "Username or email already exists"
    
    # Hash password
    password_hash = hash_password(password)
    
    try:
        c.execute("""
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        """, (username, email, password_hash, role))
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        return user_id, None
    except Exception as e:
        conn.close()
        return None, str(e)

def verify_user(username_or_email, password):
    """Verify user credentials and return user info if valid"""
    conn = get_connection()
    c = conn.cursor()
    
    # Get user by username or email
    c.execute("""
        SELECT id, username, email, password_hash, role, status
        FROM users 
        WHERE (username = ? OR email = ?) AND status = 'active'
    """, (username_or_email, username_or_email))
    user = c.fetchone()
    
    if not user:
        conn.close()
        return None, "Invalid credentials or inactive account"
    
    # Verify password
    if not verify_password(password, user[3]):  # user[3] is stored password_hash
        conn.close()
        return None, "Invalid credentials"
    
    # Generate new token
    token = generate_token(user[0], user[4])  # user[0] is id, user[4] is role
    
    user_data = {
        'id': user[0],
        'username': user[1],
        'email': user[2],
        'role': user[4],
        'token': token
    }
    
    conn.close()
    return user_data, None

def logout_user(token):
    """Invalidate a user's token"""
    conn = get_connection()
    c = conn.cursor()
    
    # Delete token from database
    c.execute("DELETE FROM tokens WHERE token = ?", (token,))
    
    conn.commit()
    conn.close()

def get_user_by_id(user_id):
    """Get user info by ID"""
    conn = get_connection()
    c = conn.cursor()
    
    try:
        c.execute("""
            SELECT id, username, email, role, status, created_at, updated_at
            FROM users 
            WHERE id = ? AND status != 'deleted'
        """, (user_id,))
        user = c.fetchone()
        
        if not user:
            conn.close()
            return None
        
        user_data = {
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'role': user[3],
            'status': user[4],
            'created_at': user[5],
            'updated_at': user[6] if len(user) > 6 else user[5]  # Fallback to created_at if updated_at is not available
        }
        
        conn.close()
        return user_data
    except Exception as e:
        print(f"Error in get_user_by_id: {str(e)}")
        conn.close()
        return None

def get_all_users():
    """Get all non-deleted users"""
    try:
        conn = get_connection()
        c = conn.cursor()
        
        c.execute("""
            SELECT id, username, email, role, status, created_at, updated_at
            FROM users 
            WHERE status != 'deleted'
            ORDER BY created_at DESC
        """)
        
        users = c.fetchall()
        users_data = []
        
        for user in users:
            user_data = {
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'role': user[3],
                'status': user[4],
                'created_at': user[5],
                'updated_at': user[6] if len(user) > 6 else user[5]  # Fallback to created_at if updated_at is not available
            }
            users_data.append(user_data)
        
        conn.close()
        return users_data
    except Exception as e:
        print(f"Error in get_all_users: {str(e)}")
        if 'conn' in locals():
            conn.close()
        return None

def soft_delete_user(user_id):
    """Soft delete a user by setting status to deleted and clearing password"""
    try:
        conn = get_connection()
        c = conn.cursor()
        
        # First check if user exists and is not already deleted
        c.execute("SELECT id FROM users WHERE id = ? AND status != 'deleted'", (user_id,))
        if not c.fetchone():
            conn.close()
            return False, "Invalid Credentials or already deleted"
        
        # Update user status to deleted and clear password
        c.execute("""
            UPDATE users 
            SET status = 'deleted',
                password_hash = '',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        """, (user_id,))
        
        # Invalidate all tokens for this user
        c.execute("""
            UPDATE tokens 
            SET is_valid = 0 
            WHERE user_id = ?
        """, (user_id,))
        
        conn.commit()
        conn.close()
        return True, None
    except Exception as e:
        if 'conn' in locals():
            conn.close()
        return False, str(e)

def update_user_details(
    user_id: str,
    username: str,
    email: str,
    role: str,
    status: str,
    password: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Update user details including optional password change.
    Returns (updated_user, None) on success or (None, error_message) on failure
    """
    try:
        # Connect to database
        conn = get_connection()
        cur = conn.cursor()

        # Check if user exists
        cur.execute(
            "SELECT id, username, email, role, status FROM users WHERE id = ?",
            (user_id,)
        )
        user = cur.fetchone()
        
        if not user:
            return None, "Invalid Credentials"

        # Check for duplicate username
        cur.execute(
            "SELECT id FROM users WHERE username = ? AND id != ?",
            (username, user_id)
        )
        if cur.fetchone():
            return None, "Username already exists"

        # Check for duplicate email
        cur.execute(
            "SELECT id FROM users WHERE email = ? AND id != ?",
            (email, user_id)
        )
        if cur.fetchone():
            return None, "Email already exists"

        # Prepare update query and parameters
        update_fields = []
        params = []

        # Add basic fields
        update_fields.extend(["username = ?", "email = ?", "role = ?", "status = ?", "updated_at = CURRENT_TIMESTAMP"])
        params.extend([username, email, role, status])

        # If password is provided, hash it and add to update
        if password:
            password_hash = hash_password(password)
            update_fields.append("password_hash = ?")
            params.append(password_hash)

        # Add user_id to params
        params.append(user_id)

        # Construct and execute update query
        query = f"""
            UPDATE users 
            SET {', '.join(update_fields)}
            WHERE id = ?
            RETURNING id, username, email, role, status, created_at, updated_at
        """
        
        cur.execute(query, params)
        updated_user = cur.fetchone()
        conn.commit()

        if not updated_user:
            return None, "Failed to update user"

        # Convert to dictionary
        user_dict = {
            'id': str(updated_user[0]),
            'username': updated_user[1],
            'email': updated_user[2],
            'role': updated_user[3],
            'status': updated_user[4],
            'createdAt': updated_user[5],  # Already a string from SQLite
            'updatedAt': updated_user[6] if len(updated_user) > 6 else updated_user[5]  # Use created_at as fallback
        }

        return user_dict, None

    except Exception as e:
        print(f"Error updating user: {str(e)}")
        return None, f"Database error: {str(e)}"
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close() 