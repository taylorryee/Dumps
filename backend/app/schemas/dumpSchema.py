from pydantic import BaseModel
from app.schemas.categorySchema import categoryReturn
from app.schemas.thoughtSchema import thoughtReturn
from app.schemas.userSchema import userReturn
from typing import List


class dumpCreate(BaseModel):
    text:str

class dumpReturn(BaseModel):
    id:int
    text:str


    class Config:
        from_attributes=True


class dumpProfile(BaseModel):
    id:int
    dump:dumpReturn
    thoughts:List[thoughtReturn]
    categories:List[categoryReturn]

    class Config:
        from_attributes=True
