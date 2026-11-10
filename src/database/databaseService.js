const {PutCommand,GetCommand,QueryCommand,DeleteCommand,UpdateCommand,ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const { dynamoDb } = require("./dynamodb");

// Add a new item to a DynamoDB table
const putItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  await dynamoDb.send(new PutCommand(params));
};

// Get one item from a DynamoDB table
const getItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };

  const result = await dynamoDb.send(new GetCommand(params));

  return result.Item;
};

// Get multiple items from a DynamoDB table
const queryItems = async (tableName, partitionKey, value) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#pk = :value",
    ExpressionAttributeNames: {
      "#pk": partitionKey,
    },
    ExpressionAttributeValues: {
      ":value": value,
    },
  };

  const result = await dynamoDb.send(new QueryCommand(params));

  return result.Items;
};

// Delete an item from a DynamoDB table
const deleteItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };

  await dynamoDb.send(new DeleteCommand(params));
};

// Update an existing item in a DynamoDB table
const updateItem = async (
  tableName,
  key,
  updateExpression,
  expressionAttributeValues,
  expressionAttributeNames = {}
) => {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  if (Object.keys(expressionAttributeNames).length > 0) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  const result = await dynamoDb.send(new UpdateCommand(params));

  return result.Attributes;
};
module.exports = {
  putItem,getItem,queryItems,deleteItem,updateItem,};