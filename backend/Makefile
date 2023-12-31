APPLICATION_NAME = ttrl-app-backend
LOCAL_IMAGE_NAME = ${APPLICATION_NAME}
LAMBDA_IMAGE_NAME = ${APPLICATION_NAME}-lambda
AWS_REGION = eu-west-2
ECR_URL = 525590444307.dkr.ecr.${AWS_REGION}.amazonaws.com
ECR_REPO_NAME = ${APPLICATION_NAME}
IMAGE_VERSION = v0.0.0

build_local:
	docker build --tag ${LOCAL_IMAGE_NAME} -f Dockerfile .

build_lambda:
	docker build --tag ${LAMBDA_IMAGE_NAME} -f Dockerfile.lambda .

run:
	docker compose -p ttrl -f docker-compose.yaml up -d

ecr_login:
	aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URL}

push:
	docker tag ${LAMBDA_IMAGE_NAME} ${ECR_URL}/${ECR_REPO_NAME}:latest
	docker tag ${LAMBDA_IMAGE_NAME} ${ECR_URL}/${ECR_REPO_NAME}:${IMAGE_VERSION}
	docker push ${ECR_URL}/${ECR_REPO_NAME}:${IMAGE_VERSION}
	docker push ${ECR_URL}/${ECR_REPO_NAME}:latest

login_build_push:
	$(MAKE) ecr_login
	$(MAKE) build_lambda
	$(MAKE) push


finch_run:
	finch compose -p ttrl -f docker-compose.yaml up -d

finch_build_local:
	finch build --tag ${LOCAL_IMAGE_NAME} -f Dockerfile .

finch_build_lambda:
	finch build --tag ${LAMBDA_IMAGE_NAME} -f Dockerfile.lambda .

finch_login:
	aws ecr get-login-password --region ${AWS_REGION} --profile ttrl | finch login --username AWS --password-stdin ${ECR_URL}

finch_push:
	finch tag ${LAMBDA_IMAGE_NAME} ${ECR_URL}/${ECR_REPO_NAME}:latest
	finch tag ${LAMBDA_IMAGE_NAME} ${ECR_URL}/${ECR_REPO_NAME}:${IMAGE_VERSION}
	finch push ${ECR_URL}/${ECR_REPO_NAME}:${IMAGE_VERSION}
	finch push ${ECR_URL}/${ECR_REPO_NAME}:latest

finch_login_build_push:
	$(MAKE) finch_login
	$(MAKE) finch_build_lambda
	$(MAKE) finch_push
