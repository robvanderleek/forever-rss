import requests
from fastapi import HTTPException


def get_current_user(access_token: str) -> dict:
    res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"bearer {access_token}"}
    )
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Error fetching user data from GitHub.")
    return res.json()


def get_current_user_primary_email(access_token: str) -> str:
    res = requests.get(
        "https://api.github.com/user/emails",
        headers={"Authorization": f"bearer {access_token}"}
    )
    if res.status_code != 200:
        raise HTTPException(status_code=400, detail="Error fetching emails data from GitHub.")
    emails = res.json()
    for email in emails:
        if email['primary']:
            return email['email']
