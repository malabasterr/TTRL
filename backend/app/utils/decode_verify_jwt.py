import json
import os
import urllib.request
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from jose import jwk, jwt
from jose.utils import base64url_decode

IN_LAMBDA = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None
APP_CLIENT_ID = os.getenv("COGNITO_APP_CLIENT_ID")
if APP_CLIENT_ID is None:
    raise ValueError("'APP_CLIENT_ID' environment variable not set")


def get_cognito_public_key():
    REGION = os.getenv("AWS_REGION")
    USERPOOL_ID = os.getenv("COGNITO_USER_POOL_ID")

    if USERPOOL_ID is None or REGION is None:
        raise ValueError("'USERPOOL_ID' and 'REGION' environment variables not set")
    PUB_KEYS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USERPOOL_ID}/.well-known/jwks.json"

    with urllib.request.urlopen(PUB_KEYS_URL) as f:
        response = f.read()
    keys = json.loads(response.decode("utf-8"))["keys"]

    return keys


def get_user_id_from_authorization(authorization: str) -> Optional[UUID]:
    token = authorization.split(" ")[1]
    # If in lambda, don't verify token as it's already verified via APIGW
    # We're also in VPC and unable to access jwks.json.
    if IN_LAMBDA:
        verify_jwt = False
    else:
        verify_jwt = True
    username = _verify_token_and_get_username(token, verify_jwt)
    if username is None:
        return None

    return UUID(username)


def _verify_token_and_get_username(token: str, verify_jwt=True) -> Optional[str]:
    if verify_jwt:
        keys = get_cognito_public_key()
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

    # since we passed the verification, we can now safely use the unverified claims
    # In the case of verify_jwt=False, we assume the token is already validated (e.g. via APIGW)
    claims = jwt.get_unverified_claims(token)

    # Validate App Client ID
    if claims["client_id"] != APP_CLIENT_ID:
        print("Client IDs do not match")
        return None

    # Verify Expiry
    expiry = datetime.fromtimestamp(claims["exp"]).replace(tzinfo=timezone.utc)
    if expiry < datetime.now(timezone.utc):
        print(f"Token has expired at {expiry.isoformat()}")
        return None

    # Get Username
    username = claims["username"]
    return username


if __name__ == "__main__":
    # for testing locally
    from getpass import getpass

    token = getpass()
    username = _verify_token_and_get_username(token)
    print(username)
