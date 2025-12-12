from app.llm.provider import get_provider

def summarize_text(text: str) -> str:
    provider = get_provider()
    return provider.summarize(text)


def extract_thoughts(text: str):
    provider = get_provider()
    # Use hybrid flow: if text long, first summarize then extract
    #if len(text) > 4000:   # you can change threshold to token-based late
    return provider.extract_thoughts(text)
    
def extract_categories(text:str):
    provider = get_provider()
    return provider.extract_categories(text)

def embed_categories(texts: list[list[float]]):
    provider = get_provider()
    return provider.embed_categories(texts)

