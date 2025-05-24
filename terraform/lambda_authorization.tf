# locals {
#   auth_lambda_path = "${path.module}/../backend/lambdas/auth_lambdas"
# }

# data "archive_file" "zip_lambda_auth" {
#   type        = "zip"
#   source_dir  = local.auth_lambda_path
#   output_path = "${path.module}/lambda_auth.zip"
# }

# resource "aws_lambda_function" "lambda_auth" {
#   function_name    = "${local.app_name}-api-key-auth"
#   filename         = data.archive_file.zip_lambda_auth.output_path
#   source_code_hash = data.archive_file.zip_lambda_auth.output_base64sha256

#   handler       = "authorizer.handler"
#   runtime       = "python3.12"
#   timeout       = 2
#   architectures = ["x86_64"]

#   role = aws_iam_role.lambda_auth.arn

#   environment {
#     variables = {
#       # This is temporary!
#       STATIC_API_KEY = ""
#     }
#   }
# }

# resource "aws_iam_role" "lambda_auth" {
#   name               = "${local.app_name}-auth-lambda-role"
#   assume_role_policy = data.aws_iam_policy_document.lambda_assume_policy.json
# }

# resource "aws_iam_role_policy_attachment" "lambda_auth" {
#   role       = aws_iam_role.lambda_auth.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }
