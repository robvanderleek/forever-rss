import jwt
import requests
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from forever_rss.config import config
from forever_rss.database.crud_user import db_get_user_by_github_login, db_create_user
from forever_rss.database.db import get_session
from forever_rss.schemas.AuthSchema import AuthSchema
from forever_rss.schemas.UserSchema import UserSchema, UserCreateSchema
from forever_rss.services import github
from forever_rss.services.github import get_current_user_primary_email

router = APIRouter()


@router.get("/oauth/redirect")
def oauth_redirect(code: str, session: Session = Depends(get_session)) -> AuthSchema:
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
    github_user = github.get_current_user(access_token)
    db_user = db_get_user_by_github_login(session, github_user['login'])
    if not db_user:
        email = get_current_user_primary_email(access_token)
        new_user = UserCreateSchema(githubLogin=github_user['login'], avatarUrl=github_user['avatar_url'],
                                    name=github_user['name'], email=email)
        db_user = db_create_user(session, new_user)
    user = UserSchema.model_validate(db_user)
    encoded_jwt = jwt.encode({"sub": str(user.uuid), 'access_token': access_token}, config.jwt_secret,
                             algorithm='HS256')
    return AuthSchema(token=encoded_jwt, user=user)
