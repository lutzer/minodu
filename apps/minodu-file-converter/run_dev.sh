#!/bin/bash

cleanup() {
    echo "Task cancelled, running cleanup..."
    # Your cleanup command here
    nx redis:stop minodu-file-converter
    exit 0
}

trap cleanup SIGINT SIGTERM

# Your main command
nx redis:start minodu-file-converter
nx serve minodu-file-converter

# Cleanup on normal exit too
cleanup