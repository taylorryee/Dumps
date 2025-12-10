import os

PROVIDER = os.getenv("LLM_PROVIDER", "mock").lower()

def get_provider():
    from app.llm.openai_provider import OpenAIProvider
    return OpenAIProvider()

