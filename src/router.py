from .auth.controller.register import router as register_router


def add_router_to_app(app, router):
    app.include_router(router, prefix="/api")


def define_routes(app):
    add_router_to_app(app, register_router)
