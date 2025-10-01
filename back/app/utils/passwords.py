def make_password(password: str) -> str:
    import hashlib
    return hashlib.sha512(password.encode()).hexdigest()


def check_password(password: str, hashed: str) -> bool:
    return make_password(password) == hashed
