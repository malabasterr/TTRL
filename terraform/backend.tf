terraform {
  backend "s3" {
    bucket = "terraform-state-bucket-nzzxabsgro"
    key    = "terraform.tfstate"
    region = "eu-west-2"
  }
}
