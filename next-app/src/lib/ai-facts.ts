/**
 * Facts for the "Ask AI" search that aren't displayed anywhere on the site.
 * Always included in the AI's context. Only add things you're comfortable
 * with any visitor learning. Write each as a plain sentence naming Brandon:
 * the model repeats those more reliably than fragments.
 */

/** Common recruiter screening questions. */
export const AI_FACTS: string[] = [
  "Brandon holds a valid driver's license.",
  "Brandon is a U.S. citizen and is authorized to work in the United States without visa sponsorship.",
  "Brandon has not served in the military (he is not a veteran).",
];

/** Personal interests, used only for "what's he like / hobbies" questions. */
export const FUN_FACTS: string[] = [
  "Brandon's favorite season is fall.",
  "Brandon rides motorcycles.",
  "Brandon is a fan of pumpkin spice.",
  "Brandon loves tea.",
  "Brandon loves adventure.",
  "Brandon loves motocamping.",
];
