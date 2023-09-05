APPLICATION_NAME ?= ttrl-backend

build:
	docker build --tag ${APPLICATION_NAME} .

run:
	docker compose -p ttrl -f docker-compose.yaml up -d
