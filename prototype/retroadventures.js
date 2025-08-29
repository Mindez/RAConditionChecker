// Import the module from get_achievement_unlocks.js
import AchievementUnlockFetcher from "./get_achievement_unlocks.js";

if (!process.env.RA_API_USER || !process.env.RA_API_KEY) {
  console.error(
    "Error: Please provide credentials in the RA_API_USER and RA_API_KEY environment variables.",
  );
  process.exit(1);
}
if (!process.env.TASK_19_SEED) {
  console.error(
    "Error: Please provide a seed for task 19 in the TASK_19_SEED environment variable. This should be a JSON string representation of an array of 10 numbers.",
  );
}
const achievementUnlockFetcher = new AchievementUnlockFetcher(
  process.env.RA_API_USER,
  process.env.RA_API_KEY,
);

if (!process.argv[2]) {
  console.error(
    "Error: Please provide a date in the format YYYY-MM-DD. Usage: node retroadventures.js [startDate] [endDate (optional)]",
  );
  process.exit(1);
}
const givenDateStr = process.argv[2];

const eventStartDateStr = "2025-07-16T00:00:00Z";
const startDateStr = `${givenDateStr}T00:00:00Z`;
const endDateStr = `${process.argv[3] || givenDateStr}T23:59:59Z`;

const task19RandomSeeds = JSON.parse(process.env.TASK_19_SEED);

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

