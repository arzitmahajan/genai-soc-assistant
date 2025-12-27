from fastapi import APIRouter,HTTPException,Query
from app.services.s3_service import S3Service

router = APIRouter()
s3_service = S3Service()

@router.delete('/delete_report')

async def delete_user_report(
    user_id:str=Query(...),
    reportname:str=Query(...)
):
    result = s3_service.delete_user_report(user_id, reportname)
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result