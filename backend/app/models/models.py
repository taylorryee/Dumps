from sqlalchemy import Column,Integer,String,ForeignKey,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import Base

from pgvector.sqlalchemy import Vector


class User(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    email = Column(String,unique=True,index=True)
    username = Column(String,unique=True,index=True)
    hashed_password = Column(String,index=True)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    dumps = relationship("Dump",back_populates="user")

    categories = relationship("Category",back_populates="users")


class Dump(Base): #intial thought dump
    __tablename__ = "dumps"
    id = Column(Integer,primary_key=True,index=True)
    text = Column(String,index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    thoughts = relationship("Thought",back_populates="dump")
    
    user_id = Column(Integer,ForeignKey("users.id"))
    user = relationship("User",back_populates="dumps")

    categories = relationship("Category",secondary="dumps_categories",back_populates="dumps")


class Thought(Base):#indivual thoughts extracted from dump
    __tablename__ = "thoughts"
    id = Column(Integer,primary_key=True,index=True)
    cleaned_text = Column(String,index=True)
    raw_text = Column(String,index=True)
    #embedding = Column(Vector(1536))
    
    dump_id = Column(Integer,ForeignKey("dumps.id"))
    dump=relationship("Dump",back_populates="thoughts")

    categories = relationship("Category", secondary="thoughts_categories", back_populates="thoughts")
    #Use the thoughts_categories table as the secondary join table.
    #Find rows where thoughts_categories.thought_id equals the current thought’s ID.
    #Collect the category_id values from those rows.
    #Load and return the matching Category objects.



class Category(Base):#global table of categories
    __tablename__="categories"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,unique=True,index=True)
    embedding = Column(Vector(1536)) #embedding dimension for OpenAI text-embedding-3-small

    thoughts = relationship("Thought", secondary="thoughts_categories", back_populates="categories")
    #Use the thoughts_categories table as the secondary join table.
    #Find rows where thoughts_categories.category_id equals the current category’s ID.
    #Collect the thought_id values from those rows.
    #Load and return the matching Thought objects.
    dumps = relationship("Dump",secondary="dumps_categories",back_populates="categories")

    users = relationship("User",secondary="users_categories",back_populates="categories")




######################################## JOIN TABLES ############################################################

class ThoughtCategory(Base):#join table - used for many-many relationship between category and thought
    __tablename__ = "thoughts_categories"
    #We have 2 primary keys here as the (thought_id,category_id) is what uniquly identifes each instance
    thought_id = Column(Integer, ForeignKey("thoughts.id"),primary_key=True) 
    category_id = Column(Integer, ForeignKey("categories.id"),primary_key=True)


class DumpCategory(Base): #join table for dumps and categories, there can be multiple dumps in 1 category, 
                        #and there can be multiple categories in 1 dump -> many to many relationship
    __tablename__ = "dumps_categories"
    dump_id = Column(Integer,ForeignKey("dumps.id"),primary_key=True)
    category_id = Column(Integer,ForeignKey("categories.id"),primary_key=True)


class UserCategory(Base):
    __tablename__="users_categories"
    user_id = Column(Integer,ForeignKey("users.id"),primary_key=True)
    category_id = Column(Integer,ForeignKey("categories.id"),primary_key=True)



    

