def extract_metrics(ai_response: dict) -> dict:
    """
    Extracts the 'metrics' field from the GenAI response safely.
    It handles nested structures and stringified JSON cases.
    """
    import json

    if not ai_response:
        return {}

    # Case 1: response is a string (GenAI sometimes returns JSON as a string)
    if isinstance(ai_response, str):
        try:
            ai_response = json.loads(ai_response)
        except json.JSONDecodeError:
            return {}

    # Case 2: handle wrapped structure like {"analysis": {...}}
    if "analysis" in ai_response and isinstance(ai_response["analysis"], dict):
        inner = ai_response["analysis"]
        return inner.get("metrics", {})

    # Case 3: if "metrics" exists at top level
    if "metrics" in ai_response:
        return ai_response["metrics"]

    return {}
