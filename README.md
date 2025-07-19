# RAConditionChecker
Automated checker for certain conditions in RetroAchievements events.

Currently automating data pulls for the Retro Adventures event.

# RetroAdventures - Prototype

The script in the prototype folder is the first version of the checker. The plan is to eventually make this more automated, but for now this script is just run manually.

### To run:

- Set the environment variables RA_API_USER and RA_API_KEY to your username and RA Web API key, respectively.
- In the `prototype` folder, run `npm i`
- Run `node retroadventures [date]` where date is of the format YYYY-MM-DD

Alternatively you can skip setting environment variables with the following:-

- `RA_API_USER=[username] RA_API_KEY=[web API key] node retroadventures [date]`

The output can then be used to manually award credit achievements and update the tracking spreadsheet.
