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

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530934,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const earnedEitherSet = [
    ...new Set([...userList.intoTheJungle, ...userList.alongTheCoast]),
  ];
  const newlyCompletedUsers = earnedEitherSet.filter(
    (user) => !userList.alreadyHasCredit.includes(user),
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
    `${earnedEitherSet.length} users completed Task 1 today:`,
    `-# Into the Jungle: ${userList.intoTheJungle.length} users - ${outputUserList(userList.intoTheJungle)}`,
    `-# Along the Coast: ${userList.alongTheCoast.length} users - ${outputUserList(userList.alongTheCoast)}`,
    ``,
    `Chapter 1 Completion awarded to ${newlyCompletedUsers.length} players:`,
    `-# ${outputUserList(newlyCompletedUsers)}`,
  ].join("\n");
}

async function retroAdventureWeek2() {
  const userList = {
    fightSnakeA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532501,
      startDateStr,
      endDateStr,
    }),
    fightSnakeB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532503,
      startDateStr,
      endDateStr,
    }),
    fightSnakeC: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532505,
      startDateStr,
      endDateStr,
    }),

    toTheBridge: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533809,
      startDateStr,
      endDateStr,
    }),
    toTheCave: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533810,
      startDateStr,
      endDateStr,
    }),
    intoTheOcean: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533811,
      startDateStr,
      endDateStr,
    }),

    fightSnakeATotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532501,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    fightSnakeBTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532503,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    fightSnakeCTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 532505,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    toTheBridgeTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533809,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    toTheCaveTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533810,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    intoTheOceanTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533811,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530935,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const earnedTask4Today = [
    ...new Set([
      ...userList.fightSnakeA,
      ...userList.fightSnakeB,
      ...userList.fightSnakeC,
    ]),
  ];
  const earnedTask5Today = [
    ...new Set([
      ...userList.toTheBridge,
      ...userList.toTheCave,
      ...userList.intoTheOcean,
    ]),
  ];
  const earnedTask4Ever = [
    ...new Set([
      ...userList.fightSnakeATotal,
      ...userList.fightSnakeBTotal,
      ...userList.fightSnakeCTotal,
    ]),
  ];
  const earnedTask5Ever = [
    ...new Set([
      ...userList.toTheBridgeTotal,
      ...userList.toTheCaveTotal,
      ...userList.intoTheOceanTotal,
    ]),
  ];
  const eligibleForCredit = [
    ...new Set([
      ...earnedTask4Today.filter((user) => earnedTask5Ever.includes(user)),
      ...earnedTask5Today.filter((user) => earnedTask4Ever.includes(user)),
    ]),
  ];
  const newlyCompletedUsers = eligibleForCredit.filter(
    (user) => !userList.alreadyHasCredit.includes(user),
  );
  const option1VotesTotal = userList.toTheBridgeTotal.length;
  const option2VotesTotal = userList.toTheCaveTotal.length;
  const option3VotesTotal = userList.intoTheOceanTotal.length;
  const option1VotesPercentage = (
    (option1VotesTotal /
      (option1VotesTotal + option2VotesTotal + option3VotesTotal)) *
    100
  ).toFixed(1);
  const option2VotesPercentage = (
    (option2VotesTotal /
      (option1VotesTotal + option2VotesTotal + option3VotesTotal)) *
    100
  ).toFixed(1);
  const option3VotesPercentage = (
    (option3VotesTotal /
      (option1VotesTotal + option2VotesTotal + option3VotesTotal)) *
    100
  ).toFixed(1);

  return [
    `**Week 2**`,
    `${earnedTask4Today.length} users completed Task 4 today:`,
    `- -# Smurfs vs Snake: ${userList.fightSnakeA.length} users - ${outputUserList(userList.fightSnakeA)}`,
    `- -# Mega Man vs Snake Man: ${userList.fightSnakeB.length} users - ${outputUserList(userList.fightSnakeB)}`,
    `- -# Shanghai Snake Board: ${userList.fightSnakeC.length} users - ${outputUserList(userList.fightSnakeC)}`,
    ``,
    `${earnedTask5Today.length} users completed Task 5 today:`,
    `- To the Bridge - ${userList.toTheBridge.length} users today`,
    `-# ${outputUserList(userList.toTheBridge)}`,
    `- To the Cave - ${userList.toTheCave.length} users today`,
    `-# ${outputUserList(userList.toTheCave)}`,
    `- Into the Ocean - ${userList.intoTheOcean.length} users today`,
    `-# ${outputUserList(userList.intoTheOcean)}`,
    ``,
    `Chapter 2 Completion awarded to ${newlyCompletedUsers.length} players:`,
    `-# ${outputUserList(newlyCompletedUsers)}`,
    ``,
    `**Current Vote**: To the Bridge - ${option1VotesTotal} (${option1VotesPercentage}%), To the Cave - ${option2VotesTotal} (${option2VotesPercentage}%), Into the Ocean - ${option3VotesTotal} (${option3VotesPercentage}%)`,
  ].join("\n");
}

const outputs = {
  week1: await retroAdventureWeek1(),
  week2: await retroAdventureWeek2(),
};

console.log(
  [
    `# RetroAdventures: tRAsure Island - Summary for ${givenDateStr}`,
    outputs.week1,
    outputs.week2,
  ].join("\n\n"),
);
