const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Create a connection to DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "eu-north-1",
});

// Create a document client for easier database operations
const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

module.exports = { dynamoDb };