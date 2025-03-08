import jwt
import requests
from fastapi import APIRouter, HTTPException

from forever_rss.config import config
from forever_rss.schemas.AuthSchema import AuthSchema
from forever_rss.services import github
from forever_rss.services.github import get_current_user_email

router = APIRouter()


@router.get("/oauth/redirect")
def oauth_redirect(code: str) -> AuthSchema:
    res = requests.post("https://github.com/login/oauth/access_token",
                        headers={"Accept": "application/json"},
                        data={
                            "client_id": config.client_id,
                            "client_secret": config.client_secret,
                            "code": code
                        }
                        )
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Error fetching access token from GitHub.")
    token_data = res.json()
    access_token = token_data["access_token"]
    user = github.get_current_user(access_token)
    email = get_current_user_email(access_token)
    encoded_jwt = jwt.encode({"sub": email, 'access_token': access_token}, config.jwt_secret, algorithm='HS256')
    return AuthSchema(token=encoded_jwt, user=user)
