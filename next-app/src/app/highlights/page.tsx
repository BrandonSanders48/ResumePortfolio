import type { Metadata } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUpRightFromSquare, faRobot } from "@fortawesome/free-solid-svg-icons";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CompactHero from "@/components/CompactHero";
import { technicalHighlights } from "@/lib/content";

export const metadata: Metadata = {
  title: "Professional Highlights",
  description:
    "Employer feedback, recognitions, and a full technical highlights list for Brandon Sanders, CISSP, IT Security Leader and Cybersecurity Professional.",
};

const aiPoints = [
  {
    title: "Highly driven and curious",
    body: "Constantly learning beyond the job (Security+, CISSP, Kubernetes, lab work, motorcycle repairs, self-hosted AI)",
  },
  {
    title: "Security-minded, systems-level perspective",
    body: "Focuses on reliability, process, and risk rather than quick fixes. The mindset of a strong architect or future CISO",
  },
  {
    title: "Balances technical depth with service",
    body: "Values people and community in nonprofit/public sector work, committees, and infrastructure upgrades",
  },
  {
    title: "Already positioning as a leader",
    body: "Serving on committees, planning infrastructure for new facilities, and running home labs, qualities hiring managers seek",
  },
];

/** Employer strip across the top of an Employer Feedback card, using the same
 *  logo tiles as the homepage's Experience section. */
