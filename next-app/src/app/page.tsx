import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faAward,
  faUsersGear,
  faShieldHalved,
  faServer,
  faGraduationCap,
  faArrowUpRightFromSquare,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import ResumeDownloadButton from "@/components/ResumeDownloadButton";
import HeroBackground from "@/components/HeroBackground";
import { experience } from "@/lib/content";

const metrics = [
  { value: "5+", label: "Years IT Leadership" },
  { value: "3", label: "Organizations Secured" },
  { value: "HIPAA", label: "& SOC 2 Compliance" },
  { value: "3", label: "Governance Committees" },
  { value: "CISSP", label: "Certified · CISM Pursuing" },
];

const skillGroups = [
  {
    icon: faUsersGear,
    title: "Leadership & Governance",
    subtitle: "Strategy, risk oversight, and organizational alignment",
    items: [
      "IT Strategy & Program Management",
      "Risk Management & Governance (GRC)",
      "HIPAA, SOC 2, NIST Framework Alignment",
      "Security Policy & Procedure Development",
      "Vendor Management & Contract Negotiation",
      "Stakeholder Communication & Executive Reporting",
      "Safety & Security Committee Leadership",
      "Technology Procurement & Budget Planning",
      "Audit Readiness & Regulatory Compliance",
      "Cross-Functional Collaboration",
      "IT Governance & Change Management",
    ],
  },
  {
    icon: faShieldHalved,
    title: "Security & Risk Operations",
    subtitle: "CISSP-aligned security program management",
    items: [
      "Cybersecurity Program Management",
      "Incident Response & Forensics",
      "Vulnerability Assessment & Remediation",
      "Network Security Architecture",
      "Identity & Access Management (IAM / SSO / MFA)",
      "Security Hardening & Patch Management",
      "SIEM & Log Analysis (Elastic, Graylog)",
      "Disaster Recovery & Business Continuity",
      "Cloud Security (Azure, M365, Entra ID)",
      "Endpoint Security & MDM (Intune)",
      "Data Classification & Protection",
    ],
  },
  {
    icon: faServer,
    title: "Technical Infrastructure",
    subtitle: "Hands-on expertise across network, cloud, and systems",
    items: [
      "Network & Security: pfSense, Fortinet, Sophos, Cisco, VLANs, BGP",
      "Microsoft Ecosystem: M365, Exchange, Entra ID, WSUS, Intune, MDT",
      "Virtualization & Backup: Proxmox, VMware, Veeam, TrueNAS",
      "Cloud & Containers: Azure, Kubernetes (6-node HA), Docker, Ansible",
      "Monitoring: Prometheus, Grafana, Elastic SIEM, Graylog",
      "Scripting & Automation: PowerShell, Bash, Git",
      "Databases: Microsoft SQL, MySQL",
    ],
  },
];

