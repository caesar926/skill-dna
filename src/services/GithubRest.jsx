export async function fetchGithubUser(userName, signal) {
  const response = await fetch(`https://api.github.com/users/${userName}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('User not found');
  }

  return response.json();
}

export async function fetchGithubRepos(userName) {
  const response = await fetch(
    `https://api.github.com/users/${userName}/repos?per_page=100`
  );
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}