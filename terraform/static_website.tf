provider "aws" {
  region = "us-east-1"
  alias  = "acm_provider"
  default_tags {
    tags = local.tags
  }
}

module "static_web_app" {
  source      = "cn-terraform/s3-static-website/aws"
  version     = "1.0.8"
  name_prefix = "${local.app_name}-frontend"

  providers = {
    aws.main         = aws
    aws.acm_provider = aws.acm_provider
  }

  website_domain_name = var.domain_name

  create_acm_certificate = true

  create_route53_hosted_zone = true

  website_server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

  www_website_redirect_enabled = false
  log_bucket_force_destroy     = false
}
