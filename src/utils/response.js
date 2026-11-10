
const successResponse = (statusCode, data) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
};

const errorResponse = (statusCode, message) => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: message,
    }),
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
