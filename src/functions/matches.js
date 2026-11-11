const { successResponse, errorResponse } = require("../utils/response");
const {
  getAllMatches,
  getMatchById,
  createMatch,
} = require("../services/matchService");

// Read and parse the JSON body.
// Returns { data } on success or { error } if the body is missing or invalid.
const parseBody = (event) => {
  if (!event.body) {
    return { error: "Request body is required" };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { error: "Invalid JSON" };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { error: "Request body must be a JSON object" };
  }

  return { data };
};

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

// POST /tournaments/{id}/matches
const createMatchHandler = async (event) => {
  try {
    const tournamentId = event.pathParameters?.id;

    const body = parseBody(event);
    if (body.error) return errorResponse(400, body.error);

    const result = await createMatch(tournamentId, body.data);
    return toResponse(result, 201);
  } catch (error) {
    return handleServerError(error);
  }
};

module.exports = {
  getAllMatchesHandler,
  getMatchByIdHandler,
  createMatchHandler,
};
