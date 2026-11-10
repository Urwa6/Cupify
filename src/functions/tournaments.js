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

exports.create = async (event) => {
  const body = parseBody(event);
  if (!body) return errorResponse(400, "Ogiltig JSON");

  if (!isText(body.name)) return errorResponse(400, "name krävs");
  if (!isText(body.sport)) return errorResponse(400, "sport krävs");

  const tournament = await service.createTournament({
    name: body.name.trim(),
    sport: body.sport.trim(),
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
  return successResponse(200, { message: "The tournament is removed" });
};
