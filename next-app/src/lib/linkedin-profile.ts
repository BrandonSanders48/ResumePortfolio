/**
 * LinkedIn profile snapshot for the "Ask AI" search. LinkedIn has no public
 * profile API and blocks automated access, so this comes from LinkedIn's own
 * data export (Settings & Privacy > Data privacy > Get a copy of your data):
 *
 *   node scripts/import-linkedin.js <path-to-extracted-export>
 *
 * The importer keeps only professional fields (no birth date, address, or
 * contact details). It can also be edited by hand. Leave empty to omit
 * LinkedIn from the AI's context entirely. Redeploy after updating.
 */
export const LINKEDIN_PROFILE = `Headline: CISSP | IT Infrastructure & Security Leader | Risk, Resilience & Operations | SecOps & Architecture
Industry: IT Services and IT Consulting
Location: Salina, Kansas, United States
About: Cybersecurity professional with deep expertise in information security program development, risk mitigation, and compliance management. With CISSP, soon CISM, and Security+ certifications, I have a strong track record of identifying vulnerabilities, building structured response and remediation processes, and leading technical teams toward measurable security improvements. I bridge the gap between hands-on technical execution and strategic program oversight, ensuring security initiatives are operationally sound and organizationally aligned.

Recommendations received:
- From Gabriel Guillen, Information Technology Assistant at Salina Family Healthcare Center: "Brandon is a great mentor, highly skilled in multiple areas of IT/cybersecurity/software development and highly knowledgeable in these areas as well. It's astounding to see Brandon's ability to recall technical definitions and use cases in detail. Brandon will be a great asset, teammate, and leader at any company he works at in the future."

Recommendations written by Brandon (showing mentorship):
- For Gabriel Guillen, Information Technology Assistant at Salina Family Healthcare Center`;

export const LINKEDIN_URL = "https://www.linkedin.com/in/brandonsanders48";
