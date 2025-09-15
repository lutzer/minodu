# Minodu

Monorepo containing all the minodu apps and services

## Prerequesites

* install node and npm with `brew install node`
* install poetry with `brew install poetry`
* install nx with `npm install -g nx`

### Project specific requirements

* minodu-ai-services requirements:
    * install olama `curl -fsSL https://ollama.com/install.sh | sh` or on mac: `brew install ollama`
    * add olama to autostart: `sudo systemctl enable ollama` (or manually start ollama with `ollama serve`)
    * install models: `ollama pull llama3.2:1b && ollama pull nomic-embed-text`
    * unzip vosk models with `(cd models/stt_models && unzip -o vosk-model-small-fr-0.22.zip && unzip -o vosk-model-small-en-us-0.15.zip)`in folder *apps/minodu-ai-services/minodu_ai_services*

## Setup

* run `npm install`

## Run apps with

* install dependencies with `nx install <app>`
* run tests with `nx test <app>`
* servie with `nx serve <app>`

## NX Usage

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
