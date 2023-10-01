provider "aws" {
  region = "eu-west-2"
  default_tags {
    tags = local.tags
  }
}

locals {
  account_id = data.aws_caller_identity.current.account_id
  app_name   = "ttrl-app"
  tags = {
    application = local.app_name
  }
}

resource "aws_s3_bucket" "test_bucket" {
  bucket = "${local.app_name}-test-bucket-${local.account_id}"
}
