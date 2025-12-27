# from fastapi import APIRouter,HTTPException,Query
# from app.services import ai_engine
# from app.services import file_parser
# from app.services.s3_service import S3Service
# from app.services.mongo_service import MongoService
# from app.utility.json_parser import extract_metrics
# from app.core.config import AWS_BUCKET_NAME, AWS_REGION
# import os,json
# from io import BytesIO

# router = APIRouter()
# UPLOAD_DIR = "uploaded_logs"

# @router.post('/analyze')
# async def analyze_logs(
#         filename: str= Query(...),
#         user_id:str = Query(...),
#         save_report:bool = Query(False)
#     ):
#     """
#         Analyze a previously uploaded file.
#     """
#     try:
#         print("&&&&&&&&&&&&&&&&&&&&")

#         file_path = os.path.join(UPLOAD_DIR, filename)
#         print(f"Resolved file path: {file_path}")
#         print(f"File exists: {os.path.exists(file_path)}")
        
#         if not os.path.exists(file_path):
#             raise HTTPException(status_code=404, detail="File not found. Upload first.")
#         print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
#         logs_df = file_parser.parse_file(file_path)
#         print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

#         result = ai_engine.analyze_logs_with_genai(logs_df)

#         # report creation in s3(file save)
#         s3_url = None
#         if save_report:
#             try:
#                 s3_service = S3Service()
#                 report_key = f"{user_id}/reports/{filename}_report.json"

#                 if isinstance(result, str):
#                     try:
#                         result = json.loads(result)
#                     except json.JSONDecodeError:
#                         pass  # keep as string if it's plain text

#                 # Convert result to bytes
#                 report_data = json.dumps(result, indent=2)
#                 report_bytes = BytesIO(report_data.encode("utf-8"))

#                 s3_service.upload_file(
#                     # Bucket=AWS_BUCKET_NAME,
#                     Key=report_key,
#                     Body = report_bytes,
#                     # ContentType = "application/json"
#                 )
#                 s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{report_key}"
#             except Exception as s3_error:
#                 raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(s3_error)}")


#         try:
#             metrics = extract_metrics(result)
#             print("HELLLLLLLL")
#             print(metrics)
#             mongo_service = MongoService()
#             mongo_service.insert_user_report(
#                 user_id=user_id,
#                 filename=filename,
#                 metrics=metrics
#         #         # s3_url=s3_url,        # you are missing analysis_result here!
#         #         # analysis_result={"metrics": {}, "summary": {}}
#             )
#         except Exception as mongo_error:
#             import traceback
#             traceback.print_exc()
#             raise HTTPException(status_code=500, detail=f"MongoDB insert failed: {str(mongo_error)}")

#         return {
#             "message": "Analysis complete",
#             "analysis": result,
#             "report_url":s3_url
#             }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error analyzing logs: {str(e)}")

from fastapi import APIRouter, HTTPException, Query
from app.services import ai_engine, file_parser
from app.services.s3_service import S3Service
from app.services.mongo_service import MongoService
from app.utility.json_parser import extract_metrics
from app.core.config import AWS_BUCKET_NAME, AWS_REGION
from io import BytesIO
import os, json
import traceback

router = APIRouter()
mongo_service = MongoService()  # reuse one instance

@router.post('/analyze')
async def analyze_logs(
    filename: str = Query(...),
    user_id: str = Query(...),
    save_report: bool = Query(False)
):
    """
    Analyze a previously uploaded file stored in S3.
    """
    try:
        # 1) Load file from S3 (no local UPLOAD_DIR)
        s3_service = S3Service()
        s3_key = f"{user_id}/{filename}"
        print(f"Reading from S3 key: {s3_key}")

        try:
            file_bytes = s3_service.get_file_bytes(s3_key)
        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=f"File not found in S3 for user {user_id}: {str(e)}"
            )

        # 2) Parse logs into DataFrame
        logs_df = file_parser.parse_file(file_bytes, filename)

        # 3) Run GenAI analysis
        result = ai_engine.analyze_logs_with_genai(logs_df)

        # 4) Optionally save report JSON to S3
        s3_url = None
        if save_report:
            try:
                report_key = f"{user_id}/reports/{filename}_report.json"

                if isinstance(result, str):
                    try:
                        result_obj = json.loads(result)
                    except json.JSONDecodeError:
                        result_obj = {"analysis": result}
                else:
                    result_obj = result

                report_data = json.dumps(result_obj, indent=2)
                report_bytes = BytesIO(report_data.encode("utf-8"))

                s3_service.upload_file(
                    # Bucket=AWS_BUCKET_NAME,
                    Key=report_key,
                    Body = report_bytes,
                    # ContentType = "application/json"
                )
                s3_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{report_key}"
            except Exception as s3_error:
                raise HTTPException(status_code=500, detail=f"S3 upload failed: {str(s3_error)}")

        # 5) Extract metrics and save to Mongo (only metrics, not raw logs)
        try:
            metrics = extract_metrics(result)
            mongo_service.insert_user_report(
                user_id=user_id,
                filename=filename,
                metrics=metrics,
            )
        except Exception as mongo_error:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"MongoDB insert failed: {str(mongo_error)}")

        return {
            "message": "Analysis complete",
            "analysis": result,
            "report_url": s3_url
        }

    except HTTPException:
        # pass through HTTPExceptions as-is
        raise
    traceback.print_exc()
    raise HTTPException(status_code=500, detail=f"Error analyzing logs: {str(e)}")
