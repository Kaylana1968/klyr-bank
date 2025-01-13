from fastapi import FastAPI
from database.db_init import create_db_and_tables


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def read_root():
    return {"message": "Dans le beurre y a de l'huile"}


# def get_session():
#     with Session(engine) as session:
#         yield session


# @app.post("/users/")
# def create_user(body: CreateUser, session=Depends(get_session)) -> User:
#     user = User(name=body.name)
#     session.add(user)
#     session.commit()
#     session.refresh(user)
#     return user


# @app.get("/users/")
# def read_users(session=Depends(get_session)):
#     users = session.exec(select(User)).all()
#     return users


# @app.get("/users/{user_id}")
# def read_user(user_id: int, session=Depends(get_session)):
#     user = session.get(User, user_id)
#     return user


# class Item(BaseModel):
#     name: str
#     description: str
#     price: float
#     tax: float


# class Config(TypedDict):
#     version: str
#     name: str


# @app.post("/items")
# def create_item(item: Item) -> Item:
#     return item


# def get_config():
#     return config


# def get_app_name(config: Config = Depends(get_config)):
#     return config["name"]


# @app.get("/app_name")
# def read_app_name(app_name: str = Depends(get_app_name)):
#     return {"app_name": app_name}
