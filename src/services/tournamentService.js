const {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
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
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: TABLE,
      Key: { tournamentId },
    }),
  );
  return result.Item;
};

const getAllTournaments = async () => {
  const result = await dynamoDb.send(new ScanCommand({ TableName: TABLE }));
  return result.Items;
};
const updateTournamentStatus = async (tournamentId, status) => {
  try {
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { tournamentId },
        UpdateExpression: "SET #s = :s",
        ConditionExpression: "attribute_exists(tournamentId)",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":s": status },
        ReturnValues: "ALL_NEW",
      }),
    );
    return result.Attributes;
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") return null;
    throw err;
  }
};
const hasItemsForTournament = async (tableName, tournamentId) => {
  const result = await dynamoDb.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: "tournamentId = :id",
      ExpressionAttributeValues: { ":id": tournamentId },
    }),
  );
  return result.Items.length > 0;
};

const tournamentHasTeamsOrMatches = async (tournamentId) => {
  const hasTeams = await hasItemsForTournament(
    process.env.TEAMS_TABLE,
    tournamentId,
  );
  const hasMatches = await hasItemsForTournament(
    process.env.MATCHES_TABLE,
    tournamentId,
  );
  return hasTeams || hasMatches;
};

const deleteTournament = async (tournamentId) => {
  await dynamoDb.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { tournamentId },
    }),
  );
};

module.exports = {
  createTournament,
  getTournamentById,
  getAllTournaments,
  updateTournamentStatus,
  tournamentHasTeamsOrMatches,
  deleteTournament,
};
