export function calculateScore(profile) {
  const commits = profile.total_commits ?? 0;
  const prs = profile.total_prs ?? 0;
  const followers = profile.data?.followers?.totalCount ?? 0;
  const stars = profile.total_stars ?? 0;
  const weeks = profile.data?.contributionsCollection?.contributionCalendar?.weeks ?? [];
  const forks = profile.data?.totalForks ?? 0
  const description = profile.data?.describedRepoCount ?? 0
  const totalCount = profile.data?.repositories?.totalCount ?? 0
  const languages = profile.data?.totalLanguages ?? []
  const distinctLanguageCount = languages.length

  const activeDays = countActiveDays(weeks);

  const commitScore = logScore(commits, 2000);
  const prScore = logScore(prs, 100);
  const activeDayScore = linearScore(activeDays, 300);
  
  const prsByRepo = profile.data?.contributionsCollection?.pullRequestContributionsByRepository ?? [];

const externalPRs = prsByRepo
  .filter(entry => entry.repository.owner.login !== profile.github_username)
  .reduce((sum, entry) => sum + entry.contributions.totalCount, 0);
  
  

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

  const forkScore = logScore(forks, 100)
  const descriptionRatio = totalCount > 0 ? description / totalCount : 0;
  const descriptionScore = linearScore(descriptionRatio * 100, 100);


    const projectQualityScore = 
    (forkScore * 0.40) + 
    (descriptionScore * 0.60);

  const openSourceScore = logScore(externalPRs, 40);

  const finalScore = (activityScore * 0.25) + (impactScore * 0.15) + ( breadthScore * 0.20) + (projectQualityScore * 0.25) + (openSourceScore * 0.15);
  return {
    finalScore,
    activityScore,
    impactScore,
    breadthScore,
    projectQualityScore,
    openSourceScore,
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