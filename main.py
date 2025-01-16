from fastapi import FastAPI

from database.init import create_db_and_tables
from src.router import define_routes

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/api/")
def read_root():
    return {"message": "Dans le beurre y a de l'huile"}


define_routes(app)
