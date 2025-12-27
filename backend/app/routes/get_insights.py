# from fastapi import APIRouter,HTTPException

# router = APIRouter()

# @router.get('/get_insights')
# async def get_insights():
#     # Dummy data for testing
#     return {
#         "uploads": 5,
#         "reports": 3,
#         "insights": [
#             "No anomalies detected",
#             "2 failed logins",
#             "New report ready"
#         ],
#         "incidentSummary": {
#             "high": 2,
#             "medium": 10,
#             "low": 6    
#         },
#         "lastUpload":' Apr 1, 2025, 12:23 AM',
#         "incidentTrends": [
#             { "date": "2025-09-25", "high": 1, "medium": 0, "low": 2 },
#             { "date": "2025-09-26", "high": 0, "medium": 2, "low": 1 },
#             { "date": "2025-09-27", "high": 2, "medium": 1, "low": 0 },
#             { "date": "2025-09-28", "high": 1, "medium": 1, "low": 1 },
#             { "date": "2025-09-29", "high": 0, "medium": 3, "low": 0 },
#             { "date": "2025-09-30", "high": 2, "medium": 0, "low": 1 },
#             { "date": "2025-10-01", "high": 1, "medium": 1, "low": 2 }
#         ],
#          "detailedReports": [
#             {
#                 "name": "Report 1",
#                 "date": "May 1, 2024",
#                 "severity": "High/Low",
#                 "category": "Malware",
#                 "link": "/reports/1"
#             },
#             {
#                 "name": "Report 2",
#                 "date": "May 1, 2024",
#                 "severity": "Medium",
#                 "category": "Phishing",
#                 "link": "/reports/2"
#             },
#             {
#                 "name": "Report 3",
#                 "date": "May 1, 2024",
#                 "severity": "Low",
#                 "category": "DDoS",
#                 "link": "/reports/3"
#             }
#         ],
#     }

# routes/dashboard_routes.py
from fastapi import APIRouter, HTTPException,Query
from app.services.mongo_service import MongoService

router = APIRouter()
mongo_service = MongoService()

@router.get("/get_insights")
def get_insights(user_id: str=Query(...)):
    """Get dashboard insights dynamically"""
    data = mongo_service.format_dashboard_data(user_id)
    if not data["uploads"]:
        raise HTTPException(status_code=404, detail="No reports found for this user")
    return data

@router.post("/reset_dashboard")
def reset_dashboard(user_id: str = Query(...)):
    try:
        mongo_service = MongoService()
        mongo_service.reports_collection.delete_many({"user_id": user_id})
        # mongo_service.uploads_collection.delete_many({"user_id": user_id})
        return {"status": "success", "message": "Dashboard data reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reset failed: {str(e)}")
