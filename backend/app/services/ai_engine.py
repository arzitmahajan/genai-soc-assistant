import pandas as pd
import json
from datetime import datetime
from openai import OpenAI
from app.core.config import TOKEN
token = TOKEN
client = OpenAI(
    base_url="https://models.github.ai/inference",
    api_key=token
)

def analyze_logs_with_genai(logs_df: pd.DataFrame):
    # Reduce payload size but keep multi-line JSON
    logs_text = logs_df.to_json(orient="records", lines=True)[:4000]

    enhanced_prompt = f"""
You are a cybersecurity log analysis assistant.
You MUST ALWAYS output a JSON object EXACTLY in the structure below.
Never return markdown. Never explain.

If any field cannot be inferred → fill with:
- numbers → 0
- strings → ""
- arrays → []

REQUIRED OUTPUT STRUCTURE:
{{
    "analysis": "<2–3 paragraph summary>",
    "metrics": {{
        "reportDetail": {{
            "name": "<auto generated>",
            "date": "{datetime.utcnow().strftime('%Y-%m-%d')}",
            "severity": "<High|Medium|Low>",
            "category": "<primary threat category>"
        }},
        "incidentSummary": {{
            "high": 0,
            "medium": 0,
            "low": 0
        }},
        "incidentTrends": [
            {{ "date": "YYYY-MM-DD", "high": 0, "medium": 0, "low": 0 }}
        ],
        "top_5_threats": [
            {{
                "threat_name": "<string>",
                "description": "<string>",
                "severity": "<High|Medium|Low>",
                "frequency": 0
            }}
        ]
    }}
}}

Rules:
- You MUST output all fields, even if empty.
- Use timestamps from logs if available; else use today's date.
- Group similar log events into a single “threat”.
- Severity: unauthorized access = High, suspicious activity = Medium, info events = Low.
- No missing keys allowed.

LOG DATA:
{logs_text}
"""

    response = client.chat.completions.create(
        model="openai/gpt-4o",
        messages=[
            {"role": "system", "content": "You are a cybersecurity SOC assistant. Output only valid JSON."},
            {"role": "user", "content": enhanced_prompt}
        ],
        response_format={"type": "json_object"},
        max_tokens=700
    )

    raw_output = response.choices[0].message.content.strip()

    # Try normal load
    try:
        return json.loads(raw_output)
    except json.JSONDecodeError:
        pass

    # Fix if model wrapped JSON in ```json
    if raw_output.startswith("```"):
        repaired = raw_output.strip("`").replace("json", "", 1).strip()
        try:
            return json.loads(repaired)
        except:
            pass

    # Last fallback: ensure the app never breaks
    return {
        "analysis": "Model returned invalid JSON, here is the raw output.",
        "raw": raw_output
    }

    
# if __name__ == "__main__":
#     file_path = "E:/genai-soc-assistant/backend/app/sample_logs.json"
#     logs_df = load_logs(file_path)
#     print("Logs Loaded: ")
#     print(logs_df.head())

#     result = analyze_logs_with_genai(logs_df)
#     print("\n GenAI Analysis Results:")
#     print(result)



