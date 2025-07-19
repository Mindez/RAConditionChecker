// Import the module from get_achievement_unlocks.js
import AchievementUnlockFetcher from "./get_achievement_unlocks.js";

if (!process.env.RA_API_USER || !process.env.RA_API_KEY) {
  console.error(
    "Error: Please provide credentials in the RA_API_USER and RA_API_KEY environment variables.",
  );
  process.exit(1);
}
const achievementUnlockFetcher = new AchievementUnlockFetcher(
  process.env.RA_API_USER,
  process.env.RA_API_KEY,
);

if (!process.argv[2]) {
  console.error(
    "Error: Please provide a date in the format YYYY-MM-DD. Usage: node retroadventures.js [date]",
  );
  process.exit(1);
}
const givenDateStr = process.argv[2];

const eventStartDateStr = "2025-07-16T00:00:00Z";
const startDateStr = `${givenDateStr}T00:00:00Z`;
const endDateStr = `${givenDateStr}T23:59:59Z`;

function outputUserList(userList) {
  return userList.sort().join(",");
}

async function retroAdventureWeek1() {
  const userList = {
    intoTheJungle: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532499,
      startDateStr,
      endDateStr,
    }),
    alongTheCoast: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532500,
      startDateStr,
      endDateStr,
    }),

    intoTheJungleTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532499,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    alongTheCoastTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532500,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    alreadyAwardedCredit: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 530934,
        startDateStr: eventStartDateStr,
        endDateStr,
      },
    ),
  };

  const earnedEitherSet = [
    ...new Set([...userList.intoTheJungle, ...userList.alongTheCoast]),
  ];
  const newlyCompletedUsers = earnedEitherSet.filter(
    (user) => !userList.alreadyAwardedCredit.includes(user),
  );
  const option1VotesTotal = userList.intoTheJungleTotal.length;
  const option2VotesTotal = userList.alongTheCoastTotal.length;
  const option1VotesPercentage = (
    (option1VotesTotal / (option1VotesTotal + option2VotesTotal)) *
    100
  ).toFixed(1);
  const option2VotesPercentage = (
    (option2VotesTotal / (option1VotesTotal + option2VotesTotal)) *
    100
  ).toFixed(1);

  return [
    `**Week 1**`,
    `- Into the Jungle - ${userList.intoTheJungle.length} users today`,
    `-# ${outputUserList(userList.intoTheJungle)}`,
    `- Along the Coast - ${userList.alongTheCoast.length} users today`,
    `-# ${outputUserList(userList.alongTheCoast)}`,
    ``,
    `Chapter 1 Completion awarded to ${newlyCompletedUsers.length} players:`,
    `-# ${outputUserList(newlyCompletedUsers)}`,
    ``,
    `**Current Vote**: Into the Jungle - ${option1VotesTotal} (${option1VotesPercentage}%), Along the Coast - ${option2VotesTotal} (${option2VotesPercentage}%)`,
  ].join("\n");
}

const outputs = {
  week1: await retroAdventureWeek1(),
};

console.log(
  [
    `# RetroAdventures: tRAsure Island - Summary for ${givenDateStr}`,
    ``,
    outputs.week1,
  ].join("\n"),
);
