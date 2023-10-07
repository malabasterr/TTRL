locals {
  location_lambda_path = "${path.module}/../backend/location_lambda"
}

resource "null_resource" "pip_install" {
  triggers = {
    shell_hash = "${sha256(file("${local.location_lambda_path}/requirements.txt"))}"
  }

  provisioner "local-exec" {
    command = <<EOT
python3 -m pip install \
--platform manylinux2014_x86_64 \
--implementation cp \
--python-version 3.10 \
--only-binary=:all: \
-r ${local.location_lambda_path}/requirements.txt \
-t ${local.location_lambda_path}
EOT
  }
}

data "archive_file" "zip_location_lambda" {
  type        = "zip"
  source_dir  = local.location_lambda_path
  output_path = "${path.module}/location_lambda.zip"
  depends_on  = [null_resource.pip_install]
}

resource "aws_lambda_function" "location_lambda" {
  function_name    = "${local.app_name}-location-lambda"
  filename         = data.archive_file.zip_location_lambda.output_path
  source_code_hash = data.archive_file.zip_location_lambda.output_base64sha256

  handler       = "location_lambda.handler"
  runtime       = "python3.10"
  timeout       = 10
  architectures = ["x86_64"]

  role = aws_iam_role.location_lambda.arn

  environment {
    variables = {
      DB_HOST     = aws_db_instance.rds_instance.address
      DB_PORT     = aws_db_instance.rds_instance.port
      DB_USER     = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).username
      DB_PASSWORD = jsondecode(data.aws_secretsmanager_secret_version.rds_password.secret_string).password
      DB_NAME     = aws_db_instance.rds_instance.db_name
    }
  }

  vpc_config {
    security_group_ids = [data.aws_security_group.default.id]
    subnet_ids         = data.aws_subnets.default.ids
  }
}

resource "aws_lambda_function_url" "location_lambda" {
  function_name      = aws_lambda_function.location_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_iam_policy" "location_lambda" {
  name = "${local.app_name}-location-lambda-policy"
  policy = templatefile("${path.module}/templates/location_lambda_policy.json", {}
  )
}

resource "aws_iam_role" "location_lambda" {
  name = "${local.app_name}-location-lambda-role"

  assume_role_policy  = data.aws_iam_policy_document.lambda_assume_policy.json
  managed_policy_arns = [resource.aws_iam_policy.location_lambda.arn]
}
