
const ALLOWED_TOURNAMENT_STATUSES = [
  "upcoming",
  "ongoing",
  "completed",
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isValidScore(value) {
  return Number.isInteger(value) && value >= 0;
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isAllowedTournamentStatus(status) {
  return ALLOWED_TOURNAMENT_STATUSES.includes(status);
}

module.exports = {
  isNonEmptyString,
  isValidDate,
  isValidScore,
  isPlainObject,
  isAllowedTournamentStatus,
};