function getTask19RewardList({ username }) {
  let seedName = username.toUpperCase();
  if (seedName.length > 10) {
    seedName = seedName.slice(seedName.length - 10);
  }

  while (seedName.length < 10) {
    seedName = seedName.slice(0, 1) + seedName;
  }

  let seedCharCodes = seedName.split("").map((char) => char.charCodeAt(0) - 48);

  const saltedCharCodes = seedCharCodes.map(
    (code, index) => code * task19RandomSeeds[index],
  );

  const permutationNumber =
    saltedCharCodes.reduce((acc, code) => acc + code) %
    (8 * 7 * 6 * 5 * 4 * 3 * 2 * 1);

  let remaining = permutationNumber;
  const indexNW = remaining % 8;
  remaining = Math.floor(remaining / 8);
  const indexN = remaining % 7;
  remaining = Math.floor(remaining / 7);
  const indexNE = remaining % 6;
  remaining = Math.floor(remaining / 6);
  const indexE = remaining % 5;
  remaining = Math.floor(remaining / 5);
  const indexSE = remaining % 4;
  remaining = Math.floor(remaining / 4);
  const indexS = remaining % 3;
  remaining = Math.floor(remaining / 3);
  const indexSW = remaining % 2;
  remaining = Math.floor(remaining / 2);
  const indexW = remaining;

  const directionIndices = {
    nw: indexNW,
    n: indexN,
    ne: indexNE,
    e: indexE,
    se: indexSE,
    s: indexS,
    sw: indexSW,
    w: indexW,
  };

  const rewards = {
    A: "A Gap in the Wall (Entrance)",
    B: "An Underground Tunnel (Entrance)",
    C: "2 AP",
    D: "1 AP",
    E: "A Small Locked Box",
    F: "A Small Shiny Key",
    G: "A Large Gold Key",
    H: "Nothing",
  };

  const rewardIndices = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const rewardList = {
    nw: rewards[rewardIndices.splice(indexNW, 1)[0]],
    n: rewards[rewardIndices.splice(indexN, 1)[0]],
    ne: rewards[rewardIndices.splice(indexNE, 1)[0]],
    e: rewards[rewardIndices.splice(indexE, 1)[0]],
    se: rewards[rewardIndices.splice(indexSE, 1)[0]],
    s: rewards[rewardIndices.splice(indexS, 1)[0]],
    sw: rewards[rewardIndices.splice(indexSW, 1)[0]],
    w: rewards[rewardIndices.splice(indexW, 1)[0]],
  };

  return rewardList;
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
  const week3StartDateStr = "2025-07-30T00:00:00Z";
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

    solvedPuzzle: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 257210,
      startDateStr,
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

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.solvedPuzzle,
    weekNumber: 3,
    taskNumber: 12,
    taskName: "Successfully Solved the Puzzle",
  });

  output.push(
    `-# **Chapter 3 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
  );

  return output.join("\n");
}

async function retroAdventureWeek4() {
  const userList = {
    climbA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535506,
      startDateStr,
      endDateStr,
    }),
    climbB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536725,
      startDateStr,
      endDateStr,
    }),
    climbAOptional: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536729,
      startDateStr,
      endDateStr,
    }),
    climbBOptional: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536730,
      startDateStr,
      endDateStr,
    }),

    swampPath: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536727,
      startDateStr,
      endDateStr,
    }),
    mountainPath: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536726,
      startDateStr,
      endDateStr,
    }),
    darkPath: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536728,
      startDateStr,
      endDateStr,
    }),

    climbATotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 535506,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    climbBTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536725,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    climbAOptionalTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536729,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    climbBOptionalTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536730,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    swampPathTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536727,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    mountainPathTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536726,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    darkPathTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536728,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530937,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const swampPathTotal = userList.swampPathTotal.length;
  const mountainPathTotal = userList.mountainPathTotal.length;
  const darkPathTotal = userList.darkPathTotal.length;
  const swampPathVotesPercentage = (
    (swampPathTotal / (swampPathTotal + mountainPathTotal + darkPathTotal)) *
    100
  ).toFixed(1);
  const mountainPathVotesPercentage = (
    (mountainPathTotal / (swampPathTotal + mountainPathTotal + darkPathTotal)) *
    100
  ).toFixed(1);
  const darkPathVotesPercentage = (
    (darkPathTotal / (swampPathTotal + mountainPathTotal + darkPathTotal)) *
    100
  ).toFixed(1);

  const earnedTask13Today = [
    ...new Set([...userList.climbA, ...userList.climbB]),
  ];
  const earnedTask14Today = [
    ...new Set([
      ...userList.swampPath,
      ...userList.mountainPath,
      ...userList.darkPath,
    ]),
  ];
  const earnedTask13Ever = [
    ...new Set([...userList.climbATotal, ...userList.climbBTotal]),
  ];
  const earnedTask14Ever = [
    ...new Set([
      ...userList.swampPathTotal,
      ...userList.mountainPathTotal,
      ...userList.darkPathTotal,
    ]),
  ];
  const eligibleForCredit = [
    ...new Set([
      ...earnedTask13Today.filter((user) => earnedTask14Ever.includes(user)),
      ...earnedTask14Today.filter((user) => earnedTask13Ever.includes(user)),
    ]),
  ];

  const newlyCompletedUsers = eligibleForCredit.filter(
    (user) => !userList.alreadyHasCredit.includes(user),
  );

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.climbA,
    weekNumber: 4,
    taskNumber: 13,
    taskName: "Celeste Climb",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.climbB,
    weekNumber: 4,
    taskNumber: 13,
    taskName: "Jungle Climber",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.mountainPath,
    weekNumber: 4,
    taskNumber: 14,
    taskName: "Mountain Path",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.swampPath,
    weekNumber: 4,
    taskNumber: 14,
    taskName: "Swamp Path",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.darkPath,
    weekNumber: 4,
    taskNumber: 14,
    taskName: "Dark Path",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.climbAOptional,
    weekNumber: 4,
    taskNumber: 16,
    taskName: "Celeste Strawberries",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.climbBOptional,
    weekNumber: 4,
    taskNumber: 16,
    taskName: "Jungle Climber Collectibles",
  });

  output.push(
    `-# **Chapter 4 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
  );

  return output.join("\n");
}

