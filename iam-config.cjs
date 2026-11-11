module.exports = () => {
  const iam = {
    role: {
      statements: [
        {
          Effect: "Allow",
          Action: [
            "dynamodb:PutItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
            "dynamodb:Scan",
          ],
          Resource: [
            { "Fn::GetAtt": ["TournamentsTable", "Arn"] },
            { "Fn::GetAtt": ["TeamsTable", "Arn"] },
            { "Fn::GetAtt": ["MatchesTable", "Arn"] },
          ],
        },
      ],
    },
  };

  // Optional account-specific deployment role.
  if (process.env.CUPIFY_DEPLOYMENT_ROLE) {
    iam.deploymentRole = process.env.CUPIFY_DEPLOYMENT_ROLE;
  }

  // Optional boundary for the generated Lambda execution role.
  if (process.env.CUPIFY_PERMISSIONS_BOUNDARY) {
    iam.role.permissionsBoundary = process.env.CUPIFY_PERMISSIONS_BOUNDARY;
  }

  return iam;
};
