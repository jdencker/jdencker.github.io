import { caseStudies, caseStudiesForRepo } from "./case-studies.js";

const GITHUB_USER = "jdencker";
const REPOS_PER_PAGE = 100;
const repoList = document.querySelector("#repo-list");
const repoHead = document.querySelector("[data-repo-head]");
const repoViewToggle = document.querySelector("[data-repo-view-toggle]");
const repoViewButtons = [...document.querySelectorAll("[data-repo-view]")];
const featuredRepoNames = [
  ...new Set(caseStudies.flatMap(({ repos }) => repos)),
];

let publicRepos = [];
let activeView = "featured";

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

function httpUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
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

  const homepageUrl = httpUrl(repo.homepage);
  if (homepageUrl) {
    const homepage = document.createElement("a");
    homepage.className = "repo-homepage";
    homepage.href = homepageUrl;
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

    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
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

function featuredRepos(repos) {
  const reposByName = new Map(repos.map((repo) => [repo.name, repo]));
  return featuredRepoNames
    .map((repoName) => reposByName.get(repoName))
    .filter(Boolean);
}

function recentlyPushedRepos(repos) {
  return [...repos].sort(
    (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at),
  );
}

function setActiveView(view) {
  activeView = view;

  for (const button of repoViewButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.repoView === activeView),
    );
  }

  const repos = activeView === "featured"
    ? featuredRepos(publicRepos)
    : recentlyPushedRepos(publicRepos);

  repoList.replaceChildren(...repos.map(createRepoRow));
}

function showRepositoryMessage(message, includeLink = true) {
  const status = document.createElement("p");
  status.className = "repo-status";
  status.append(message);

  if (includeLink) {
    status.append(" ");
    const link = document.createElement("a");
    link.href = `https://github.com/${GITHUB_USER}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View all repositories on GitHub ↗";
    status.append(link);
  }

  repoList.replaceChildren(status);
}

async function renderRepositories() {
  if (!repoList) {
    return;
  }

  repoList.setAttribute("aria-busy", "true");
  showRepositoryMessage("Loading repository data…", false);

  try {
    publicRepos = await fetchPublicRepos();
    if (publicRepos.length === 0) {
      showRepositoryMessage("No public repositories were found.");
      return;
    }

    repoViewToggle.hidden = false;
    repoHead.hidden = false;
    setActiveView(activeView);
  } catch (error) {
    showRepositoryMessage("Repository data is temporarily unavailable.");
    console.warn("Unable to load repositories from GitHub.", error);
  } finally {
    repoList.setAttribute("aria-busy", "false");
  }
}

for (const button of repoViewButtons) {
  button.addEventListener("click", () => setActiveView(button.dataset.repoView));
}

renderRepositories();
