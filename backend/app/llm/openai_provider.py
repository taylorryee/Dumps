import os, json, re
from app.llm import client
from app.llm import prompts
from pydantic import BaseModel

#This is the actual logic 
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

    def extract_thoughts(self, text: str):
        instruction = prompts.THOUGHT_EXTRACTION_INSTRUCTIONS
        response = client.response_create(
            model=self.model,
            instructions=instruction,
            input=text,
            response_format={ "type": "json_object" },
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT,
        )
        #raw = response.output[0].content[0].text

        return json.loads(response.output_text)

    def give_thought_category(self,text:str):
        instruction = prompts.THOUGHT_TO_CATEGORY
        response = client.response_create(
            model=self.model,
            instructions=instruction,
            input=text,
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT
        )
        #raw = response.output[0].content[0].text
        return response.output_text



    def embed(self, texts: list[str], model: str = "text-embedding-3-small"):
        # OpenAI embeddings: batch
        resp = client.embeddings_create(model=model, input=texts)
        # resp["data"] is per-input embedding
        return [item["embedding"] for item in resp["data"]]
