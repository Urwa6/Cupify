const { getItem, queryItems } = require("../database/databaseService");

const TOURNAMENTS_TABLE = process.env.TOURNAMENTS_TABLE;
const MATCHES_TABLE = process.env.MATCHES_TABLE;

// ---------- Helpers ----------

// Get a tournament, or null if it does not exist
const findTournament = (tournamentId) =>
  getItem(TOURNAMENTS_TABLE, { id: tournamentId });

// Get a match in a tournament, or null if it does not exist
const findMatch = (tournamentId, matchId) =>
  getItem(MATCHES_TABLE, { tournamentId, id: matchId });

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

module.exports = {
  getAllMatches,
  getMatchById,
};
