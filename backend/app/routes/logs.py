from fastapi import APIRouter, UploadFile, File, HTTPException
# from .log_analyzer import load_logs, analyze_logs_with_genai

router = APIRouter()

@router.post("/analyze-logs/")
async def analyze_logs(file: UploadFile = File(...)):
    # contents = await file.read()
    # file_path = f"temp_{file.filename}"
    # with open(file_path, "wb") as f:
    #     f.write(contents)
    """
        Analyze previously uploaded logs.
    """
    print("📥 Starting file save...")

    # try:
    #     file_path = f"temp_{file.filename}"
    #     logs_df = load_logs(file_path)
    #     result = analyze_logs_with_genai(logs_df)
    #     return {"analysis": result}

    # except Exception as e:
    #         raise HTTPException(status_code=500, detail=f"Error analyzing logs: {str(e)}")
