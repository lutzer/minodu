# MINODU AI Services

## Prerequisites (on DEV and HOST machine)

* install olama `curl -fsSL https://ollama.com/install.sh | sh` or on mac: `brew install ollama`
* add olama to autostart: `sudo systemctl enable ollama` (or manually start ollama with `ollama serve`)
* install models: `ollama pull llama3.2:1b && ollama pull nomic-embed-text && ollama pull all-minilm:l6-v2`
* install ffmpeg: `sudo apt-get install ffmpeg`

## Docker Setup

```
# runs container (uses localy installed ollama)
docker-compose up
```

### Test Docker

```
#build with
docker build -t minodu-ai .

 #run
docker run -p 3000:3001 minodu-ai -e OLLAMA_HOST=<host_ip>>:11434

#shell access
docker exec -it minodu-ai /bin/sh
```

## Dev Setup

* install pyenv `brew install pyenv`
* run `pyenv install 3.12.11` 
* install poetry with `brew install poetry`
* run `poetry install`
* unzip vosk models with `(cd models/stt_models && unzip vosk-model-small-fr-0.22.zip && unzip vosk-model-small-en-us-0.15.zip)`

### Tests

* run tests with `nx test`or `nx test -- -s`

### Add Documents to chatbot

* add documents with `python src/rag.py --add-docs data/documents/fr/ --language=fr`
* add documents with `python src/rag.py --add-docs data/documents/en/ --language=en`

### Run API

* run with `python main.py`




