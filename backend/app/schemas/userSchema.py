from pydantic import BaseModel
from app.schemas.dumpSchema import dumpReturn
from typing import List

class userCreate(BaseModel):
    email:str
    password:str

class userCreateReturn(BaseModel):
    id:int
    username:str
    class Config:
        from_attributes = True

class userLogin(BaseModel):
    email:str
    password:str

class userLoginReturn(BaseModel):
    id:int
    username :str
    token :str

    class Config:
        from_attributes=True


class userProfileReturn(BaseModel):
    id:int
    username:str
    dumps:List[dumpReturn]
    class Config:
        from_attributes=True
    