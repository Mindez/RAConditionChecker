import {
  buildAuthorization,
  getAchievementUnlocks,
} from "@retroachievements/api";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class AchievementUnlockFetcher {
  constructor(username, webApiKey) {
    if (!username || !webApiKey) {
      throw new Error("Both username and webApiKey must be provided");
    }
    this.authorization = buildAuthorization({ username, webApiKey });
  }

  async getUsersForAchievement({ achievementId, startDateStr, endDateStr }) {
    console.log(
      `Fetching users for achievement ${achievementId} from ${startDateStr} to ${endDateStr}`,
    );
    let allUnlocks = [];
    let offset = 0;
    const count = 500;
    let hasMore = true;
    let backoff = 250; // ms

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    while (hasMore) {
      try {
        const achievementUnlocks = await getAchievementUnlocks(
          this.authorization,
          {
            achievementId,
            count,
            offset,
          },
        );

        if (achievementUnlocks && Array.isArray(achievementUnlocks.unlocks)) {
          allUnlocks = allUnlocks.concat(achievementUnlocks.unlocks);

          if (
            achievementUnlocks.unlocks.length < count ||
            (achievementUnlocks.unlocks.length > 0 &&
              new Date(
                achievementUnlocks.unlocks[
                  achievementUnlocks.unlocks.length - 1
                ].dateAwarded,
              ) < startDate)
          ) {
            hasMore = false;
          }

          offset += count;
        } else {
          hasMore = false;
        }
      } catch (err) {
        if (err && err.response && err.response.status === 429) {
          // I've not properly tested exponential backoff because I can't reliably trigger rate limiting, TODO: test this
          console.warn(`Rate limit hit, backing off for ${backoff} ms`);
          await sleep(backoff);
          backoff = Math.min(backoff * 2, 10000);
        } else {
          throw err;
        }
      }
    }

    // Filter for hardcoreMode === true and dateAwarded within range
    const filtered = allUnlocks.filter(
      (unlock) =>
        unlock.hardcoreMode === true &&
        new Date(unlock.dateAwarded) >= startDate &&
        new Date(unlock.dateAwarded) <= endDate,
    );

    // Return array of users
    return filtered.map((unlock) => unlock.user);
  }
}
