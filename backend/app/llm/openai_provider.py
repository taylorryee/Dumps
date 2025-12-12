import os, json, re
from app.llm import client
from app.llm import prompts
from pydantic import BaseModel
from typing import List



DEFAULT_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
DEFAULT_SUMMARY_MODEL = os.getenv("LLM_SUMMARY_MODEL", DEFAULT_MODEL)
DEFAULT_TIMEOUT = int(os.getenv("LLM_TIMEOUT", "30"))

class OpenAIProvider:
    def __init__(self, model: str = DEFAULT_MODEL, summary_model: str = DEFAULT_SUMMARY_MODEL):
        self.model = model
        self.summary_model = summary_model

    def summarize(self, text: str) -> str:
        instruction = prompts.SUMMARY_INSTRUCTIONS
        response = client.response_create(
            model=self.summary_model,
            instructions=instruction,
            input=text, 
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT,
        )
        #raw = response.output[0].content[0].text  
        return response.output_text

    def extract_thoughts(self, text: str)->prompts.ThoughtResponse:
        instruction = prompts.THOUGHT_EXTRACTION_INSTRUCTIONS
        response = client.response_parse(
            model=self.model,
            instructions=instruction,
            input=text,
            text_format=prompts.ThoughtResponse,
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT,
        )

        return response.output_parsed

    def extract_categories(self,text:str):
        instruction = prompts.THOUGHT_TO_CATEGORY
        response = client.response_parse(
            model=self.model,
            instructions=instruction,
            input=text,
            text_format=prompts.CategoryResponse,
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT
        )

        return response.output_parsed



    def embed_categories(self, texts: list[str], model: str = "text-embedding-3-small"):
        # OpenAI embeddings: batch
        response = client.embeddings_create(model=model, input=texts)
        # resp["data"] is per-input embedding
        
        embeddings = [item.embedding for item in response.data] 
        return embeddings
    

