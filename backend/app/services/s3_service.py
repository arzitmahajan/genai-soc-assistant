import boto3
from botocore.exceptions import NoCredentialsError
from app.core.config import AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_NAME
import json
from io import BytesIO
class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )

    def get_file_bytes(self, key: str) -> BytesIO:
        """
        Download an object from S3 into memory (BytesIO), no local file.
        key example: "demo_user_123/logs.xlsx"
        """
        obj = self.s3.get_object(Bucket=AWS_BUCKET_NAME, Key=key)
        data = obj["Body"].read()
        return BytesIO(data)
    
    
    def upload_file(self, file_obj, s3_key:str):
        """Uploads a file object (UploadFile) to S3 bucket"""
        try:
            self.s3.upload_fileobj(file_obj.file, AWS_BUCKET_NAME, s3_key)
            file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
            return {"status": "success", "url": file_url}
        except NoCredentialsError:
            return {"status": "error", "message": "AWS credentials not found"}
        
    def delete_user_file(self,user_id:str,filename:str):
        try:
            key = f"{user_id}/{filename}"
            if "reports/" in key:
                return {"status": "error", "message": "Cannot delete report files"}
            try:
                self.s3.head_object(Bucket=AWS_BUCKET_NAME, Key=key)
            except self.s3.exceptions.ClientError:
                return {"status": "error", "message": f"File '{filename}' not found for user {user_id}"}

            # Delete the object
            self.s3.delete_object(Bucket=AWS_BUCKET_NAME, Key=key)
            return {"status": "success", "message": f"File '{filename}' deleted successfully"}

        except NoCredentialsError:
            return {"status": "error", "message": "AWS credentials not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        


    def list_user_files(self,user_id:str):
        """
            List all files in S3 for a specific user.
            Each user’s files are stored under their folder: e.g., 'user123/file.csv'
        """
        try:
            prefix = f"{user_id}/" 
            response = self.s3.list_objects_v2(Bucket=AWS_BUCKET_NAME, Prefix=prefix)
            files = []

            # If the bucket/folder is empty, response may not have 'Contents'
            for obj in response.get("Contents", []):
                key = obj["Key"]
                if "/reports/" in key or  key.endswith(".json"):  # skip "folder" keys
                    continue
                files.append({
                    "filename": key.split("/")[-1],
                    "url": f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{key}",
                    "last_modified": obj["LastModified"].strftime("%Y-%m-%d %H:%M:%S")
                })
            return files
        except Exception as e:
            print("Error listing user files:", e)
            return []

    def download_file(self, filename, local_path):
        """Download a file from S3"""
        self.s3.download_file(AWS_BUCKET_NAME, filename, local_path)
        return local_path


    def save_report(self,user_id: str, filename: str, report_data: dict):
        try:
            report_key = f"{user_id}/reports/{filename}_report.json"
            json_data = json.dumps({"analysis": report_data}, indent=2)
            report_bytes = BytesIO(json_data.encode("utf-8"))
            self.s3.upload_fileobj(report_bytes, AWS_BUCKET_NAME, report_key)
            file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{report_key}"
            return {"status": "success", "url": file_url}

        except Exception as e:
            return {"status": "error", "message": str(e)}


    def delete_user_report(self,user_id:str, reportname:str):
        try:
            key = f"{user_id}/reports/{reportname}"
            if not "reports/" in key:
                return {"status": "error", "message": "Cannot delete report filesof user"}
            try:
                self.s3.head_object(Bucket=AWS_BUCKET_NAME, Key=key)
            except self.s3.exceptions.ClientError:
                return {"status": "error", "message": f"File '{reportname}' not found for user {user_id}"}

            # Delete the object
            self.s3.delete_object(Bucket=AWS_BUCKET_NAME, Key=key)
            return {"status": "success", "message": f"File '{reportname}' deleted successfully"}

        except NoCredentialsError:
            return {"status": "error", "message": "AWS credentials not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
        

    def list_user_reports(self,user_id:str):
        try:
            prefix = f"{user_id}/reports/"
            response = self.s3.list_objects_v2(Bucket=AWS_BUCKET_NAME, Prefix=prefix)
            reports = []
            for obj in response.get("Contents", []):
                key = obj["Key"]
                print("RAW KEY =", repr(key))
                reports.append({
                    "filename": key.split("/")[-1],
                    "url": f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{key}",
                    "last_modified": obj["LastModified"].strftime("%Y-%m-%d %H:%M:%S")
                })
            return reports

        except Exception as e:
            print("Error listing user reports:", e)
            return []
            
    def get_report_content(self,user_id:str,filename:str):
        try:
            report_key = f"{user_id}/reports/{filename}"
            obj = self.s3.get_object(Bucket = AWS_BUCKET_NAME, Key=report_key)
            content = obj["Body"].read().decode("utf-8")
            print (content)
            return {"content": content}
        
        except Exception as e:
            return {"status": "error", "message": str(e)}