# Minodu

Monorepo containing all the minodu apps and services

## Development

### Prerequesites

* install node and npm with `brew install node`
* install poetry with `brew install poetry`
* install nx with `npm install -g nx`
* install docker

#### Project specific requirements

* minodu-ai-services requirements:
    * install olama `curl -fsSL https://ollama.com/install.sh | sh` or on mac: `brew install ollama`
    * add olama to autostart: `sudo systemctl enable ollama` (or manually start ollama with `ollama serve`)
    * install models: `ollama pull llama3.2:1b && ollama pull nomic-embed-text && ollama pull all-minilm:l6-v2`
    * unzip vosk models with `(cd models/stt_models && unzip -o vosk-model-small-fr-0.22.zip && unzip -o vosk-model-small-en-us-0.15.zip)`in folder *apps/minodu-ai-services/minodu_ai_services*

### Setup
* create `.env` file in root folder and set these credentials:
```
MYSQL_USER=minodu_user
MYSQL_PASSWORD=password
MYSQL_ROOT_PASSWORD=rootpassword
JWT_SECRET_KEY=secret
ENVIRONMENT=development
```
* run `npm install`
* run development docker container with `npm run docker:start` and stop with `npm run docker:stop`

### Run apps with

* install dependencies with `nx install <app>`
* run tests with `nx test <app>`
* servie with `nx serve <app>`

### NX Usage

```
# List projects with
nx show nx show projects

# install dependencies for specific project
nx install <project>

# Run a specific project
nx serve <project>

# test a single poroject
nx test <project>

# Run tests across all projects
nx run-many --target=test --all

# See project dependency graph
nx graph

# add python project
nx g @nxlv/python:poetry-project <name> --directory=apps/<name> --projectType=application

# add node project
nx g @nx/node:application <name> --directory=apps/<name>
```

## Update Proecedure

* run `sync:update_backup` to create new backup file on digital ocean
* run `sync:database`to fetch and sync data locally
* run `sync:rag`to update embeddings

or run all three steps with

* `npm run sync`

## Deployment on raspberry pi

* install base image rasp pi os 64 bit lite
* create `.env` file in root folder and set password, rootpassword and secret key:
```
MYSQL_USER=minodu_user
MYSQL_PASSWORD=<password>
MYSQL_ROOT_PASSWORD=<rootpassword>
JWT_SECRET_KEY=secret
ENVIRONMENT=production
FORUM_ADMIN_PASSWORD=<some_password>
```
* setup ollama
```
# install ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b && ollama pull nomic-embed-text && ollama pull all-minilm:l6-v2
```
* edit and enable ollama service
```
sudo systemctl edit ollama.service

# Add these lines:
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"

# then enable service
sudo systemctl enable ollama
```

* install other dependencies
```
# install docker
sudo apt update
sudo apt upgrade
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo systemctl enable docker

# install git-lfs and get lfs files
sudo apt install git-lfs

# install npm and poetry
sudo apt install npm
sudo apt install python3-poetry

# install pyenv# Install pyenv
curl https://pyenv.run | bash

# Add to your ~/.bashrc or ~/.zshrc
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
source ~/.bashrc

pyenv install 3.12.11
```

* install docker containers
```
# run this inside minodu repo folder
git lfs pull
npm install

# build and start services
sudo npm run docker:start

# once the database is running, sync online database to local one and update embeddings
npm run sync:database && npm run sync:rag
```

## TODO

* create install script containing these instructions + network and access point setup
