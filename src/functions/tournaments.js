const { successResponse, errorResponse } = require("../utils/response");
const service = require("../services/tournamentService");

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return null;
  }
};

const isText = (value) => typeof value === "string" && value.trim() !== "";
const ALLOWED_STATUSES = ["upcoming", "ongoing", "completed"];
exports.create = async (event) => {
  const body = parseBody(event);
  if (!body) return errorResponse(400, "Not correct JSON");

  if (!isText(body.name)) return errorResponse(400, "name required");
  if (!isText(body.sport)) return errorResponse(400, "sport required");
  if (!isText(body.location)) return errorResponse(400, "location required");
  if (!isText(body.startDate) || isNaN(Date.parse(body.startDate))) {
  return errorResponse(400, "A valid startDate is required");
}

  const tournament = await service.createTournament({
    name: body.name.trim(),
    sport: body.sport.trim(),
    location: body.location.trim(),
    startDate: body.startDate,
  });

  return successResponse(201, tournament);
};
exports.getById = async (event) => {
  const { tournamentId } = event.pathParameters;

  const tournament = await service.getTournamentById(tournamentId);
  if (!tournament) return errorResponse(404, "The tournament doesnt exist");

  return successResponse(200, tournament);
};

exports.list = async () => {
  const tournaments = await service.getAllTournaments();
  return successResponse(200, tournaments);
};
exports.updateStatus = async (event) => {
  const { tournamentId } = event.pathParameters;

  const body = parseBody(event);
  if (!body) return errorResponse(400, "Invalid JSON");

  if (!ALLOWED_STATUSES.includes(body.status)) {
    return errorResponse(
      400,
      `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
    );
  }

  const tournament = await service.updateTournamentStatus(
    tournamentId,
    body.status,
  );
  if (!tournament) return errorResponse(404, "Tournament not found");

  return successResponse(200, tournament);
};

exports.remove = async (event) => {
  const { tournamentId } = event.pathParameters;

  const tournament = await service.getTournamentById(tournamentId);
  if (!tournament) return errorResponse(404, "The tournament doesnt exist");

  if (await service.tournamentHasTeamsOrMatches(tournamentId)) {
    return errorResponse(
      409,
      "the tournament has teams or matches and cant be removed",
    );
  }

  await service.deleteTournament(tournamentId);
  return{statusCode: 204,
      body: "",} ;
};
