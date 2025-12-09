import os, json, re
from app.llm import client
from app.llm import prompts

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
        prompt = prompts.SUMMARY_PROMPT.format(text=text)
        response = client.response_create(
            model=self.summary_model,
            instructions=instruction,
            input=prompt, 
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT,
        )
        raw = response.output[0].content[0].text  
        return raw.strip()

    def extract_thoughts(self, text: str):
        prompt = prompts.THOUGHT_EXTRACTION_PROMPT.format(text=text)
        instruction = prompts.THOUGHT_EXTRACTION_INSTRUCTIONS

        resp = client.response_create(
            model=self.model,
            instructions=instruction,
            input=prompt,
            response_format={ "type": "json_object" },
            max_output_tokens=800,
            timeout=DEFAULT_TIMEOUT,
        )
        raw = resp.output[0].content[0].text

        return json.loads(raw)

    def embed(self, texts: list[str], model: str = "text-embedding-3-small"):
        # OpenAI embeddings: batch
        resp = client.embeddings_create(model=model, input=texts)
        # resp["data"] is per-input embedding
        return [item["embedding"] for item in resp["data"]]
