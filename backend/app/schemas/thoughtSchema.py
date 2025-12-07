from pydantic import BaseModel
from typing import List
from categorySchema import categoryReturn

class thoughtCreate(BaseModel):#This is just internal creation, user never actually creates a thought
    text:str


class thoughtReturn(BaseModel):
    id:int
    cleaned_text:str
    raw_text:str
    categories:List[categoryReturn]
    class Config:
        from_attributes=True
