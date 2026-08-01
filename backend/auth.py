import os
import jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException, Depends, status
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

JWT_SECRET = os.getenv("JWT_SECRET", "super-secret-karnataka-citymind-key-18273")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

class UserToken(BaseModel):
    user_id: str
    username: str
    phone: str
    role: str # 'Citizen', 'Officer', 'Admin', 'CITIZEN', 'FIELD_OFFICER', 'DEPT_HEAD'
    district_id: int

def create_jwt(user_id: str, username: str, role: str, phone: str, district_id: int) -> str:
    payload = {
        "sub": user_id,
        "preferred_username": username,
        "role": role,
        "phone": phone,
        "district_id": district_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt(token: str) -> UserToken:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        role = payload.get("role", "Citizen")
        # Handle role normalization
        norm_role = "CITIZEN" if role.lower() == "citizen" else "FIELD_OFFICER" if role.lower() == "officer" else "DEPT_HEAD" if role.lower() in ["admin", "dept_head"] else role
        
        return UserToken(
            user_id=str(payload["sub"]),
            username=payload["preferred_username"],
            phone=payload.get("phone", ""),
            role=norm_role,
            district_id=payload.get("district_id", 250)
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired.")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token signature: {str(e)}")

def get_current_user(authorization: str = Header(..., description="Bearer JWT token")) -> UserToken:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token is required.")
    token = authorization.split(" ")[1]
    return verify_jwt(token)

class RoleGuard:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = [r.upper() for r in allowed_roles]

    def __call__(self, current_user: UserToken = Depends(get_current_user)) -> UserToken:
        user_role = current_user.role.upper()
        # Normalization checks
        norm_roles = []
        for r in self.allowed_roles:
            if r == "OFFICER":
                norm_roles.extend(["FIELD_OFFICER", "OFFICER"])
            elif r == "CITIZEN":
                norm_roles.extend(["CITIZEN"])
            elif r == "ADMIN":
                norm_roles.extend(["DEPT_HEAD", "DISTRICT_ADMIN", "ADMIN"])
            else:
                norm_roles.append(r)
                
        if user_role not in norm_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.role}' is not authorized to access this resource."
            )
        return current_user
