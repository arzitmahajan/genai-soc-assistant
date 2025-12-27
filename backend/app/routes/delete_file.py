from fastapi import APIRouter,HTTPException,Query
from app.services.s3_service import S3Service

router = APIRouter()
s3_service = S3Service()

@router.delete('/delete_file')

async def delete_user_file(
    user_id:str=Query(...),
    filename:str=Query(...)
):
    result = s3_service.delete_user_file(user_id, filename)
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result