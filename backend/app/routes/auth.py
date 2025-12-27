from fastapi import APIRouter , HTTPException,Depends, Response, Cookie
from pydantic  import BaseModel, EmailStr
from app.services.mongo_service import MongoService
from typing import Dict, Optional
from datetime import timedelta
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
mongo_service = MongoService()

router = APIRouter()

fake_users_db: Dict[str, Dict] = {}

class LoginRequest(BaseModel):
    email:EmailStr
    password:str

class SignUpRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    email: EmailStr
    id:str


class UserWithToken(BaseModel):
    user: UserOut


COOKIE_NAME = "access_token"

def get_user_from_cookie(access_token: Optional[str] = Cookie(default=None)) -> UserOut:
    if not access_token:
        raise HTTPEXCEPTION(status_code=401, detail="Not authenticated")
    try:
        token = access_token.replace("Bearer ", "")
        payload = decode_access_token(token)
        email = payload.get("sub")
        
        user = mongo_service.get_user_by_email(email)
        if not email or email not in user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return UserOut(email=email,id=user["id"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    

@router.post("/signup", response_model=UserOut)
def signup(data: SignUpRequest):
    existing_user = mongo_service.get_user_by_email(data.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hash_psw =  hash_password(data.password)
    user = mongo_service.create_user(data.email,hash_psw)

    return {
        "email": user["email"], "id": user["id"]
    }

@router.post("/login", response_model=UserWithToken)
def login(data: LoginRequest, response: Response):
    # user_record = fake_users_db.get(data.email)
    user = mongo_service.get_user_by_email(data.email)

    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": data.email})
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=f"Bearer {token}",
        httponly=True,
        samesite="lax",
        path="/",   
        secure=False,
        max_age = 60*60
    )
    mongo_service.update_last_login(user["email"])

    return {"user": {"email": user["email"], "id": user["id"]}}

@router.post("/logout")
def logout(response: Response):
    # clear cookie
    response.delete_cookie(COOKIE_NAME)
    return {"detail": "Logged out"}


@router.get("/me", response_model=UserOut)
def get_current_user(
    access_token: Optional[str] = Cookie(default=None)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        token = access_token.replace("Bearer ", "")
        payload = decode_access_token(token)

        email = payload.get("sub")
        user = mongo_service.get_user_by_email(email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {
            "email": user["email"],
            "id": user["id"]
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Session expired")
