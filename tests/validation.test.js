
const validation = require("../src/utils/validation");

console.log("Test 1:", validation.isNonEmptyString("Cupify"));
console.log("Test 2:", validation.isNonEmptyString(""));
console.log("Test 3:", validation.isValidScore(3));
console.log("Test 4:", validation.isValidScore(-1));
console.log("Test 5:", validation.isAllowedTournamentStatus("ongoing"));
console.log("Test 6:", validation.isAllowedTournamentStatus("invalid"));
