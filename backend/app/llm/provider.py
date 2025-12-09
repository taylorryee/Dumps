import os

PROVIDER = os.getenv("LLM_PROVIDER", "mock").lower()

def get_provider():
    if PROVIDER == "openai":
        from app.llm.openai_provider import OpenAIProvider
        return OpenAIProvider()

