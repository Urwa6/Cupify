const { randomUUID } = require("crypto");

const {
  getItem,
  putItem,
  queryItems,
  updateItem,
} = require("../database/databaseService");

const TOURNAMENTS_TABLE = process.env.TOURNAMENTS_TABLE;
const TEAMS_TABLE = process.env.TEAMS_TABLE;
const MATCHES_TABLE = process.env.MATCHES_TABLE;

// ---------- Helpers ----------

// Check that a value is a non-empty string
const isText = (value) => typeof value === "string" && value.trim() !== "";

// Check that a value is a valid ISO 8601 date, e.g. "2026-11-20T14:00:00Z"
const isValidDate = (value) => isText(value) && !isNaN(Date.parse(value));

// Check that a score is a whole number that is 0 or higher
const isValidScore = (value) => Number.isInteger(value) && value >= 0;

// Get a tournament, or null if it does not exist
const findTournament = (tournamentId) =>
  getItem(TOURNAMENTS_TABLE, { id: tournamentId });

// Get a match in a tournament, or null if it does not exist
const findMatch = (tournamentId, matchId) =>
  getItem(MATCHES_TABLE, { tournamentId, id: matchId });

// Validate homeTeamId, awayTeamId and date (used by both POST and PUT).
// Returns an error object, or null if everything is OK.
const validateMatchData = async (tournamentId, matchData) => {
  const { homeTeamId, awayTeamId, date } = matchData;

  if (!isText(homeTeamId) || !isText(awayTeamId) || !isText(date)) {
    return {
      error: "homeTeamId, awayTeamId and date are required",
      statusCode: 400,
    };
  }

  if (!isValidDate(date)) {
    return {
      error: "date must be a valid ISO 8601 date",
      statusCode: 400,
    };
  }

  // A team cannot play against itself
  if (homeTeamId === awayTeamId) {
    return {
      error: "A team cannot play against itself",
      statusCode: 400,
    };
  }

  // Both teams must exist in THIS tournament.
  // Because the Teams table key is (tournamentId + id), a team from
  // another tournament will not be found here.
  const [homeTeam, awayTeam] = await Promise.all([
    getItem(TEAMS_TABLE, { tournamentId, id: homeTeamId }),
    getItem(TEAMS_TABLE, { tournamentId, id: awayTeamId }),
  ]);

  if (!homeTeam) {
    return { error: "Home team not found in tournament", statusCode: 404 };
  }

  if (!awayTeam) {
    return { error: "Away team not found in tournament", statusCode: 404 };
  }

  return null;
};

// ---------- Endpoints ----------

// GET /tournaments/{id}/matches
const getAllMatches = async (tournamentId) => {
  const tournament = await findTournament(tournamentId);
  if (!tournament) {
    return { error: "Tournament not found", statusCode: 404 };
  }

  const matches = await queryItems(MATCHES_TABLE, "tournamentId", tournamentId);

  return matches || [];
};

// GET /tournaments/{id}/matches/{matchId}
const getMatchById = async (tournamentId, matchId) => {
  const tournament = await findTournament(tournamentId);
  if (!tournament) {
    return { error: "Tournament not found", statusCode: 404 };
  }

  const match = await findMatch(tournamentId, matchId);
  if (!match) {
    return { error: "Match not found", statusCode: 404 };
  }

  return match;
};

// POST /tournaments/{id}/matches
const createMatch = async (tournamentId, matchData) => {
  const tournament = await findTournament(tournamentId);
  if (!tournament) {
    return { error: "Tournament not found", statusCode: 404 };
  }

  const validationError = await validateMatchData(tournamentId, matchData);
  if (validationError) {
    return validationError;
  }

  // New matches always start as "scheduled" without a result
  const match = {
    id: randomUUID(),
    tournamentId,
    homeTeamId: matchData.homeTeamId,
    awayTeamId: matchData.awayTeamId,
    date: matchData.date,
    status: "scheduled",
    homeScore: null,
    awayScore: null,
  };

  await putItem(MATCHES_TABLE, match);

  return match;
};

// PUT /tournaments/{id}/matches/{matchId}
const updateMatch = async (tournamentId, matchId, matchData) => {
  const tournament = await findTournament(tournamentId);
  if (!tournament) {
    return { error: "Tournament not found", statusCode: 404 };
  }

  const match = await findMatch(tournamentId, matchId);
  if (!match) {
    return { error: "Match not found", statusCode: 404 };
  }

  // A completed match cannot be changed
  if (match.status !== "scheduled") {
    return {
      error: "Only scheduled matches can be updated",
      statusCode: 409,
    };
  }

  const validationError = await validateMatchData(tournamentId, matchData);
  if (validationError) {
    return validationError;
  }

  // Only these three fields are updated.
  // id, tournamentId, status and scores stay the same.
  const updatedMatch = await updateItem(
    MATCHES_TABLE,
    { tournamentId, id: matchId },
    "SET homeTeamId = :homeTeamId, awayTeamId = :awayTeamId, #date = :date",
    {
      ":homeTeamId": matchData.homeTeamId,
      ":awayTeamId": matchData.awayTeamId,
      ":date": matchData.date,
    },
    { "#date": "date" } // "date" is a reserved word in DynamoDB
  );

  return updatedMatch;
};

// PATCH /tournaments/{id}/matches/{matchId}/result
const registerResult = async (tournamentId, matchId, resultData) => {
  const tournament = await findTournament(tournamentId);
  if (!tournament) {
    return { error: "Tournament not found", statusCode: 404 };
  }

  const match = await findMatch(tournamentId, matchId);
  if (!match) {
    return { error: "Match not found", statusCode: 404 };
  }

  const { homeScore, awayScore } = resultData;

  if (homeScore === undefined || awayScore === undefined) {
    return {
      error: "homeScore and awayScore are required",
      statusCode: 400,
    };
  }

  if (!isValidScore(homeScore) || !isValidScore(awayScore)) {
    return {
      error: "Scores must be whole numbers that are 0 or greater",
      statusCode: 400,
    };
  }

  // A result can only be registered once
  if (match.status !== "scheduled") {
    return {
      error: "The match already has a registered result",
      statusCode: 409,
    };
  }

  const updatedMatch = await updateItem(
    MATCHES_TABLE,
    { tournamentId, id: matchId },
    "SET homeScore = :homeScore, awayScore = :awayScore, #status = :completed",
    {
      ":homeScore": homeScore,
      ":awayScore": awayScore,
      ":completed": "completed",
    },
    { "#status": "status" } // "status" is a reserved word in DynamoDB
  );

  return updatedMatch;
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  registerResult,
};
