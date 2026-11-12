# Cupify

REST API for managing sports tournaments, teams and matches.

## AWS Deployment and API Testing

### AWS Infrastructure

The Cupify REST API has been deployed to AWS using the Serverless Framework.

- **Cloud provider:** AWS
- **Region:** `eu-north-1` (Europe – Stockholm)
- **Runtime:** Node.js 24.x
- **Framework:** Serverless Framework
- **Database:** Amazon DynamoDB
- **API:** Amazon API Gateway
- **Compute:** AWS Lambda

### Deployed API

**Base URL:**

https://uik1ta5uml.execute-api.eu-north-1.amazonaws.com

### DynamoDB Tables

The deployment created the following tables:

- `cupify-dev-Tournaments`
- `cupify-dev-Teams`
- `cupify-dev-Matches`

### API Testing

The deployed API has been tested using `curl` commands in the terminal.

The following tests have been performed successfully:

| Test | Expected behaviour | Result |
|---|---|---|
| Create tournament | Creates a tournament and generates an ID | Passed – HTTP 201 |
| Retrieve tournaments | Returns stored tournaments | Passed – HTTP 200 |
| Update tournament status | Updates the tournament status | Passed – HTTP 200 |
| Create team | Creates a team within a tournament | Passed – HTTP 201 |
| Retrieve teams | Returns teams belonging to a tournament | Passed – HTTP 200 |
| Retrieve individual team | Returns the requested team | Passed – HTTP 200 |
| Update team | Updates team information | Passed – HTTP 200 |
| Delete team | Removes a team not referenced by a match | Passed – HTTP 204 |
| Create match | Creates a match with scheduled status | Passed – HTTP 201 |
| Retrieve matches | Returns matches belonging to a tournament | Passed – HTTP 200 |
| Retrieve individual match | Returns the requested match | Passed – HTTP 200 |
| Update scheduled match | Updates scheduled match information | Passed – HTTP 200 |
| Register match result | Saves scores and changes status to completed | Passed – HTTP 200 |
| Register result again | Rejects a second result registration | Passed – HTTP 409 |
| Update completed match | Rejects updates to completed matches | Passed – HTTP 409 |
| Delete match | Deletes the requested match | Passed – HTTP 204 |
| Delete team participating in a match | Prevents deletion of a team referenced by a match | Passed – HTTP 409 |
| Delete tournament containing teams or matches | Prevents deletion of a tournament containing teams or matches | Passed – HTTP 409 |
| Delete tournament without teams or matches | Deletes the tournament | Passed – HTTP 204 |
| Retrieve deleted match | Returns an error for a deleted match | Passed – HTTP 404 |
| Retrieve non-existent team | Returns an error when the team does not exist | Passed – HTTP 404 |
| Retrieve non-existent match | Returns an error when the match does not exist | Passed – HTTP 404 |
| Create match with same team | Rejects a match where a team plays against itself | Passed – HTTP 400 |
| Create match with team from another tournament | Rejects a team that does not belong to the tournament | Passed – HTTP 404 |
| Create match with non-existent team | Rejects a team that does not exist in the tournament | Passed – HTTP 404 |
| Register negative or decimal scores | Rejects invalid scores | Passed – HTTP 400 |
| Create tournament with missing required field | Rejects invalid input | Passed – HTTP 400 |

### Business Rules Verified

The following business rules have been tested against the deployed API:

- A match result can only be registered once.
- Completed matches cannot be updated.
- Teams participating in matches cannot be deleted.
- Tournaments containing teams or matches cannot be deleted.
- A team cannot play against itself.
- Both teams in a match must belong to the same tournament.
- Match scores must be non-negative integers.

### Testing Tools

- `curl` – Used to send HTTP requests and test API endpoints.
- AWS Management Console – Used to inspect deployed AWS resources.
- Serverless Framework – Used to deploy the application.