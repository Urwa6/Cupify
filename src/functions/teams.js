const { createTeam } = require("../services/teamService");

// Lambda handler for creating a new team
const createTeamHandler = async (event) => {
  try {
    // Get the tournament ID from the URL
    const tournamentId = event.pathParameters?.id;

    // Check if the request body exists
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Request body is required",
        }),
      };
    }

    // Parse the JSON request body
    let teamData;

    try {
      teamData = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON",
        }),
      };
    }

    // Validate the request body structure
    if (!teamData || typeof teamData !== "object" || Array.isArray(teamData)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Request body must be an object",
        }),
      };
    }

    // Call the team service
    const result = await createTeam(tournamentId, teamData);

    // Handle errors returned by the service
    if (result.error) {
      return {
        statusCode: result.statusCode,
        body: JSON.stringify({
          error: result.error,
        }),
      };
    }

    // Return the newly created team
    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("Error creating team:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};

module.exports = {
  createTeamHandler,
};
