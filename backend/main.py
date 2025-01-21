from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database.init import create_db_and_tables
from src.router import define_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/api")
def read_root():
    raise HTTPException(status_code=200, detail="Dans le beurre y a de l'huile")


define_routes(app)
