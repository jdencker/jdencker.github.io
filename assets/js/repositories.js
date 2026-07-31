import { caseStudiesForRepo } from "./case-studies.js";

const GITHUB_USER = "jdencker";
const REPOS_PER_PAGE = 100;
const repoList = document.querySelector("#repo-list");

const topicLabels = new Map([
  ["api", "API"],
  ["css", "CSS"],
  ["fastapi", "FastAPI"],
  ["ftdi", "FTDI"],
  ["github-actions", "GitHub Actions"],
  ["html", "HTML"],
  ["iptables", "iptables"],
  ["javascript", "JavaScript"],
  ["latex", "LaTeX"],
  ["nginx", "nginx"],
  ["postgresql", "PostgreSQL"],
  ["raspberry-pi", "Raspberry Pi"],
  ["typescript", "TypeScript"],
  ["wireguard", "WireGuard"],
]);

function displayTopic(topic) {
  if (topicLabels.has(topic)) {
    return topicLabels.get(topic);
  }

  return topic
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function appendBadge(parent, label) {
  const badge = document.createElement("span");
  badge.className = "repo-badge";
  badge.textContent = label;
  parent.append(badge);
}

function decorateFallbackRows() {
  for (const row of repoList?.querySelectorAll(".repo-row[data-repo]") || []) {
    const heading = row.querySelector(".repo-title-line");
    if (!heading) {
      continue;
    }

    for (const caseStudy of caseStudiesForRepo(row.dataset.repo)) {
      appendBadge(heading, caseStudy.title);
    }
  }
}

function createRepoRow(repo) {
  const row = document.createElement("div");
  row.className = "repo-row";

  const details = document.createElement("div");
  const heading = document.createElement("div");
  heading.className = "repo-title-line";

  const repoLink = document.createElement("a");
  repoLink.className = "repo-name";
  repoLink.href = repo.html_url;
  repoLink.target = "_blank";
  repoLink.rel = "noopener noreferrer";
  repoLink.textContent = repo.name;
  heading.append(repoLink);

  for (const caseStudy of caseStudiesForRepo(repo.name)) {
    appendBadge(heading, caseStudy.title);
  }

  if (repo.fork) {
    appendBadge(heading, "Fork");
  }

  if (repo.archived) {
    appendBadge(heading, "Archived");
  }

  if (repo.homepage) {
    const homepage = document.createElement("a");
    homepage.className = "repo-homepage";
    homepage.href = repo.homepage;
    homepage.target = "_blank";
    homepage.rel = "noopener noreferrer";
    homepage.textContent = "Live ↗";
    heading.append(homepage);
  }

  const description = document.createElement("p");
  description.className = "repo-desc";
  description.textContent = repo.description || "Public repository on GitHub.";

  details.append(heading, description);

  const tags = document.createElement("div");
  tags.className = "repo-tags";

  const visibleTopics = (repo.topics || []).filter(
    (topic) => topic !== "portfolio" && !topic.startsWith("case-study-"),
  );

  if (visibleTopics.length === 0 && repo.language) {
    visibleTopics.push(repo.language.toLowerCase());
  }

  for (const topic of visibleTopics) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = displayTopic(topic);
    tags.append(chip);
  }

  row.append(details, tags);
  return row;
}

async function fetchPublicRepos() {
  const repos = [];

  for (let page = 1; ; page += 1) {
    const url = new URL(`https://api.github.com/users/${GITHUB_USER}/repos`);
    // This endpoint only returns public repositories for a public user lookup.
    url.searchParams.set("type", "owner");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("per_page", String(REPOS_PER_PAGE));
    url.searchParams.set("page", String(page));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const pageOfRepos = await response.json();
    repos.push(...pageOfRepos);

    if (pageOfRepos.length < REPOS_PER_PAGE) {
      return repos;
    }
  }
}

function sortRepos(repos) {
  return repos.sort((a, b) => {
    if (a.archived !== b.archived) {
      return Number(a.archived) - Number(b.archived);
    }

    return new Date(b.pushed_at) - new Date(a.pushed_at);
  });
}

async function renderRepositories() {
  if (!repoList) {
    return;
  }

  try {
    const repos = sortRepos(await fetchPublicRepos());
    if (repos.length > 0) {
      repoList.replaceChildren(...repos.map(createRepoRow));
    }
  } catch (error) {
    // The committed HTML remains visible as a useful fallback.
    console.warn("Unable to refresh repositories from GitHub; using fallback content.", error);
  }
}

decorateFallbackRows();
renderRepositories();
