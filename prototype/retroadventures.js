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

function addTaskSummaryIfNotEmpty({
  output,
  userList,
  weekNumber,
  taskNumber,
  taskName,
}) {
  if (userList.length > 0)
    output.push(
      `-# **Week ${weekNumber} - Task ${taskNumber} - ${taskName} (Completed by ${userList.length} ${userList.length > 1 ? "users" : "user"} today)**: ${outputUserList(userList)}`,
    );
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

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.intoTheJungle,
    weekNumber: 1,
    taskNumber: 1,
    taskName: "Into the Jungle",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.alongTheCoast,
    weekNumber: 1,
    taskNumber: 1,
    taskName: "Along the Coast",
  });

  if (newlyCompletedUsers.length > 0) {
    output.push(
      `-# **Chapter 1 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
    );
  }

  return output.join("\n");
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

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.fightSnakeA,
    weekNumber: 2,
    taskNumber: 4,
    taskName: "Smurfs vs Snake",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.fightSnakeB,
    weekNumber: 2,
    taskNumber: 4,
    taskName: "Mega Man vs Snake Man",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.fightSnakeC,
    weekNumber: 2,
    taskNumber: 4,
    taskName: "Shanghai Snake Board",
  });

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.toTheBridge,
    weekNumber: 2,
    taskNumber: 5,
    taskName: "To the Bridge",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.toTheCave,
    weekNumber: 2,
    taskNumber: 5,
    taskName: "To the Cave",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.intoTheOcean,
    weekNumber: 2,
    taskNumber: 5,
    taskName: "Into the Ocean",
  });

  if (newlyCompletedUsers.length > 0) {
    output.push(
      `-# **Chapter 2 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
    );
  }

  return output.join("\n");
}

async function retroAdventureWeek3() {
  const userList = {
    optionalTaskA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 533812,
      startDateStr,
      endDateStr,
    }),
    optionalTaskB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535322,
      startDateStr,
      endDateStr,
    }),

    goStraightPuzzle: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535323,
      startDateStr,
      endDateStr,
    }),
    goStraightRPG: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535497,
      startDateStr,
      endDateStr,
    }),
    goStraightFighter: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535498,
      startDateStr,
      endDateStr,
    }),
    goStraightChocobo: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535499,
      startDateStr,
      endDateStr,
    }),
    goStraightMonsterTamer:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535500,
        startDateStr,
        endDateStr,
      }),
    sidePathPuzzle: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535501,
      startDateStr,
      endDateStr,
    }),
    sidePathRPG: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535502,
      startDateStr,
      endDateStr,
    }),
    sidePathFighter: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535503,
      startDateStr,
      endDateStr,
    }),
    sidePathChocobo: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535504,
      startDateStr,
      endDateStr,
    }),
    sidePathMonsterTamer: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 535505,
        startDateStr,
        endDateStr,
      },
    ),

    goStraightPuzzleTotal:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535323,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    goStraightRPGTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535497,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    goStraightFighterTotal:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535498,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    goStraightChocoboTotal:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535499,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    goStraightMonsterTamerTotal:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535500,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    sidePathPuzzleTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535501,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    sidePathRPGTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535502,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    sidePathFighterTotal: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 535503,
        startDateStr: eventStartDateStr,
        endDateStr,
      },
    ),
    sidePathChocoboTotal: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 535504,
        startDateStr: eventStartDateStr,
        endDateStr,
      },
    ),
    sidePathMonsterTamerTotal:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 535505,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530936,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const option1VotesTotal =
    userList.goStraightPuzzleTotal.length +
    userList.goStraightRPGTotal.length +
    userList.goStraightFighterTotal.length +
    userList.goStraightChocoboTotal.length +
    userList.goStraightMonsterTamerTotal.length;
  const option2VotesTotal =
    userList.sidePathPuzzleTotal.length +
    userList.sidePathRPGTotal.length +
    userList.sidePathFighterTotal.length +
    userList.sidePathChocoboTotal.length +
    userList.sidePathMonsterTamerTotal.length;
  const option1VotesPercentage = (
    (option1VotesTotal / (option1VotesTotal + option2VotesTotal)) *
    100
  ).toFixed(1);
  const option2VotesPercentage = (
    (option2VotesTotal / (option1VotesTotal + option2VotesTotal)) *
    100
  ).toFixed(1);

  function getEligibleUsers(groups) {
    const userCounts = {};
    groups.forEach((group) => {
      group.forEach((user) => {
        userCounts[user] = (userCounts[user] || 0) + 1;
      });
    });
    return Object.keys(userCounts).filter((user) => userCounts[user] >= 2);
  }

  const goStraightGroups = [
    userList.goStraightPuzzleTotal,
    userList.goStraightRPGTotal,
    userList.goStraightFighterTotal,
    userList.goStraightChocoboTotal,
    userList.goStraightMonsterTamerTotal,
  ];
  const sidePathGroups = [
    userList.sidePathPuzzleTotal,
    userList.sidePathRPGTotal,
    userList.sidePathFighterTotal,
    userList.sidePathChocoboTotal,
    userList.sidePathMonsterTamerTotal,
  ];

  const eligibleForCredit = [
    ...new Set([
      ...getEligibleUsers(goStraightGroups),
      ...getEligibleUsers(sidePathGroups),
    ]),
  ];

  const newlyCompletedUsers = eligibleForCredit.filter(
    (user) => !userList.alreadyHasCredit.includes(user),
  );

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.optionalTaskA,
    weekNumber: 3,
    taskNumber: 8,
    taskName: "Cliff Jumping",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.optionalTaskB,
    weekNumber: 3,
    taskNumber: 9,
    taskName: "FALL",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.sidePathPuzzle,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Side Path Puzzle",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.sidePathRPG,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Side Path RPG",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.sidePathFighter,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Side Path Fighter",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.sidePathChocobo,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Side Path Chocobo",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.sidePathMonsterTamer,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Side Path Monster Tamer",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.goStraightPuzzle,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Go Straight Puzzle",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.goStraightRPG,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Go Straight RPG",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.goStraightFighter,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Go Straight Fighter",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.goStraightChocobo,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Go Straight Chocobo",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.goStraightMonsterTamer,
    weekNumber: 3,
    taskNumber: 10,
    taskName: "Go Straight Monster Tamer",
  });

  output.push(
    ``,
    `**Current Vote**: Go Straight Ahead - ${option1VotesTotal} (${option1VotesPercentage}%), Take The Side Path - ${option2VotesTotal} (${option2VotesPercentage}%)`,
    ``,
    `-# **Chapter 3 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
  );

  return output.join("\n");
}

const outputs = {
  week1: await retroAdventureWeek1(),
  week2: await retroAdventureWeek2(),
  week3: await retroAdventureWeek3(),
};

console.log(
  [
    `# RetroAdventures: tRAsure Island - Summary for ${givenDateStr}`,
    outputs.week1,
    outputs.week2,
    outputs.week3,
  ].join("\n\n"),
);
