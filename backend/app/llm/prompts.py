SUMMARY_INSTRUCTIONS = """
You are a text-compression assistant. 
Rules:
- Preserve all emotional tone.
- Preserve the user's intent, worries, motivations, and desires.
- Do NOT interpret or add meaning.
- Do NOT remove uncertainty, doubt, or contradictions.
- Do NOT fix the user’s emotions or offer advice.
- Only shorten and reorganize for clarity.
- Keep the summary as close as possible to the original meaning.
- Output only the compressed dump."""

SUMMARY_PROMPT = """
Input:
\"\"\"{text}\"\"\"
Return only the compressed text (no explanation).
"""

THOUGHT_EXTRACTION_INSTRUCTIONS = """
You are an assistant that splits a short user text (a "compressed dump") into discrete "thought" units.

You MUST return valid JSON, in this exact format:
{
  "thoughts": [
    {
      "summary": "...",
      "original_text": "..."
    }
  ]
}

Rules:
- Do NOT add any text outside JSON.
- Do NOT comment on your process.
- Do NOT wrap JSON in code blocks.
"""


THOUGHT_EXTRACTION_PROMPT = """
Input:
\"\"\"{text}\"\"\"
"""
