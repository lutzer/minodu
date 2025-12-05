import logging
from src.celery_app import app

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

if __name__ == '__main__':
    app.worker_main(['worker', '--loglevel=INFO'])