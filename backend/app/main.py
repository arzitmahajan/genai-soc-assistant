from fastapi import FastAPI, UploadFile, File
import pandas as pd
from app.routes import log_analyzer
from app.routes import logs
from app.routes import upload_files
from app.routes import get_insights
from app.routes import list_files
from app.routes import reports
from app.routes import list_reports
from app.routes import delete_file
from app.routes import delete_report
from app.routes import auth
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Allow frontend origin
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(log_analyzer.router, prefix="/logs", tags=["logs_analyze"])
app.include_router(logs.router, prefix="/logs", tags=["logs_analyze"])
app.include_router(upload_files.router, prefix="/logs", tags=["upload_logs"])
app.include_router(delete_file.router,prefix='/logs',tags=["delete_file"])
app.include_router(reports.router,prefix="/logs", tags=["save_report"])
app.include_router(reports.router,prefix= "/logs", tags=["report_content"])
app.include_router(get_insights.router,prefix="/logs",tags=['dashboard_stats'])
app.include_router(list_files.router,prefix='/logs',tags =['user_files'])
app.include_router(list_reports.router,prefix='/reports',tags =['user_reports'])
app.include_router(delete_report.router,prefix='/reports',tags =['user_reports'])
app.include_router(auth.router, prefix="/auth", tags=["authentication"])


@app.get('/')
def root():
    return {"message": " SOC Assistant Backend is running!"}

# @app.post("/analyze-logs/")
# async def analyze_logs(file: UploadFile = File(...)):
#     contents = await file.read()

#     file_path = f"temp_{file.filename}"
#     with open(file_path,"wb") as f:
#         f.write(contents)

#     logs_df = load_logs(file_path)

#     result = analyze_logs_with_genai(logs_df)
#     return {"analysis":result}


