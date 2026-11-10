const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const { dynamoDb } = require("../database/dynamodb");

const TABLE = process.env.TOURNAMENTS_TABLE;

const createTournament = async ({ name, sport }) => {
  const tournament = {
    tournamentId: randomUUID(),
    name,
    sport,
    status: "upcoming",
    createdAt: new Date().toISOString(),
  };

  await dynamoDb.send(new PutCommand({ TableName: TABLE, Item: tournament }));

  return tournament;
};

module.exports = { createTournament };