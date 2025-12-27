from fastapi import APIRouter,HTTPException,Query
from app.services.s3_service import S3Service

router = APIRouter()
s3_service = S3Service()

@router.get('/list')

async def list_user_files(user_id:str = Query(...)):
    """
        fetch list for specific user
    """
    try:
        files = s3_service.list_user_files(user_id)
        return{"user_id":user_id,"files":files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing files:{str(e)}")
