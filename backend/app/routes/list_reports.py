from fastapi import APIRouter,HTTPException,Query
from app.services.s3_service import S3Service

router = APIRouter()
s3_service = S3Service()

@router.get('/list_reports')

async def list_user_reports(user_id:str = Query(...)):
    try:
        reports = s3_service.list_user_reports(user_id)
        print("Returning reports:", reports)

        return {"user_id":user_id,"reports":reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")
