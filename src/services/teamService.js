const { randomUUID } = require("crypto");

const { getItem, putItem } = require("../database/databaseService");

const TOURNAMENTS_TABLE = process.env.TOURNAMENTS_TABLE;
const TEAMS_TABLE = process.env.TEAMS_TABLE;

const createTeam = async (tournamentId, teamData) => {
  const tournament = await getItem(TOURNAMENTS_TABLE, {
    id: tournamentId,
  });

  if (!tournament) {
    return {
      error: "Tournament not found",
      statusCode: 404,
    };
  }

  const { name, city, coach } = teamData;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof city !== "string" ||
    !city.trim() ||
    typeof coach !== "string" ||
    !coach.trim()
  ) {
    return {
      error: "Name, city and coach are required",
      statusCode: 400,
    };
  }

  const team = {
    id: randomUUID(),
    tournamentId,
    name: name.trim(),
    city: city.trim(),
    coach: coach.trim(),
  };

  await putItem(TEAMS_TABLE, team);

  return team;
};

module.exports = {
  createTeam,
};
