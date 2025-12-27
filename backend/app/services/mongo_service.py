from pymongo import MongoClient
from datetime import datetime
from collections import Counter
import os
from uuid import uuid4
class MongoService:
    def __init__(self):
        mongo_uri = os.getenv("MONGO_URI")
        self.client = MongoClient(mongo_uri)
        self.db = self.client["soc_assistant"]
        self.users_collection = self.db["users"]
        self.reports_collection  = self.db["analysis_reports"]
        self.uploads_collection  = self.db["uploads_collection"]

    def insert_user_report(self, user_id, filename, metrics):
        try:
            document = {
                "user_id": user_id,
                "filename": filename,
                "metrics": metrics
            }
            result = self.reports_collection.insert_one(document)
            print(f"Document inserted with ID: {result.inserted_id}")
        except Exception as e:
            print(f"Mongo insert failed: {e}")

    def count_user_uploads(self, user_id):
        """Count total uploads by user"""
        try:
            return self.reports_collection.count_documents({"user_id": user_id})
        except Exception as e:
            print(f"Count query failed: {e}")
            return 0
        
    def log_file_upload(self, user_id, filename):
        """Record user file uploads separately"""
        try:
            document = {
                "user_id": user_id,
                "filename": filename,
                "uploaded_at": datetime.utcnow()
            }
            result = self.uploads_collection.insert_one(document)
            print(f"File upload logged with ID: {result.inserted_id}")

        except Exception as e:
            print(f"Upload log insert failed: {e}")

    def get_latest_report(self, user_id):
        """Fetch the latest report for the given user"""
        try:
            return self.reports_collection.find_one(
                {"user_id": user_id}
            )
        except Exception as e:
            print(f"Failed to fetch latest report: {e}")
            return None
        

    def format_dashboard_data(self, user_id):
        """Convert all reports for a user into a dashboard-friendly format."""
        reports = list(self.reports_collection.find({"user_id": user_id}))
        if not reports:
            return {
                "uploads": 0,
                "reports": 0,
                "insights": [],
                "incidentSummary": {},
                "incidentTrends": [],
                "detailedReports": [],
                "lastUpload": None
            }

        all_incidents = {"high": 0, "medium": 0, "low": 0}
        all_trends = []
        all_threats = []
        detailed = []

        # Aggregate data across all reports
        for report in reports:
            metrics = report.get("metrics", {})
            inc_sum = metrics.get("incidentSummary", {})

            all_incidents["high"] += inc_sum.get("high", 0)
            all_incidents["medium"] += inc_sum.get("medium", 0)
            all_incidents["low"] += inc_sum.get("low", 0)

            all_trends.extend(metrics.get("incidentTrends", []))
            all_threats.extend([t.get("threat_name") for t in metrics.get("top_5_threats", [])])

            report_detail = metrics.get("reportDetail", {})
            detailed.append({
                "name": report_detail.get("name", "N/A"),
                "date": report_detail.get("date", "N/A"),
                "severity": report_detail.get("severity", "N/A"),
                "category": report_detail.get("category", "N/A"),
                "link": f"/reports/{report['_id']}"
            })

        # Fetch most recent upload date
        try:
            threat_counts = Counter(all_threats)
            top_5_insights = [t[0] for t in threat_counts.most_common(5)]
            last_upload_doc = self.uploads_collection.find_one(
                {"user_id": user_id},
                sort=[("uploaded_at", -1)]
            )
            last_upload_date = last_upload_doc["uploaded_at"] if last_upload_doc else None
            formatted_last_upload = (
                last_upload_date.strftime("%b %d, %Y, %I:%M %p") if last_upload_date else None
            )
        except Exception as e:
            print(f"Failed to fetch last upload for dashboard: {e}")
            formatted_last_upload = None

        return {
            "uploads": self.count_user_uploads(user_id),
            "reports": len(reports),
            "totalIncidents": len(set(all_threats)),
            "insights": top_5_insights,
            "incidentSummary": all_incidents,
            "incidentTrends": all_trends,
            "detailedReports": detailed,
            "lastUpload": formatted_last_upload
        }
    
# users mongo
    def get_user_by_email(self, email: str):
        return self.users_collection.find_one({"email": email})
    
    def update_last_login(self, email: str):
            self.users_collection.update_one(
                {"email": email},
                {"$set": {"last_login": datetime.utcnow()}}
            )
    def create_user(self, email: str, hashed_password: str):
        user_id = str(uuid4())
        user = {
            "id": user_id,
            "email": email,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "last_login": None,
            "role": "user",
            "is_active": True
        }
        self.users_collection.insert_one(user)
        return user
