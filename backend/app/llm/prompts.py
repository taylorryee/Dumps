from pydantic import BaseModel
from typing import List

class Thought(BaseModel):
    summary:str
    original_text:str
class ThoughtResponse(BaseModel):
    thoughts:List[Thought]

class Category(BaseModel):
    name:str
class CategoryResponse(BaseModel):
    categories:List[Category]


SUMMARY_INSTRUCTIONS = """
You are a text-compression assistant. 
Requirements:
- Preserve all emotional tone.
- Preserve the user's intent, worries, motivations, and desires.
- Do NOT interpret or add meaning.
- Do NOT remove uncertainty, doubt, or contradictions.
- Do NOT fix the user’s emotions or offer advice.
- Only shorten and reorganize for clarity.
- Keep the summary as close as possible to the original meaning.
- Output only the compressed dump."""



THOUGHT_EXTRACTION_INSTRUCTIONS = """
You are an assistant that splits a short user text (a "compressed dump") into discrete thought units.

For each thought:
- "summary" should be a short, clear restatement of the thought.
- "original_text" should be the exact portion of the input text that the summary is based on.

Return your results in a list of thoughts. Do not invent information that does not appear in the input.
"""



THOUGHT_TO_CATEGORY = """
You are an assistant that assigns short, high-level categories to a single user thought.

For each category:
- "name" should be the category name as plain text (no JSON, no explanation)
- "name" should be short (1-3 words)

Requirements:
- Category should be high-level and reusable across many thoughts.
- Do NOT restate the thought.
- Do NOT create overly specific categories.
- Do NOT include quotes.

Examples:
Thought: "I want to start running again"
Categories: Fitness Goals

Thought: "I'm worried about my job security"
Categories: Career Anxiety

Thought: "I need to save more money"
Categories: Personal Finance

Thought: "Feeling overwhelmed balancing work and health."
Categories: Work Stress, Emotional Wellbeing"""

