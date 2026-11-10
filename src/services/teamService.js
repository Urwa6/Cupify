const { randomUUID } = require("crypto");

const { getItem, putItem } = require("../database/databaseService");

const TOURNAMENTS_TABLE = process.env.TOURNAMENTS_TABLE;
const TEAMS_TABLE = process.env.TEAMS_TABLE;

// Create a new team in a tournament
const createTeam = async (tournamentId, teamData) => {
  // Check if the tournament exists
  const tournament = await getItem(TOURNAMENTS_TABLE, {
    id: tournamentId,
  });

  if (!tournament) {
    return {
      error: "Tournament not found",
      statusCode: 404,
    };
  }

  // Validate required team fields
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

  // Create a new team object with a unique ID
  const team = {
    id: randomUUID(),
    tournamentId,
    name: name.trim(),
    city: city.trim(),
    coach: coach.trim(),
  };

  // Save the team to DynamoDB
  await putItem(TEAMS_TABLE, team);

  // Return the newly created team
  return team;
};

module.exports = {
  createTeam,
};
