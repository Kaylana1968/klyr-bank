from .account.controller.account import router as account_router
from .account.controller.beneficiary import router as beneficiary_router

from .auth.controller.register import router as register_router
from .auth.controller.login import router as login_router
from .auth.controller.user import router as user_router

from .payment.controller.transaction import router as transaction_router
from .payment.controller.deposit import router as deposit_router
from .payment.controller.withdrawal import router as withdrawal_router

from .cron_jobs import router as cron_jobs_router

# Add api to the route path
def add_router_to_app(app, router):
    app.include_router(router, prefix="/api")

# Add all routes from different files to path
def define_routes(app):
    add_router_to_app(app, register_router)
    add_router_to_app(app, login_router)
    add_router_to_app(app, user_router)
    add_router_to_app(app, account_router)
    add_router_to_app(app, beneficiary_router)
    add_router_to_app(app, deposit_router)
    add_router_to_app(app, transaction_router)
    add_router_to_app(app, withdrawal_router)
    add_router_to_app(app, cron_jobs_router)