const certifications = [
  {
    name: "CISSP",
    issuer: "(ISC)²",
    description: "Certified Information Systems Security Professional",
    tags: ["Risk", "Security Strategy", "Architecture"],
    href: "https://www.credly.com/badges/3c84ffd0-0c4d-4551-bc52-2309e51f0597",
  },
  {
    name: "CC",
    issuer: "(ISC)²",
    description: "Certified in Cybersecurity",
    tags: ["Foundations", "Security Controls", "Best Practices"],
    href: "https://www.credly.com/badges/90835a7f-8e3c-48c6-b082-fb36d9e0c533",
  },
  {
    name: "Security+",
    issuer: "CompTIA",
    description: "Baseline cybersecurity knowledge and operations",
    tags: ["Ops", "Defense", "Incidents"],
    href: "https://www.credly.com/badges/0e6238f1-615e-4767-b19b-e00b3ee1e10a",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <header id="home" className="bg-paper border-b border-line relative overflow-hidden">
        <HeroBackground />
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 relative">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="eyebrow mb-5 justify-center lg:justify-start">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                <span>Open to Opportunities</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] mb-4">
                Brandon Sanders, <span className="italic">CISSP</span>
              </h1>

              <p className="text-base lg:text-lg text-ink/55 mb-7 max-w-xl mx-auto lg:mx-0">
                IT Security Leader &amp; Manager, Risk &amp; Compliance, Infrastructure Strategy, GRC
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                <span className="pill">Salina, KS</span>
                <span className="pill pill-accent">IT Manager / CISO Track</span>
                <a href="https://www.credly.com/badges/3c84ffd0-0c4d-4551-bc52-2309e51f0597" target="_blank" rel="noopener noreferrer">
                  <span className="pill">(ISC)² CISSP</span>
                </a>
                <a href="https://www.credly.com/badges/0e6238f1-615e-4767-b19b-e00b3ee1e10a" target="_blank" rel="noopener noreferrer">
                  <span className="pill">CompTIA Security+</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                <ResumeDownloadButton />
                <a href="https://www.linkedin.com/in/brandonsanders48" target="_blank" rel="noopener" className="btn-outline">
                  <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" /> LinkedIn
                </a>
                <a href="https://github.com/brandonsanders48" target="_blank" rel="noopener" className="btn-outline">
                  <FontAwesomeIcon icon={faGithub} className="text-xs" /> GitHub
                </a>
                <a href="https://www.credly.com/users/brandonsanders" target="_blank" rel="noopener" className="btn-outline">
                  <FontAwesomeIcon icon={faAward} className="text-xs" /> Credly
                </a>
                <a href="#contact" className="btn-outline">
                  <FontAwesomeIcon icon={faEnvelope} className="text-xs" /> Contact
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 shrink-0">
              <Image
                src="/files/images/Brandon_Sanders-cropped.png"
                alt="Brandon Sanders Portrait"
                width={256}
                height={256}
                priority
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-60 lg:h-60 rounded-2xl object-cover border border-line shadow-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* STATS ROW */}
      <Reveal>
        <div className="bg-white border-b border-line py-7">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center flex-nowrap sm:flex-wrap gap-0 overflow-x-auto">
              {metrics.map((m, i) => (
                <div key={m.label} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center text-center px-4 sm:px-6 py-2">
                    <span className="font-serif text-xl sm:text-2xl md:text-3xl text-ink leading-tight whitespace-nowrap">{m.value}</span>
                    <span className="text-[0.62rem] sm:text-xs text-ink/65 font-semibold mt-1 uppercase tracking-wide whitespace-nowrap">
                      {m.label}
                    </span>
                  </div>
                  {i < metrics.length - 1 && <div className="hidden sm:block w-px h-9 bg-line shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ABOUT */}
      <Reveal>
        <section className="bg-white py-16 md:py-20" id="about">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="01" eyebrow="Profile">
              About
            </SectionHeading>
            <div className="max-w-3xl">
              <p className="text-ink/70 leading-relaxed mb-4">
                I&apos;m an IT and cybersecurity leader with a track record of building secure, compliant, and resilient technology environments
                across healthcare and nonprofit organizations. I bridge technical depth with strategic oversight, translating organizational risk
                into policy, leading cross-functional security committees, and driving initiatives that align IT operations with business goals
                and regulatory requirements.
              </p>
              <p className="text-ink/70 leading-relaxed mb-4">
                In my current role, I serve as the sole IT and security lead for a multi-site healthcare organization (4 locations, approximately
                200 users), managing infrastructure strategy, security operations, and compliance programs while sitting on the Safety and Security
                Committees to contribute to governance at the organizational level. I have delivered full-scope IT programs from design through
                implementation, including new facility buildouts, security modernization initiatives, and disaster recovery planning.
              </p>
              <p className="text-ink/70 leading-relaxed mb-6">
                I hold the CISSP designation and am actively pursuing CISM to deepen my security management expertise, alongside a B.S. in
                Information Technology Management at Western Governors University. I am seeking IT Manager and CISO-track opportunities where I
                can combine technical credibility with risk leadership to protect the organization and enable the business.
              </p>
              <Link href="/highlights" className="btn-primary">
                Professional Highlights
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CREDENTIAL BANNER */}
      <Reveal>
        <div className="bg-ink text-center py-4 px-4">
          <div className="inline-flex flex-wrap justify-center gap-x-2 gap-y-1.5 max-w-[95%] mx-auto">
            {["CISSP Certified", "Pursuing CISM", "Targeting IT Manager & CISO Roles", "Available for Leadership Opportunities"].map(
              (item, i, arr) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/8 text-white/90 font-medium text-sm">{item}</span>
                  {i < arr.length - 1 && <span className="text-white/30">·</span>}
                </span>
              )
            )}
          </div>
        </div>
      </Reveal>

      {/* HIGHLIGHTS CALLOUT */}
      <Reveal>
        <section className="py-12 md:py-16 bg-white" aria-label="Professional highlights">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-paper rounded-2xl border border-line p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-line flex items-center justify-center text-accent shrink-0" aria-hidden="true">
                      <FontAwesomeIcon icon={faAward} className="text-lg" />
                    </div>
                    <h3 className="font-serif text-lg text-ink leading-tight">Professional Highlights</h3>
                  </div>
                  <p className="text-ink/60 text-sm leading-relaxed">
                    Employer feedback, impact stories, and technical wins. If you only have a minute, start here, it&apos;s the fastest way to
                    understand the scope of my work.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href="/highlights" className="btn-primary">
                    View Highlights
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SKILLS */}
      <Reveal>
        <section className="bg-paper py-16 md:py-20" id="skills">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="02" eyebrow="Capabilities">
              Skills
            </SectionHeading>
            <div className="grid md:grid-cols-3 gap-6">
              {skillGroups.map((group) => (
                <div key={group.title} className="bg-white rounded-2xl border border-line overflow-hidden flex flex-col">
                  <div className="p-5 flex items-center gap-3 border-b border-line min-h-[84px]">
                    <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent text-lg shrink-0" aria-hidden="true">
                      <FontAwesomeIcon icon={group.icon} />
                    </div>
                    <div>
                      <div className="font-semibold text-ink text-[0.95rem]">{group.title}</div>
                      <div className="text-ink/65 text-xs">{group.subtitle}</div>
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <ul className="check-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* EXPERIENCE */}
      <Reveal>
        <section className="bg-white py-16 md:py-20" id="experience">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="03" eyebrow="Career">
              Experience
            </SectionHeading>
            <div className="flex flex-col">
              {experience.map((job, i) => (
                <div key={job.role} className="flex gap-5">
                  <div className="flex flex-col items-center shrink-0 w-4">
                    <div className="w-3 h-3 rounded-full bg-white border-[2px] border-accent mt-[1.25rem] shrink-0 box-border" />
                    {i < experience.length - 1 && <div className="w-px flex-1 bg-line mt-1" />}
                  </div>
                  <div className={`flex-1 ${i < experience.length - 1 ? "pb-6" : ""}`}>
                    <div className="bg-white rounded-2xl border border-line p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-ink text-[0.95rem]">{job.role}</h3>
                        <span className="pill whitespace-nowrap">{job.period}</span>
                      </div>
                      <ul className="check-list">
                        {job.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* EDUCATION */}
      <Reveal>
        <section className="bg-paper py-16 md:py-20" id="education">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="04" eyebrow="Academics">
              Education
            </SectionHeading>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-line p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0" aria-hidden="true">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-[0.95rem]">Western Governors University</div>
                    <div className="text-ink/65 text-xs">B.S., Information Technology Management · In Progress</div>
                  </div>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">
                  Currently pursuing a Bachelor&apos;s degree in Information Technology Management to complement hands-on IT leadership and
                  cybersecurity experience with formal academic credentials.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0" aria-hidden="true">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-[0.95rem]">Salina Central High School</div>
                    <div className="text-ink/65 text-xs">High School Diploma · 2014</div>
                  </div>
                </div>
                <p className="text-ink/60 text-sm leading-relaxed">
                  My cybersecurity and IT expertise has been built through hands-on professional experience, certifications, continuous
                  self-study, and lab work (including a high-availability Kubernetes environment).
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-line p-6">
                <div className="font-semibold text-ink text-[0.95rem] mb-3">Professional Development</div>
                <div className="flex flex-wrap gap-2">
                  {["IT Leadership", "Cybersecurity", "GRC & Risk", "Systems & Network Engineering", "Cloud & Kubernetes"].map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CERTIFICATIONS */}
      <Reveal>
        <section className="bg-white py-16 md:py-20" id="certs">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="05" eyebrow="Credentials">
              Certifications
            </SectionHeading>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {certifications.map((cert) => (
                <div key={cert.name} className="bg-white rounded-2xl border border-line p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-serif text-xl text-ink">{cert.name}</div>
                    <span className="pill">{cert.issuer}</span>
                  </div>
                  <div className="text-ink/65 text-sm mb-4">{cert.description}</div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cert.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href={cert.href} target="_blank" rel="noopener" className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-75 transition-opacity">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[0.65rem]" /> Verify on Credly
                  </a>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-ink/65 text-sm">More certifications and verifications on Credly.</p>
              <a href="https://www.credly.com/users/brandonsanders" target="_blank" rel="noopener" className="btn-outline">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                View more on Credly
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CONTACT */}
      <Reveal>
        <section className="bg-paper py-16 md:py-20" id="contact">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div>
                <SectionHeading number="06" eyebrow="Get in touch">
                  Contact
                </SectionHeading>
                <p className="text-ink/60 text-sm">
                  Send a message and I&apos;ll get back to you, or grab my resume directly using the button in the nav above.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="pill">Leadership &amp; management inquiries welcome</span>
                <span className="pill">Based in Salina, KS · Remote-friendly</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ContactForm />

              <div className="bg-white rounded-2xl border border-line p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0" aria-hidden="true">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-[0.95rem]">Location</div>
                    <div className="text-ink/65 text-xs">Salina, KS</div>
                  </div>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-line flex-1">
                  <iframe
                    title="Map of Salina, KS"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.548548582053!2d-97.6092919846236!3d38.840104979583026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87a61fd5f457e5b1%3A0x35a6b9f7ab5b1b2b!2sSalina%2C%20KS%2067451!5e0!3m2!1sen!2sus!4v1695156000000!5m2!1sen!2sus"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <p className="text-ink/65 text-sm mt-4">
                  Open to IT Manager, CISO, and senior cybersecurity leadership opportunities. Remote-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
