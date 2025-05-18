### Title of your project
- HoopData

### Description 
- HoopData is a dynamic web application that allows basketball fans to view NBA player and team information in a simple interface.

1. Home Page
- features an image slider and introduces our voice navigation
2. Players Page
- displaying selected nba player information
3. Teams Page
- displaying nba team names and information
4. About Page
- provides instructions on how to use web application and its purpose

## Target Browsers
- Chrome, Firefox, Safari, Edge, Mobile Browsers
- these different platforms should have mic permissions on in order for voice navigation to work

## Developer Manual Link
[Developer Manual](./docs/README.md)

### Developer Manual

## Requirements
- Node.js v18+
- npm v9+
- supabase account
- balldontlie API (personal key required through the creation of account)

## Set Up Instructions
1. Clone the Repository to install application
- git clone https://github.com/michaelgirma/Final_Project_INST377.git
- cd Final_Project_INST377
2. Install dependencies
- npm init -y (is you dont have package.json file)
- npm install dotenv supabase-js

## Run your application on a server
- run (vercel dev) in your terminal
- copy local host link and paste on any platform

## Tests
- No tests have been written for this version of the application
- All functionality was manually tests through browser and API endpoints

## API
1. GET /api/players
- retrieves all players records from the supabase players table
2. POST /api/players/import
- imports player data from the balldontlie API and puts it into the supabase players table
3. GET /api/teams
- retrieves all teams records from the supabase teams table
4. POST /api/teams/import
- imports team data from the balldontlie API and inserts it into the supabase teams table

## Known Bugs
- Voice navigation may not work on unsupported browsers
- Some data may return "null", "N/A", or "_" due to missing data in the database

## Future RoadMap
- find solution to allow all player data from api to be uploaded to database
- implement search feature for easier navigation of team/player information
- add game statistics and schedules
