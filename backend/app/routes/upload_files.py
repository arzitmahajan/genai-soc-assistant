from fastapi import APIRouter, UploadFile, File,Form, HTTPException
import pandas as pd
import os,shutil
from app.services.file_parser import parse_file
from app.services.mongo_service import MongoService
from app.services.s3_service import S3Service

router = APIRouter()

# UPLOAD_DIR = "uploaded_logs"
# os.makedirs(UPLOAD_DIR, exist_ok=True)
mongo_service = MongoService()

@router.post("/upload")
async def upload_logs(file:UploadFile = File(...),user_id: str = Form(...)):
    """
    Upload a log file (JSON/CSV/XLSX).
    Saves  to disk and return file info.
    """
    # try:

    #     file_path = os.path.join(UPLOAD_DIR, file.filename)
    #     print(" Starting file save...")

    #     with open(file_path, "wb") as buffer:
    #         shutil.copyfileobj(file.file, buffer)

    #     abs_path = os.path.abspath(file_path)
    #     print(f"File uploaded and saved to: {abs_path}")

    #     df = parse_file(file_path)
        
    #     return {
    #         "filename": file.filename,
    #         # "rows": len(df),
    #         # "columns": list(df.columns),
    #         "file_path": file_path

    #     }


    try:
        # user_folder = os.path.join(UPLOAD_DIR,user_id)
        # os.makedirs(user_folder,exist_ok=True)

        # file_path = os.path.join(user_folder,file.filename)
        # print(f"Saving file for user: {user_id} at {file_path}")

        # with open(file_path, "wb") as buffer:
        #     shutil.copyfileobj(file.file, buffer)

        # print("Uploading file to S3...")
        s3_key = f"{user_id}/{file.filename}"
        print(f"Uploading {file.filename} for user {user_id} to S3...")


        s3_service = S3Service()
        upload_response = s3_service.upload_file(file,s3_key)

        if upload_response.get("status") == "error":
            raise HTTPException(status_code=500, detail=upload_response["message"])
        
        file_url = upload_response.get("url")
        print(f"File uploaded to S3: {file_url}")

        # Optionally parse after uploading
        # df = parse_file(file.filename)

        mongo_service.log_file_upload(user_id,file.filename)

        return {
            "filename": file.filename,
            "file_url": file_url,
            "message": "File uploaded successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")