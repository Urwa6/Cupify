const { successResponse, errorResponse } = require("../utils/response");
const { getAllMatches, getMatchById } = require("../services/matchService");

// Turn a service result into an HTTP response
const toResponse = (result, successStatus) => {
  if (result.error) {
    return errorResponse(result.statusCode, result.error);
  }
  return successResponse(successStatus, result);
};

// Catch unexpected errors so the API always answers with JSON
const handleServerError = (error) => {
  console.error("Matches error:", error);
  return errorResponse(500, "Internal server error");
};

// GET /tournaments/{id}/matches
const getAllMatchesHandler = async (event) => {
  try {
    const tournamentId = event.pathParameters?.id;
    const result = await getAllMatches(tournamentId);
    return toResponse(result, 200);
  } catch (error) {
    return handleServerError(error);
  }
};

// GET /tournaments/{id}/matches/{matchId}
const getMatchByIdHandler = async (event) => {
  try {
    const tournamentId = event.pathParameters?.id;
    const matchId = event.pathParameters?.matchId;
    const result = await getMatchById(tournamentId, matchId);
    return toResponse(result, 200);
  } catch (error) {
    return handleServerError(error);
  }
};

module.exports = {
  getAllMatchesHandler,
  getMatchByIdHandler,
};
