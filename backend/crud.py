from typing import Dict, Any, Optional
from backend.utils import get_password_hash

# This is a mock database for demonstration purposes.
# In a real application, you would connect to a proper database (e.g., PostgreSQL, MongoDB).
FAKE_USERS_DB = {
    "testuser": {
        "username": "testuser",
        "hashed_password": "$2b$12$K1f.cM1F0.B.J.1D7Q.7fO.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0.Q0", # plaintext: "password"
        "disabled": False,
    }
}

def get_user(username: str) -> Optional[Dict[str, Any]]:
    return FAKE_USERS_DB.get(username)

def create_user(username: str, password: str) -> Dict[str, Any]:
    hashed_password = get_password_hash(password)
    user_data = {
        "username": username,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    FAKE_USERS_DB[username] = user_data
    return user_data