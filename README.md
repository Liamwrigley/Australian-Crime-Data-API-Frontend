# cab230
# Current state of CAB230 assignment at QUT 2019

## TASK - front end:
Use a react frontend to fetch data from university created API.
Ability to fetch from different endpoints, sort data within columns.

### NOTEABLE:
- Locally stores auth token
- Created dynamic dropdown component to use for filtering data
- Using multiple packages for viewing data in tables and maps
### TODO: 
 - Add styling for dropdowns
 - Finish styling on main page and responsiveness
 -Add line graph to represent data in visual format.

## TASK - backend 
Create backend API using MySQL, node.js and express.
Using Knex, helmet, cors, bcrypt, jsonwebtoken
Serves on HTTPS with self signed
Serving endpoint documentation to swagger (/docs)

### NOTABLE:
 - Serves all basic endpoints for frontend
 - Ability to register users, and store hashed passwords
 - Successful login includes jwt with expiry in reponse
### TODO:
 - Finish support for /search endpoint
 - Finish auth on /search endpoint
 - Add support for comma seperated queries on /search endpoint

## NOTE - client fetch requests are currently set to CAB230 API for testing
