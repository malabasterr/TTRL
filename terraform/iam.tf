resource "aws_iam_policy" "ecr_role" {
  name = var.iam_policy_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "*"
      }
    ]
  })
}

# Create an IAM role
resource "aws_iam_role" "ecr_role" {
  name = var.role_name
}

# Attach the IAM policy to the IAM role
resource "aws_iam_policy_attachment" "ecr_role" {
  name       = "Policy Attachement"
  policy_arn = aws_iam_policy.jenkins_iam_policy.arn
  roles      = [aws_iam_role.jenkins_role.name]
}

# Create an IAM instance profile
resource "aws_iam_instance_profile" "ecr_role" {
  name = var.instance_profile_name
  role = aws_iam_role.jenkins_role.name
}
