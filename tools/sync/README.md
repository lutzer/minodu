# Sync Database Script

Syncs the online backend with the local one

## Dependencies

* install curl and unzip with `sudo apt-get install curl unzip`

## Run

* run python script: `poetry run python sync.py http://minodu.chickenkiller.com:3000/v1/files/minodu_backend_backup.zip --destination=test --user=minodu_user --password=password`
