const { PutCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
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

const getTournamentById = async (tournamentId) => {
  const result = await dynamoDb.send(new GetCommand({
    TableName: TABLE,
    Key: { tournamentId },
  }));
  return result.Item;
};

const getAllTournaments = async () => {
  const result = await dynamoDb.send(new ScanCommand({ TableName: TABLE }));
  return result.Items;
};

module.exports = { createTournament, getTournamentById, getAllTournaments };