import os


class Config:
    AWS_PROFILE = os.getenv(
        "AWS_PROFILE",
        "cafe-fausse-application-sandbox",
    )
    AWS_REGION = os.getenv("AWS_REGION", "us-east-2")

    DB_NAME = os.getenv("DB_NAME", "cafe_fausse_db")
    DB_USER = os.getenv("DB_USER", "cafe_fausse_developer")

    # Aurora hostname used when generating the IAM authentication token.
    DB_HOST = os.getenv("DB_HOST", "")

    # Local SSM tunnel connection.
    DB_HOST_ADDRESS = os.getenv("DB_HOST_ADDRESS", "127.0.0.1")
    DB_LOCAL_PORT = int(os.getenv("DB_LOCAL_PORT", "15433"))
    DB_REMOTE_PORT = int(os.getenv("DB_REMOTE_PORT", "5432"))