from app.llm.provider import get_provider

def summarize_text(text: str) -> str:
    provider = get_provider()
    return provider.summarize(text)



def extract_thoughts_from_text(text: str):
    provider = get_provider()
    # Use hybrid flow: if text long, first summarize then extract
    if len(text) > 4000:   # you can change threshold to token-based later
        text = provider.summarize(text)
    results = provider.extract_thoughts(text)
    return results

def embed_texts(texts: list[str]):
    provider = get_provider()
    return provider.embed(texts)
