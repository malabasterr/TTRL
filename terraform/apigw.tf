# resource "aws_acm_certificate" "this" {
#   domain_name = var.domain_name
#   validation_method = "DNS"
#   lifecycle {
#     create_before_destroy = true
#   }
# }

module "api_gateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.2.2"

  name          = "${local.app_name}-apigw"
  description   = "TTRL API GW"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  create_api_domain_name = false
  # domain_name = var.domain_name
  # domain_name_certificate_arn = aws_acm_certificate.this.arn

  # Access logs
  default_stage_access_log_destination_arn = aws_cloudwatch_log_group.logs.arn
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
    "ANY /{proxy+}" = {
      lambda_arn             = aws_lambda_function.backend_lambda.arn
      integration_type       = "AWS_PROXY"
      timeout_milliseconds   = 10000
      payload_format_version = "2.0"
      authorization_type     = "JWT"
      authorizer_key         = "cognito"
    }
  }

  authorizers = {
    "cognito" = {
      authorizer_type  = "JWT"
      identity_sources = "$request.header.Authorization"
      name             = "cognito"
      audience         = [aws_cognito_user_pool_client.this.id]
      issuer           = "https://${aws_cognito_user_pool.this.endpoint}"
    }
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "${local.app_name}-apigw-access-log"
}
