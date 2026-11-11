const { getItem, queryItems } = require("../database/databaseService");

const TOURNAMENTS_TABLE = process.env.TOURNAMENTS_TABLE;
const MATCHES_TABLE = process.env.MATCHES_TABLE;

// ---------- Helpers ----------

// Get a tournament, or null if it does not exist
const findTournament = (tournamentId) =>
  getItem(TOURNAMENTS_TABLE, { id: tournamentId });

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

module.exports = {
  getAllMatches,
};
