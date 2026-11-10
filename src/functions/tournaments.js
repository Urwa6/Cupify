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