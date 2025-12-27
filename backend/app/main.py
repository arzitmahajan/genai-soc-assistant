from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    log_analyzer,
    logs,
    upload_files,
    get_insights,
    list_files,
    reports,
    list_reports,
    delete_file,
    delete_report,
    auth
)

app = FastAPI(title="GenAI SOC Assistant")

# CORS (frontend on Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",        # local dev
        "https://your-vercel-app.vercel.app"  # production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload_files.router, prefix="/files", tags=["Files"])
app.include_router(log_analyzer.router, prefix="/analyze", tags=["Analysis"])
app.include_router(get_insights.router, prefix="/insights", tags=["Insights"])
app.include_router(list_files.router, prefix="/files", tags=["Files"])
app.include_router(delete_file.router, prefix="/files", tags=["Files"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(list_reports.router, prefix="/reports", tags=["Reports"])
app.include_router(delete_report.router, prefix="/reports", tags=["Reports"])

# Health check (VERY IMPORTANT FOR RENDER)
@app.get("/")
def health():
    return {"status": "ok"}
