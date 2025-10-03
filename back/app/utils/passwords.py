import hashlib
import os
import hmac

def make_password(password: str, iterations: int = 100_000) -> str:
    # Genera un salt aleatorio de 16 bytes
    salt = os.urandom(16)

    # Deriva la clave con PBKDF2-HMAC-SHA512
    dk = hashlib.pbkdf2_hmac(
        "sha512",
        password.encode(),
        salt,
        iterations
    )

    # Guardamos en formato hex
    salt_hex = salt.hex()
    hash_hex = dk.hex()

    return f"{salt_hex}${iterations}${hash_hex}"


def check_password(password: str, stored: str) -> bool:
    # Separa el formato salt$iterations$hashed
    salt_hex, iterations_str, hash_hex = stored.split("$")

    salt = bytes.fromhex(salt_hex)
    iterations = int(iterations_str)
    stored_hash = bytes.fromhex(hash_hex)

    # Recalcula el hash con la misma config
    new_hash = hashlib.pbkdf2_hmac(
        "sha512",
        password.encode(),
        salt,
        iterations
    )

    # Comparación segura contra timing attacks
    return hmac.compare_digest(new_hash, stored_hash)
