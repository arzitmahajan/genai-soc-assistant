# app/services/metrics_extractor.py
from datetime import datetime
import re

def extract_metrics_from_analysis(filename: str, analysis_text: str):
    """
    Input: analysis_text (string) from your ai_engine.analyze_logs_with_genai
    Output: metrics dict accepted by MongoService.update_dashboard_metrics
    This is a simple extractor that you can refine over time.
    """
    # counts heuristics
    text = analysis_text.lower() if isinstance(analysis_text, str) else ""

    # incident counts: simple heuristic = number of numbered bullet points or occurrences of 'suspicious' / 'threat'
    incidents_detected = max(1, len(re.findall(r"\d+\.", text))) if text else 0

    # severity heuristics: look for words
    high = len(re.findall(r"\b(high|critical)\b", text))
    medium = len(re.findall(r"\b(medium)\b", text))
    low = len(re.findall(r"\b(low)\b", text))

    # top threats heuristics: try to extract common threat names
    threats = []
    possible_threats = ["malware", "phishing", "ddos", "brute-force", "failed login", "privilege escalation", "data leak", "suspicious ip"]
    for t in possible_threats:
        if t in text:
            threats.append(t)

    # incident trends: today's point (single point). For a more accurate trend, you should compute daily aggregations.
    trend_point = {
        "date": datetime.utcnow().strftime("%Y-%m-%d"),
        "high": high,
        "medium": medium,
        "low": low
    }

    metrics = {
        "incidents_detected": incidents_detected,
        "severity": {"high": high, "medium": medium, "low": low},
        "top_threats": threats[:5],
        "trend_point": trend_point
    }
    return metrics
