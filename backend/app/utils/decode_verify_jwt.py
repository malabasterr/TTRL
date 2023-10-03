import json
import os
import urllib.request
from typing import Optional

from jose import jwk, jwt
from jose.utils import base64url_decode

REGION = os.getenv("AWS_REGION")
USERPOOL_ID = os.getenv("COGNITO_USER_POOL_ID")
APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")
if USERPOOL_ID is None or APP_CLIENT_ID is None or REGION is None:
    raise ValueError("Environment variables are not set")

PUB_KEYS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USERPOOL_ID}/.well-known/jwks.json"

with urllib.request.urlopen(PUB_KEYS_URL) as f:
    response = f.read()
keys = json.loads(response.decode("utf-8"))["keys"]


def verify_token_and_get_username(token: str) -> Optional[str]:
    # get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)

    kid = headers["kid"]
    # search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        print("Public key not found in jwks.json")
        return None

    # construct the public key
    public_key = jwk.construct(keys[key_index])

    # get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)

    # decode the signature
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    # verify the signature
    if not public_key.verify(message.encode("utf8"), decoded_signature):
        print("Signature verification failed")
        return None

    # since we passed the verification, we can now safely
    # use the unverified claims
    claims = jwt.get_unverified_claims(token)
    username = claims["username"]
    return username


if __name__ == "__main__":
    # for testing locally
    from getpass import getpass

    token = getpass()
    username = verify_token_and_get_username(token)
    print(username)