async function retroAdventureWeek5() {
  const userList = {
    darkForestA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536731,
      startDateStr,
      endDateStr,
    }),
    darkForestB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538753,
      startDateStr,
      endDateStr,
    }),
    darkForestC: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538754,
      startDateStr,
      endDateStr,
    }),

    searchNW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538755,
      startDateStr,
      endDateStr,
    }),
    searchN: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538756,
      startDateStr,
      endDateStr,
    }),
    searchNE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538757,
      startDateStr,
      endDateStr,
    }),
    searchE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538758,
      startDateStr,
      endDateStr,
    }),
    searchSE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538759,
      startDateStr,
      endDateStr,
    }),
    searchS: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538760,
      startDateStr,
      endDateStr,
    }),
    searchSW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538761,
      startDateStr,
      endDateStr,
    }),
    searchW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538762,
      startDateStr,
      endDateStr,
    }),

    darkForestATotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 536731,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    darkForestBTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538753,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    darkForestCTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538754,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchNWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538755,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchNTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538756,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchNETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538757,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538758,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538759,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538760,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538761,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538762,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530938,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const earnedTask18Today = [
    ...new Set([
      ...userList.darkForestA,
      ...userList.darkForestB,
      ...userList.darkForestC,
    ]),
  ];

  const earnedTask18Ever = [
    ...new Set([
      ...userList.darkForestATotal,
      ...userList.darkForestBTotal,
      ...userList.darkForestCTotal,
    ]),
  ];

  const earnedTask19RewardEver = [
    ...new Set([
      ...userList.searchNWTotal,
      ...userList.searchNTotal,
      ...userList.searchNETotal,
      ...userList.searchETotal,
      ...userList.searchSETotal,
      ...userList.searchSTotal,
      ...userList.searchSWTotal,
      ...userList.searchWTotal,
    ]),
  ];

  const fullRewardList = {};
  earnedTask19RewardEver.forEach(
    (user) => (fullRewardList[user] = getTask19RewardList({ username: user })),
  );

  const earnedRewards = [
    { direction: "nw", fullName: "North West", users: userList.searchNW },
    { direction: "n", fullName: "North", users: userList.searchN },
    { direction: "ne", fullName: "North East", users: userList.searchNE },
    { direction: "e", fullName: "East", users: userList.searchE },
    { direction: "se", fullName: "South East", users: userList.searchSE },
    { direction: "s", fullName: "South", users: userList.searchS },
    { direction: "sw", fullName: "South West", users: userList.searchSW },
    { direction: "w", fullName: "West", users: userList.searchW },
  ];

  const earnedRewardsEver = [
    { direction: "nw", fullName: "North West", users: userList.searchNWTotal },
    { direction: "n", fullName: "North", users: userList.searchNTotal },
    { direction: "ne", fullName: "North East", users: userList.searchNETotal },
    { direction: "e", fullName: "East", users: userList.searchETotal },
    { direction: "se", fullName: "South East", users: userList.searchSETotal },
    { direction: "s", fullName: "South", users: userList.searchSTotal },
    { direction: "sw", fullName: "South West", users: userList.searchSWTotal },
    { direction: "w", fullName: "West", users: userList.searchWTotal },
  ];

  const rewardDataToday = [];
  earnedRewards.forEach((direction) => {
    direction.users.sort().forEach((user) => {
      rewardDataToday.push({
        user: user,
        direction: direction.direction,
        fullDirectionName: direction.fullName,
        reward: fullRewardList[user][direction.direction],
      });
    });
  });

  const rewardDataAllTime = [];
  earnedRewardsEver.forEach((direction) => {
    direction.users.sort().forEach((user) => {
      rewardDataAllTime.push({
        user: user,
        direction: direction.direction,
        fullDirectionName: direction.fullName,
        reward: fullRewardList[user][direction.direction],
      });
    });
  });

  rewardDataToday.sort((a, b) => {
    const userA = a.user.toLowerCase();
    const userB = b.user.toLowerCase();
    if (userA < userB) return -1;
    if (userA > userB) return 1;
    return 0;
  });

  const rewardSummary = [];
  rewardDataToday.forEach((data) => {
    rewardSummary.push(
      `[user=${data.user}] searched the [b]${data.fullDirectionName}[/b] side of the temple and got [b]${data.reward}[/b]`,
    );
  });

  console.log(`=== TASK 19 REWARD SUMMARY ===`);
  console.log(rewardSummary.join("\n"));

  const entranceAUsersToday = rewardDataToday
    .filter((data) => data.reward === "A Gap in the Wall (Entrance)")
    .map((data) => data.user);
  const entranceBUsersToday = rewardDataToday
    .filter((data) => data.reward === "An Underground Tunnel (Entrance)")
    .map((data) => data.user);
  const entranceAUsersAllTime = rewardDataAllTime
    .filter((data) => data.reward === "A Gap in the Wall (Entrance)")
    .map((data) => data.user);
  const entranceBUsersAllTime = rewardDataAllTime
    .filter((data) => data.reward === "An Underground Tunnel (Entrance)")
    .map((data) => data.user);

  const entranceAVotesTotal = entranceAUsersAllTime.length;
  const entranceBVotesTotal = entranceBUsersAllTime.length;
  const entranceAVotesPercentage = (
    (entranceAVotesTotal / (entranceAVotesTotal + entranceBVotesTotal)) *
    100
  ).toFixed(1);
  const entranceBVotesPercentage = (
    (entranceBVotesTotal / (entranceAVotesTotal + entranceBVotesTotal)) *
    100
  ).toFixed(1);

  const earnedTask19Today = [
    ...new Set([...entranceAUsersToday, ...entranceBUsersToday]),
  ];

  const earnedTask19Ever = [
    ...new Set([...entranceAUsersAllTime, ...entranceBUsersAllTime]),
  ];

  const newlyCompletedUsers = [
    ...new Set([
      ...earnedTask18Today.filter((user) => earnedTask19Ever.includes(user)),
      ...earnedTask19Today.filter((user) => earnedTask18Ever.includes(user)),
    ]),
  ].filter((user) => !userList.alreadyHasCredit.includes(user));

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.darkForestA,
    weekNumber: 5,
    taskNumber: 18,
    taskName: "Berenstain Bears Dark Forest",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.darkForestB,
    weekNumber: 5,
    taskNumber: 18,
    taskName: "Tengai Makyou Zero Dark Forest",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.darkForestC,
    weekNumber: 5,
    taskNumber: 18,
    taskName: "Actraiser Dark Forest",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "A Gap in the Wall (Entrance)")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "A Gap in the Wall (Entrance)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "An Underground Tunnel (Entrance)")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "An Underground Tunnel (Entrance)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "2 AP")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "2 AP",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "1 AP")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "1 AP",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "A Small Locked Box")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "A Small Locked Box",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "A Small Shiny Key")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "A Small Shiny Key",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "A Large Gold Key")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "A Large Gold Key",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: rewardDataToday
      .filter((data) => data.reward === "Nothing")
      .map((data) => data.user),
    weekNumber: 5,
    taskNumber: 19,
    taskName: "Nothing",
  });

  output.push(
    `-# **Chapter 5 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
  );

  return output.join("\n");
}

async function retroAdventureWeek6() {
  const userList = {
    searchNW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538755,
      startDateStr,
      endDateStr,
    }),
    searchN: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538756,
      startDateStr,
      endDateStr,
    }),
    searchNE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538757,
      startDateStr,
      endDateStr,
    }),
    searchE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538758,
      startDateStr,
      endDateStr,
    }),
    searchSE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538759,
      startDateStr,
      endDateStr,
    }),
    searchS: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538760,
      startDateStr,
      endDateStr,
    }),
    searchSW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538761,
      startDateStr,
      endDateStr,
    }),
    searchW: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538762,
      startDateStr,
      endDateStr,
    }),
    searchNWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538755,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchNTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538756,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchNETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538757,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538758,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSETotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538759,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538760,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchSWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538761,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    searchWTotal: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538762,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    earnedGapInWallA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 538763,
      startDateStr,
      endDateStr,
    }),
    earnedGapInWallB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539801,
      startDateStr,
      endDateStr,
    }),
    earnedUndergroundTunnelA:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 539802,
        startDateStr,
        endDateStr,
      }),
    earnedUndergroundTunnelB:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 539803,
        startDateStr,
        endDateStr,
      }),
    earnedGapInWallAEver: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 538763,
        startDateStr: eventStartDateStr,
        endDateStr,
      },
    ),
    earnedGapInWallBEver: await achievementUnlockFetcher.getUsersForAchievement(
      {
        achievementId: 539801,
        startDateStr: eventStartDateStr,
        endDateStr,
      },
    ),
    earnedUndergroundTunnelAEver:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 539802,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    earnedUndergroundTunnelBEver:
      await achievementUnlockFetcher.getUsersForAchievement({
        achievementId: 539803,
        startDateStr: eventStartDateStr,
        endDateStr,
      }),
    earned1tpA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539804,
      startDateStr,
      endDateStr,
    }),
    earned1tpB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539805,
      startDateStr,
      endDateStr,
    }),
    earned1tpC: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539806,
      startDateStr,
      endDateStr,
    }),
    earned1tpD: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539807,
      startDateStr,
      endDateStr,
    }),
    earned1tpE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539808,
      startDateStr,
      endDateStr,
    }),
    earned1tpF: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539809,
      startDateStr,
      endDateStr,
    }),
    earned1tpG: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539810,
      startDateStr,
      endDateStr,
    }),
    earned1tpH: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539811,
      startDateStr,
      endDateStr,
    }),
    earned1tpAEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539804,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpBEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539805,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpCEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539806,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpDEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539807,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpEEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539808,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpFEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539809,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpGEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539810,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned1tpHEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539811,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539812,
      startDateStr,
      endDateStr,
    }),
    earned2tpB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539813,
      startDateStr,
      endDateStr,
    }),
    earned2tpC: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539814,
      startDateStr,
      endDateStr,
    }),
    earned2tpD: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539815,
      startDateStr,
      endDateStr,
    }),
    earned2tpE: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539816,
      startDateStr,
      endDateStr,
    }),
    earned2tpF: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539817,
      startDateStr,
      endDateStr,
    }),
    earned2tpAEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539812,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpBEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539813,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpCEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539814,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpDEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539815,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpEEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539816,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
    earned2tpFEver: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539817,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),

    earnedRubyA: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539818,
      startDateStr,
      endDateStr,
    }),
    earnedRubyB: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539819,
      startDateStr,
      endDateStr,
    }),
    earnedRubyC: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539820,
      startDateStr,
      endDateStr,
    }),
    earnedRubyD: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 539821,
      startDateStr,
      endDateStr,
    }),

    alreadyHasCredit: await achievementUnlockFetcher.getUsersForAchievement({
      achievementId: 530939,
      startDateStr: eventStartDateStr,
      endDateStr,
    }),
  };

  const earnedTask19RewardEver = [
    ...new Set([
      ...userList.searchNWTotal,
      ...userList.searchNTotal,
      ...userList.searchNETotal,
      ...userList.searchETotal,
      ...userList.searchSETotal,
      ...userList.searchSTotal,
      ...userList.searchSWTotal,
      ...userList.searchWTotal,
    ]),
  ];

  const fullRewardList = {};
  earnedTask19RewardEver.forEach(
    (user) => (fullRewardList[user] = getTask19RewardList({ username: user })),
  );

  const earnedRewards = [
    { direction: "nw", fullName: "North West", users: userList.searchNW },
    { direction: "n", fullName: "North", users: userList.searchN },
    { direction: "ne", fullName: "North East", users: userList.searchNE },
    { direction: "e", fullName: "East", users: userList.searchE },
    { direction: "se", fullName: "South East", users: userList.searchSE },
    { direction: "s", fullName: "South", users: userList.searchS },
    { direction: "sw", fullName: "South West", users: userList.searchSW },
    { direction: "w", fullName: "West", users: userList.searchW },
  ];

  const earnedRewardsEver = [
    { direction: "nw", fullName: "North West", users: userList.searchNWTotal },
    { direction: "n", fullName: "North", users: userList.searchNTotal },
    { direction: "ne", fullName: "North East", users: userList.searchNETotal },
    { direction: "e", fullName: "East", users: userList.searchETotal },
    { direction: "se", fullName: "South East", users: userList.searchSETotal },
    { direction: "s", fullName: "South", users: userList.searchSTotal },
    { direction: "sw", fullName: "South West", users: userList.searchSWTotal },
    { direction: "w", fullName: "West", users: userList.searchWTotal },
  ];

  const rewardDataToday = [];
  earnedRewards.forEach((direction) => {
    direction.users.sort().forEach((user) => {
      rewardDataToday.push({
        user: user,
        direction: direction.direction,
        fullDirectionName: direction.fullName,
        reward: fullRewardList[user][direction.direction],
      });
    });
  });

  const rewardDataAllTime = [];
  earnedRewardsEver.forEach((direction) => {
    direction.users.sort().forEach((user) => {
      rewardDataAllTime.push({
        user: user,
        direction: direction.direction,
        fullDirectionName: direction.fullName,
        reward: fullRewardList[user][direction.direction],
      });
    });
  });

  rewardDataToday.sort((a, b) => {
    const userA = a.user.toLowerCase();
    const userB = b.user.toLowerCase();
    if (userA < userB) return -1;
    if (userA > userB) return 1;
    return 0;
  });

  const foundEntranceAToday = rewardDataToday
    .filter((data) => data.reward === "A Gap in the Wall (Entrance)")
    .map((data) => data.user);

  const foundEntranceBToday = rewardDataToday
    .filter((data) => data.reward === "An Underground Tunnel (Entrance)")
    .map((data) => data.user);

  const foundBigKeyEver = rewardDataAllTime
    .filter((data) => data.reward === "A Large Gold Key")
    .map((data) => data.user);

  const foundEntranceAEver = rewardDataAllTime
    .filter((data) => data.reward === "A Gap in the Wall (Entrance)")
    .map((data) => data.user);

  const foundEntranceBEver = rewardDataAllTime
    .filter((data) => data.reward === "An Underground Tunnel (Entrance)")
    .map((data) => data.user);

  const completedTask21Today = [
    ...new Set([
      ...foundEntranceAToday.filter((user) =>
        userList.earnedGapInWallAEver.includes(user),
      ),
      ...foundEntranceAToday.filter((user) =>
        userList.earnedGapInWallBEver.includes(user),
      ),
      ...foundEntranceBToday.filter((user) =>
        userList.earnedUndergroundTunnelAEver.includes(user),
      ),
      ...foundEntranceBToday.filter((user) =>
        userList.earnedUndergroundTunnelBEver.includes(user),
      ),
      ...userList.earnedGapInWallA.filter((user) =>
        foundEntranceAEver.includes(user),
      ),
      ...userList.earnedGapInWallB.filter((user) =>
        foundEntranceAEver.includes(user),
      ),
      ...userList.earnedUndergroundTunnelA.filter((user) =>
        foundEntranceBEver.includes(user),
      ),
      ...userList.earnedUndergroundTunnelB.filter((user) =>
        foundEntranceBEver.includes(user),
      ),
    ]),
  ];

  const completedTask21Ever = [
    ...new Set([
      ...foundEntranceAEver.filter((user) =>
        userList.earnedGapInWallAEver.includes(user),
      ),
      ...foundEntranceAEver.filter((user) =>
        userList.earnedGapInWallBEver.includes(user),
      ),
      ...foundEntranceBEver.filter((user) =>
        userList.earnedUndergroundTunnelAEver.includes(user),
      ),
      ...foundEntranceBEver.filter((user) =>
        userList.earnedUndergroundTunnelBEver.includes(user),
      ),
    ]),
  ];

  const earnedAnyTpToday = [
    ...new Set([
      ...userList.earned1tpA,
      ...userList.earned1tpB,
      ...userList.earned1tpC,
      ...userList.earned1tpD,
      ...userList.earned1tpE,
      ...userList.earned1tpF,
      ...userList.earned1tpG,
      ...userList.earned1tpH,
      ...userList.earned2tpA,
      ...userList.earned2tpB,
      ...userList.earned2tpC,
      ...userList.earned2tpD,
      ...userList.earned2tpE,
      ...userList.earned2tpF,
    ]),
  ];

  const earnedAnyTpEver = [
    ...new Set([
      ...userList.earned1tpAEver,
      ...userList.earned1tpBEver,
      ...userList.earned1tpCEver,
      ...userList.earned1tpDEver,
      ...userList.earned1tpEEver,
      ...userList.earned1tpFEver,
      ...userList.earned1tpGEver,
      ...userList.earned1tpHEver,
      ...userList.earned2tpAEver,
      ...userList.earned2tpBEver,
      ...userList.earned2tpCEver,
      ...userList.earned2tpDEver,
      ...userList.earned2tpEEver,
      ...userList.earned2tpFEver,
    ]),
  ];

  const totalTp = {};
  for (const user of earnedAnyTpEver) {
    [
      { list: userList.earned1tpAEver, tp: 1 },
      { list: userList.earned1tpBEver, tp: 1 },
      { list: userList.earned1tpCEver, tp: 1 },
      { list: userList.earned1tpDEver, tp: 1 },
      { list: userList.earned1tpEEver, tp: 1 },
      { list: userList.earned1tpFEver, tp: 1 },
      { list: userList.earned1tpGEver, tp: 1 },
      { list: userList.earned1tpHEver, tp: 1 },
      { list: userList.earned2tpAEver, tp: 2 },
      { list: userList.earned2tpBEver, tp: 2 },
      { list: userList.earned2tpCEver, tp: 2 },
      { list: userList.earned2tpDEver, tp: 2 },
      { list: userList.earned2tpEEver, tp: 2 },
      { list: userList.earned2tpFEver, tp: 2 },
      { list: foundBigKeyEver, tp: 3 },
    ].forEach(({ list, tp }) => {
      if (list.includes(user)) {
        totalTp[user] = (totalTp[user] || 0) + tp;
      }
    });
  }

  const completedTask22Ever = Object.keys(totalTp).filter(
    (user) => totalTp[user] >= 12,
  );

  const completedTask22Today = completedTask22Ever.filter((user) =>
    earnedAnyTpToday.includes(user),
  );

  const newlyCompletedUsers = [
    ...new Set([
      ...completedTask21Today.filter((user) =>
        completedTask22Ever.includes(user),
      ),
      ...completedTask22Today.filter((user) =>
        completedTask21Ever.includes(user),
      ),
    ]),
  ].filter((user) => !userList.alreadyHasCredit.includes(user));

  console.log(newlyCompletedUsers);

  const output = [];

  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedGapInWallA,
    weekNumber: 6,
    taskNumber: 21,
    taskName: "Wall Entrance (Tom & Jerry)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedGapInWallB,
    weekNumber: 6,
    taskNumber: 21,
    taskName: "Wall Entrance (Rugrats)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedUndergroundTunnelA,
    weekNumber: 6,
    taskNumber: 21,
    taskName: "Tunnel Entrance (Addams Family)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedUndergroundTunnelB,
    weekNumber: 6,
    taskNumber: 21,
    taskName: "Tunnel Entrance (Bug's Life)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpA,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Maze of Galious)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpB,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Tobal 2)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpC,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Cleopatra Fortune)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpD,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Kapt'n Blaubar)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpE,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (A-Mazing Tater)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpF,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Shining in the Darkness)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpG,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Pyramid of Ra)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned1tpH,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "1TP (Dark and Under)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpA,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (Maze of Galious)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpB,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (Tobal 2)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpC,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (Cleopatra Fortune)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpD,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (Kapt'n Blaubar)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpE,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (A-Mazing Tater)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earned2tpF,
    weekNumber: 6,
    taskNumber: 22,
    taskName: "2TP (Shining in the Darkness)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedRubyA,
    weekNumber: 6,
    taskNumber: 24,
    taskName: "Ruby (Young Merlin)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedRubyB,
    weekNumber: 6,
    taskNumber: 24,
    taskName: "Ruby (Mortal Kombat",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedRubyC,
    weekNumber: 6,
    taskNumber: 24,
    taskName: "Ruby (Zipball)",
  });
  addTaskSummaryIfNotEmpty({
    output,
    userList: userList.earnedRubyD,
    weekNumber: 6,
    taskNumber: 24,
    taskName: "Ruby (Aladdin)",
  });

  output.push(
    `-# **Chapter 6 Completion awarded to ${newlyCompletedUsers.length} ${newlyCompletedUsers.length > 1 ? "players" : "player"}**: ${outputUserList(newlyCompletedUsers)}`,
  );

  return output.join("\n");
}

const outputs = [
  await retroAdventureWeek1(),
  await retroAdventureWeek2(),
  await retroAdventureWeek3(),
  await retroAdventureWeek4(),
  await retroAdventureWeek5(),
  await retroAdventureWeek6(),
];

console.log(
  [
    process.argv[3]
      ? `# RetroAdventures: tRAsure Island - Summary for ${givenDateStr} to ${process.argv[3]}`
      : `# RetroAdventures: tRAsure Island - Summary for ${givenDateStr}`,
    ...outputs,
  ].join("\n\n"),
);
