const {
  PutCommand,
  GetCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { randomUUID } = require("crypto");
const { dynamoDb } = require("../database/dynamodb");

const TABLE = process.env.TOURNAMENTS_TABLE;

const createTournament = async ({ name, sport, location, startDate }) => {
  const tournament = {
    id: randomUUID(),
    name,
    sport,
    location,
    startDate,
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
      Key: { id: tournamentId },
    }),
  );
  return result.Item;
};

const getAllTournaments = async () => {
  const tournaments = [];
  let lastEvaluatedKey;

  do {
    // Scan the tournaments table
    const result = await dynamoDb.send(
      new ScanCommand({
        TableName: TABLE,
        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );

    tournaments.push(...(result.Items || []));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return tournaments;
};

const updateTournamentStatus = async (tournamentId, status) => {
  try {
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id: tournamentId },
        UpdateExpression: "SET #s = :s",
        ConditionExpression: "attribute_exists(id)",
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
  // Check if the tournament has any teams or matches
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "tournamentId = :id",
      ExpressionAttributeValues: {
        ":id": tournamentId,
      },
      Limit: 1,
    }),
  );

  return (result.Items || []).length > 0;
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
      Key: { id: tournamentId },
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
