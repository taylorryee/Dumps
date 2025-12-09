import os

#This file holds all calls to the llm - in my case openai. 
from openai import OpenAI

OPENAI_KEY = os.getenv("OPENAI_API_KEY")


#**kwargs = receives keyword arguments (key=value pairs), its is just 
#a flexible way for your function to accept any number of named arguments—even ones it wasn’t explicitly expecting.
#This is used to future proff the function because openai may add new arguements that can be passed into its functions
#so using kwargs prevents against this. 
client = OpenAI(api_key=OPENAI_KEY)


def response_create(**kwargs): #this calls the openai responses api - this api is how you talk to the model. 
    return client.responses.create(**kwargs)

def embeddings_create(**kwargs):#this calls the open ai embedding api
    return client.embeddings.create(**kwargs)
