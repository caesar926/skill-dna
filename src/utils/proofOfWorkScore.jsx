export function calculateScore(profile) {
  const commits = profile.total_commits ?? 0;
  const prs = profile.total_prs ?? 0;
  const followers = profile.data?.followers?.totalCount ?? 0;
  const stars = profile.total_stars ?? 0;
  const weeks = profile.data?.contributionsCollection?.contributionCalendar?.weeks ?? [];

  const activeDays = countActiveDays(weeks);

  const commitScore = logScore(commits, 2000);
  const prScore = logScore(prs, 100);
  const activeDayScore = linearScore(activeDays, 300);
  const languages = profile.data?.totalLanguages ?? []
  const distinctLanguageCount = languages.length
  
  const activityScore =
    (commitScore * 0.35) +
    (prScore * 0.25) +
    (activeDayScore * 0.40);

  const followerScore = logScore(followers, 100);
  const starScore = logScore(stars, 200);

  const impactScore =
    (followerScore * 0.70) +
    (starScore * 0.30);
  
   const breadthScore = linearScore(distinctLanguageCount, 8)

  const finalScore = (activityScore * 0.5) + (impactScore * 0.5);
  return {
    finalScore,
    activityScore,
    impactScore,
    breadthScore,
  };
}

function countActiveDays(weeks) {
  const allDays = weeks.flatMap(week => week.contributionDays)

  const activeDays = allDays.filter(day => day.contributionCount > 0)

  const activeDayCount = activeDays.length
  return activeDayCount
}

function logScore(value, benchmark) {
  return Math.min(100, (Math.log(1 + value) / Math.log(1 + benchmark)) * 100);
}

function linearScore(value, benchmark) {
  return Math.min(100, (value / benchmark) * 100);
}