from contextvars import ContextVar
from typing import Union

import jwt
from starlette.requests import Request
from starlette.types import ASGIApp, Scope, Receive, Send

from forever_rss.config import config

REQUEST_CTX_SUB_KEY = "request_ctx_sub_key"

_request_sub_ctx_var: ContextVar[str] = ContextVar(REQUEST_CTX_SUB_KEY, default='Anonymous')


def get_request_sub() -> str:
    return _request_sub_ctx_var.get()


def _set_request_sub(token: str):
    return _request_sub_ctx_var.set(token)


def get_jwt_from_request(req: Request) -> Union[str, None]:
    if 'authorization' in req.headers:
        auth_header = req.headers['authorization']
        if auth_header.lower().startswith('bearer '):
            return auth_header[7:]


class RequestMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] not in ["http", "websocket"]:
            await self.app(scope, receive, send)
            return

        req = Request(scope, receive)
        encoded_jwt = get_jwt_from_request(req)
        if encoded_jwt:
            payload = jwt.decode(encoded_jwt, config.jwt_secret, algorithms=['HS256'])
            prev_sub = _set_request_sub(payload['sub'])
            await self.app(scope, receive, send)
            _request_sub_ctx_var.reset(prev_sub)
        else:
            await self.app(scope, receive, send)
