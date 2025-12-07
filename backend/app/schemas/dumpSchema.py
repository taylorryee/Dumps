from pydantic import BaseModel


class dumpCreate(BaseModel):
    text:str

class dumpReturn(BaseModel):
    id:int
    text:str

    class Config:
        from_attributes=True