"""
YieldSense AI  -  Firebase Admin SDK Client

Initializes and provides the Firebase Admin SDK singleton.
"""

import os
import firebase_admin
from firebase_admin import credentials
from app.core.config import get_settings


_firebase_app = None


def initialize_firebase() -> firebase_admin.App:
    """
    Initialize the Firebase Admin SDK.

    Uses the service account key file path from settings.
    Ensures only one Firebase app instance exists (singleton pattern).

    Returns:
        The initialized Firebase App instance.
    """
    global _firebase_app

    if _firebase_app is not None:
        return _firebase_app

    settings = get_settings()
    key_path = settings.FIREBASE_SERVICE_ACCOUNT_KEY_PATH

    if not os.path.exists(key_path):
        raise FileNotFoundError(
            f"Firebase service account key not found at: {key_path}. "
            f"Please download it from Firebase Console and place it at the specified path."
        )

    cred = credentials.Certificate(key_path)
    _firebase_app = firebase_admin.initialize_app(
        cred,
        {
            "projectId": settings.FIREBASE_PROJECT_ID,
        },
    )

    return _firebase_app


def get_firebase_app() -> firebase_admin.App:
    """Get the initialized Firebase app instance."""
    global _firebase_app
    if _firebase_app is None:
        return initialize_firebase()
    return _firebase_app
