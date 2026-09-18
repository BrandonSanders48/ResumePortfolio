import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowLeft,
  faHospital,
  faScaleBalanced,
  faLock,
  faNetworkWired,
  faServer,
  faBuildingShield,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CompactHero from "@/components/CompactHero";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured infrastructure, security, and engineering projects by Brandon Sanders, CISSP, including virtualization migrations, disaster recovery, and network security work.",
};

const icons: Record<string, IconDefinition> = {
  hospital: faHospital,
  "scale-balanced": faScaleBalanced,
  lock: faLock,
  "network-wired": faNetworkWired,
  server: faServer,
  "building-shield": faBuildingShield,
};

export default function ProjectsPage() {
  return (
    <>
      <CompactHero
        eyebrow="Brandon Sanders, CISSP"
        title="Projects"
        tagline="Featured Projects · Infrastructure · Security · Engineering"
        actions={
          <>
            <a href="#projects" className="btn-primary">
              <FontAwesomeIcon icon={faArrowDown} className="text-xs" /> View Projects
            </a>
            <Link href="/" className="btn-outline">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Back to Portfolio
            </Link>
          </>
        }
      />

      <Reveal>
        <section className="bg-white py-16 md:py-20" id="projects">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="01" eyebrow="Selected work">
              Featured Projects
            </SectionHeading>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.title} className="bg-white rounded-2xl border border-line flex flex-col">
                  <div className="bg-ink p-4 flex items-center gap-3 rounded-t-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 text-lg shrink-0" aria-hidden="true">
                      <FontAwesomeIcon icon={icons[project.icon]} />
                    </div>
                    <div className="font-semibold text-white text-sm leading-tight">{project.title}</div>
                  </div>
                  <p className="text-ink/65 text-sm leading-relaxed p-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 p-4 pt-0 mt-auto">
                    {project.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.link && (
                    <div className="px-4 pb-4">
                      <a
                        href={project.link.href}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-75 transition-opacity"
                      >
                        <FontAwesomeIcon icon={faGithub} className="text-sm" /> {project.link.label}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
