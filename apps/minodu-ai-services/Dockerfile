FROM python:3.11-slim AS base

# prepare container
RUN apt-get update -y && apt upgrade -y && apt-get clean -y
RUN apt-get install ffmpeg -y
RUN apt-get install unzip -y

# Install Poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --only=main --no-interaction --no-ansi

# copy files
ENV APP_HOME=/app
WORKDIR $APP_HOME
COPY ./minodu_ai_services ./

# unzip models
#RUN (cd models/stt_models && unzip vosk-model-small-fr-0.22.zip && unzip vosk-model-small-en-us-0.15.zip)

# run app
CMD python main.py