resource "aws_cognito_user_pool" "this" {
  name = "${local.app_name}-user-pool"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  #   deletion_protection = "ACTIVE"

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "given_name"
    required            = true
  }

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "family_name"
    required            = true
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
    invite_message_template {
      email_subject = "TTRL Live App User Account"
      email_message = file("templates/cognito_email.txt")
      sms_message   = file("templates/cognito_sms.txt")
    }
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }


  }

  email_configuration {
    reply_to_email_address = var.cognito_email_address
  }
}

resource "aws_cognito_user_pool_domain" "this" {
  domain       = local.app_name
  user_pool_id = aws_cognito_user_pool.this.id
}


resource "aws_cognito_user_pool_client" "this" {
  name = "${local.app_name}-pool-client"

  user_pool_id = aws_cognito_user_pool.this.id

  callback_urls = ["http://localhost"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["openid", "email"]
  supported_identity_providers         = ["COGNITO"]

  access_token_validity   = 12
  enable_token_revocation = true
}
