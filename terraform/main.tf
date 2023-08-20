provider "aws" {
  region = "eu-west-2"
}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

resource "aws_s3_bucket" "test_bucket" {
  bucket = "${var.app_name}-test-bucket-${local.account_id}"
}
