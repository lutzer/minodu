# minodu-forum
Backend for the minodu forum

## Env Vars

* check *src/config.py* to see what env vars can be changed
* you need to supply a different *JWT_SECRET_KEY*
* you probably want to supply a different *DATABASE_URL*

## Development

### Setup

* install pyenv `brew install pyenv`
* run `pyenv install 3.12.11` 
* install poetry with `brew install poetry`
* run `poetry install`

### Tests

* run tests with `nx test`or `nx test -- -s`