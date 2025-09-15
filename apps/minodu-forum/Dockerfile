FROM python:3.12-slim AS base

# prepare container
RUN apt-get update -y && apt upgrade -y && apt-get clean -y

# Install Poetry
RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock ./
RUN poetry install --no-root --only=main --no-interaction --no-ansi

ENV APP_HOME=/app
WORKDIR $APP_HOME

# copy files
COPY ./minodu_forum ./

# run app
CMD python main.py