function EmployerHeader({ logo, employer, label }: { logo: string; employer: string; label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
      <Image
        src={logo}
        alt=""
        width={48}
        height={48}
        className="w-11 h-11 rounded-xl border border-line bg-white p-1 object-contain shrink-0"
      />
      <div className="min-w-0">
        <div className="font-semibold text-ink text-[0.95rem] leading-tight">{employer}</div>
        <div className="text-ink/65 text-xs mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function HighlightsPage() {
  return (
    <>
      <CompactHero
        eyebrow="Brandon Sanders, CISSP"
        title="Professional Highlights"
        tagline="IT Security Leader · Risk & Compliance · Infrastructure Strategy · GRC"
        actions={
          <>
            <a href="#highlights" className="btn-primary">
              <FontAwesomeIcon icon={faArrowDown} className="text-xs" /> Employer Feedback
            </a>
            <a href="#technical" className="btn-outline">
              Technical Highlights
            </a>
          </>
        }
      />

      <Reveal>
        <section className="bg-white py-16 md:py-20" id="about2">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="01" eyebrow="Overview">
              Career Accomplishments
            </SectionHeading>
            <div className="max-w-3xl">
              <p className="text-ink/70 leading-relaxed">
                Throughout my career, I&apos;ve built a strong foundation in leadership, networking, cybersecurity, and systems administration,
                successfully managing complex environments across Windows, Linux, macOS and Kubernetes clusters. I have implemented secure and
                scalable solutions that improved reliability and efficiency, including deploying containerized workloads, strengthening security
                policies, and streamlining IT operations. My certifications, including (ISC)² Certified Information Systems Security Professional
                (CISSP), (ISC)² Certified in Cybersecurity (CC) and CompTIA Security+, reflect my dedication to industry best practices and
                continuous learning. Beyond certifications, I take pride in delivering practical results, optimizing infrastructure, supporting
                end users, and contributing to resilient IT systems that meet organizational goals.
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-paper py-16 md:py-20" id="highlights">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="02" eyebrow="Recognition">
              Employer Feedback
            </SectionHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-line">
                <EmployerHeader
                  logo="/files/images/logos/salina-family-healthcare.png"
                  employer="Salina Family Healthcare Center"
                  label="Service Excellence Nomination"
                />
                <div className="p-4">
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden group">
                    <iframe
                      className="w-full h-full border-0 rounded-xl"
                      title="Service Excellence Nomination (PDF)"
                      loading="lazy"
                      src="/files/Service Excellence Nomination.pdf#view=FitH&toolbar=0&navpanes=0"
                    />
                    <a
                      className="absolute inset-0 flex items-center justify-center bg-ink/25 backdrop-blur-[2px] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      href="/files/Service Excellence Nomination.pdf"
                      target="_blank"
                      rel="noopener"
                      aria-label="Open Service Excellence Nomination PDF in a new tab"
                    >
                      <span className="btn-primary">
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Open PDF
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line">
                <EmployerHeader logo="/files/images/logos/smg-unlimited.png" employer="SMG Unlimited" label="Employment History Letter" />
                <div className="p-4">
                  <div className="aspect-[4/3] relative rounded-xl overflow-hidden group">
                    <iframe
                      className="w-full h-full border-0 rounded-xl"
                      title="Employment History Letter - SMG Unlimited (PDF)"
                      loading="lazy"
                      src="/files/B Sanders Empl History Letter-SMG Unlimited.pdf#view=FitH&toolbar=0&navpanes=0"
                    />
                    <a
                      className="absolute inset-0 flex items-center justify-center bg-ink/25 backdrop-blur-[2px] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      href="/files/B Sanders Empl History Letter-SMG Unlimited.pdf"
                      target="_blank"
                      rel="noopener"
                      aria-label="Open Employment History Letter PDF in a new tab"
                    >
                      <span className="btn-primary">
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Open PDF
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line">
                <EmployerHeader
                  logo="/files/images/logos/saint-francis-ministries.png"
                  employer="Saint Francis Ministries"
                  label="CEO Challenge Coin"
                />
                <div className="p-6">
                  <p className="text-ink/70 text-sm leading-relaxed mb-4">
                    In addition to Sam &amp; Cherise&apos;s recognition, I was honored to receive a challenge coin from William J. Clark (Bill), CEO
                    of St. Francis Ministries, in recognition of my dedication, hard work, and contributions in IT. This meaningful acknowledgment
                    reflects not only my technical expertise and problem-solving skills but also my commitment to supporting the organization and
                    ensuring smooth, efficient operations. Receiving a challenge coin directly from the CEO was a tremendous honor and a reminder of
                    the impact of my work.
                  </p>
                  <div className="text-center">
                    <Image
                      alt="Front & Rear of Saint Francis Ministries Challenge Coin"
                      src="/files/images/SFM_Challenge_Coin-Both.png"
                      width={500}
                      height={300}
                      sizes="350px"
                      className="mx-auto w-[70%] h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6 md:p-8">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-paper flex items-center justify-center text-accent shrink-0 mt-0.5" aria-hidden="true">
                    <FontAwesomeIcon icon={faRobot} className="text-sm" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-base sm:text-lg mb-1">What does AI say about me?</div>
                    <div className="text-ink/65 text-xs sm:text-sm font-normal">(Generated using the self-hosted model Gemma 3, running on Ollama in Kubernetes)</div>
                  </div>
                </div>
                <ul className="flex flex-col gap-4">
                  {aiPoints.map((point) => (
                    <li key={point.title} className="flex gap-3">
                      {/* Same tick as .check-list; an empty box read as unchecked/still loading. */}
                      <span
                        className="mt-1 w-[16px] h-[16px] rounded-[3px] bg-accent/10 border-[1.5px] border-accent/40 shrink-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" className="w-[62%] h-[62%]" fill="none" stroke="#3f6b66" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8.5l3 3 7-7" />
                        </svg>
                      </span>
                      <span className="text-ink/70 text-sm leading-relaxed">
                        <strong className="font-semibold text-ink">{point.title}</strong> {point.body}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-ink py-16 md:py-20" id="technical">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="03" eyebrow="The details" light>
              Technical Highlights
            </SectionHeading>
            <p className="text-white/55 text-sm mb-6">A quick scan of infrastructure, security, and operational wins across my roles.</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {technicalHighlights.map((item) => (
                <li
                  key={item}
                  className="relative pl-12 pr-3.5 py-3.5 rounded-xl border border-white/12 bg-white/[0.04] text-white/80 text-sm leading-relaxed hover:border-accent/40 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="absolute left-3.5 top-3.5 w-5 h-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[0.65rem] text-white/70">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-white/55 text-sm italic mt-6">
              This is not an exhaustive list; it highlights some key achievements in IT infrastructure and security.
            </p>
          </div>
        </section>
      </Reveal>
    </>
  );
}
