const { randomUUID } = require("crypto");

const { getItem, putItem } = require("../database/databaseService");

const createTeam = async (tournamentId, teamData) => {
  // 1. Kontrollera att turneringen finns
  const tournament = await getItem("Tournaments", {
    id: tournamentId,
  });

  if (!tournament) {
    return {
      error: "Tournament not found",
      statusCode: 404,
    };
  }

  // 2. Kontrollera att alla obligatoriska fält finns
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

  // 3. Skapa lagets objekt
  const team = {
    id: randomUUID(),
    tournamentId,
    name: name.trim(),
    city: city.trim(),
    coach: coach.trim(),
  };

  // 4. Spara laget i DynamoDB
  await putItem("Teams", team);

  // 5. Returnera det skapade laget
  return team;
};

module.exports = {
  createTeam,
};
