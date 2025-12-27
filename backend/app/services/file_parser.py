import pandas as pd
from fastapi import HTTPException

# def parse_file(file_path: str):
#         """Load logs into pandas DataFrame depending on file extension."""
#         try:
#             # Load into pandas (basic check)
#             if file_path.endswith(".json"):
#                 df = pd.read_json(file_path)
#             elif file_path.endswith(".csv"):
#                 df = pd.read_csv(file_path)
#             elif file_path.endswith(".xlsx"):
#                 df = pd.read_excel(file_path)
#             else:
#                 # Fallback for plain .log or .txt files
#                 with open(file_path, "r", encoding="utf-8") as f:
#                     lines = [line.strip() for line in f.readlines() if line.strip()]
#                 return pd.DataFrame({"raw_log": lines})
            
#             if df.shape[1] == 1 or df.empty:
#                 # Fallback to line-based reading
#                 with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
#                     lines = [line.strip() for line in f.readlines() if line.strip()]
#                 df = pd.DataFrame({"raw_log": lines})
#             return df
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")
from io import BytesIO

def parse_file(file_bytes: BytesIO, filename: str):
    """
    Parse an in-memory file (from S3) into a DataFrame using the filename
    to detect type.
    """
    try:
        file_bytes.seek(0)

        if filename.endswith(".json"):
            df = pd.read_json(file_bytes)
        elif filename.endswith(".csv"):
            df = pd.read_csv(file_bytes)
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        if df.shape[1] == 1 or df.empty:
            raise ValueError("Detected raw log format")

        return df
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")
