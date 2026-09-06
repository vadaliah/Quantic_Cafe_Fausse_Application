import boto3
import psycopg
from flask import current_app
from psycopg.rows import dict_row


def create_database_connection():
    database_host = current_app.config["DB_HOST"]

    if not database_host:
        raise RuntimeError(
            "DB_HOST is not configured with the Aurora cluster endpoint."
        )

    aws_session = boto3.Session(
        profile_name=current_app.config["AWS_PROFILE"],
        region_name=current_app.config["AWS_REGION"],
    )

    rds_client = aws_session.client("rds")

    authentication_token = rds_client.generate_db_auth_token(
        DBHostname=database_host,
        Port=current_app.config["DB_REMOTE_PORT"],
        DBUsername=current_app.config["DB_USER"],
        Region=current_app.config["AWS_REGION"],
    )

    return psycopg.connect(
        host=database_host,
        hostaddr=current_app.config["DB_HOST_ADDRESS"],
        port=current_app.config["DB_LOCAL_PORT"],
        dbname=current_app.config["DB_NAME"],
        user=current_app.config["DB_USER"],
        password=authentication_token,
        sslmode="require",
        connect_timeout=10,
        row_factory=dict_row,
    )