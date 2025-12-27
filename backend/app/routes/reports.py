from fastapi import APIRouter, HTTPException, Body, Query
from app.services.s3_service import S3Service
from pydantic import BaseModel

router = APIRouter()

class AnalysisBody(BaseModel):
    analysis:str

@router.post("/save_report")
async def save_report(
    user_id: str = Query(...),
    filename: str = Query(...),
    body: dict = Body(...)
):
    try:
        analysis = body.get("analysis")
        if not analysis:
            raise HTTPException(status_code=400, detail="Missing analysis data")

        s3_Service = S3Service()
        result = s3_Service.save_report(user_id, filename, analysis)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        
        return {"message": "Report saved successfully", "report_url": result["url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving report: {str(e)}")



@router.get("/get_report_content")
async def get_report_content(user_id:str = Query(...), filename:str = Query(...)):
    try:
        s3_Service = S3Service()
        return s3_Service.get_report_content(user_id,filename)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading report: {str(e)}")
