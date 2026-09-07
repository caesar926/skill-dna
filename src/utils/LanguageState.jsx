 export function tallyLanguages(repoList) {
    if (!Array.isArray(repoList)) return {};
    return repoList.reduce((counts, repo) => {
      const lang = repo.language;
      if (!lang) return counts;
      counts[lang] = (counts[lang] || 0) + 1;
      return counts;
    }, {});
  }