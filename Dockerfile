FROM node:22 AS node-build
RUN mkdir /app
COPY . /app
WORKDIR /app/forever_rss/web
RUN yarn install && yarn build

FROM python:3.11.4-slim-bookworm
RUN pip install "poetry==1.8.2"
RUN mkdir /app
COPY poetry.lock pyproject.toml /app
COPY main.py /app
COPY forever_rss /app/forever_rss
COPY --from=node-build /app/forever_rss/web/dist /app/forever_rss/web/dist
WORKDIR /app
RUN POETRY_VIRTUALENVS_CREATE=false poetry install
EXPOSE 8080
ENTRYPOINT ["python", "main.py"]
