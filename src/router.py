from .auth.controller.register import router as register_router
from .auth.controller.login import router as login_router
from .auth.controller.user import router as user_router

from .payment.controller.account import router as account_router
from .payment.controller.deposit import router as deposit_router



def add_router_to_app(app, router):
    app.include_router(router, prefix="/api")


def define_routes(app):
    add_router_to_app(app, register_router)
    add_router_to_app(app, login_router)
    add_router_to_app(app, user_router)
    add_router_to_app(app, account_router)
    add_router_to_app(app, deposit_router)
