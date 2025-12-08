#!/bin/bash

cleanup() {
    echo "Task cancelled, running cleanup..."
    # Your cleanup command here
    nx celery:stop minodu-forum
    exit 0
}

trap cleanup SIGINT SIGTERM

# Your main command
nx celery:start minodu-forum
poetry run python minodu_forum/main.py

# Cleanup on normal exit too
cleanup