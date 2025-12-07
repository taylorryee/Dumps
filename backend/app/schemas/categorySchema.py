from pydantic import BaseModel

class categoryCreate(BaseModel):
    name:str

class categoryReturn(BaseModel):
    id:int
    name:str
    class Config:
        from_attributes=True