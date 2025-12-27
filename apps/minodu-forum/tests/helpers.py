import requests

from minodu_forum.src.config import Config


def is_service_available():
    try:
        response = requests.get(Config().service_url, timeout=5)
        return True
    except requests.ConnectionError:
        return False