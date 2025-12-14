from pydantic import BaseModel


class userCreate(BaseModel):
    email:str
    password:str

class userReturn(BaseModel):
    username:str
    class Config:
        from_attributes = True

class userLogin(BaseModel):
    email:str
    password:str

class userLoginReturn(BaseModel):
    username :str
    token :str

    class Config:
        from_attributes=True