// A case study describes a body of work, which may span several repositories.
// Keep narrative content in the case-study HTML; this map owns only the
// relationship between a case study and its public GitHub repositories.
export const caseStudies = [
  {
    slug: "node-hub",
    title: "Node Hub",
    path: "/case-studies/node-hub/",
    repos: ["node-hub", "atlas-scientific-sensor-pi-api"],
  },
  {
    slug: "resume-as-code",
    title: "Résumé as Code",
    path: "/case-studies/resume-as-code/",
    repos: ["resume"],
  },
];

export function caseStudiesForRepo(repoName) {
  return caseStudies.filter(({ repos }) => repos.includes(repoName));
}
