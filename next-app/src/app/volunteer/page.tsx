import type { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowLeft, faArrowUpRightFromSquare, faEarthAmericas, faGraduationCap, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CompactHero from "@/components/CompactHero";
import { volunteerRoles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Volunteer Work",
  description: "Volunteer and community involvement by Brandon Sanders, CISSP, including cybersecurity education and scholarship review work.",
};

const icons: Record<string, IconDefinition> = {
  "earth-americas": faEarthAmericas,
  "graduation-cap": faGraduationCap,
};

export default function VolunteerPage() {
  return (
    <>
      <CompactHero
        eyebrow="Brandon Sanders, CISSP"
        title="Volunteer Work"
        tagline="(ISC)² · Center for Cyber Safety and Education"
        actions={
          <>
            <a href="#volunteer" className="btn-primary">
              <FontAwesomeIcon icon={faArrowDown} className="text-xs" /> View Volunteer Work
            </a>
            <Link href="/" className="btn-outline">
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Back to Portfolio
            </Link>
          </>
        }
      />

      <Reveal>
        <section className="bg-white py-16 md:py-20" id="volunteer">
          <div className="max-w-6xl mx-auto px-4">
            <SectionHeading number="01" eyebrow="Giving back">
              Volunteer Work
            </SectionHeading>
            <p className="text-ink/65 text-sm mb-8 -mt-2">
              Contributing to the cybersecurity community through education, scholarships, and workforce development.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {volunteerRoles.map((role) => (
                <div key={role.title} className="bg-white rounded-2xl border border-line flex flex-col">
                  <div className="bg-ink p-4 flex items-center gap-3 rounded-t-2xl">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80 text-lg shrink-0" aria-hidden="true">
                      <FontAwesomeIcon icon={icons[role.icon]} />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm leading-tight">{role.title}</div>
                      <div className="text-white/60 text-xs mt-0.5">{role.org}</div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="pill pill-accent">{role.period}</span>
                      <span className="pill">{role.category}</span>
                    </div>
                    <p className="text-ink/65 text-sm leading-relaxed flex-1">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Credly's embed snippet (div + embed.js) just swaps the div for this
                iframe, so render it directly and skip loading their script. */}
            <div className="mt-6 bg-white rounded-2xl border border-line p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <iframe
                src="https://www.credly.com/embedded_badge/06ce5dec-40f7-42b6-8839-5ae0be584ed0"
                title="ISC2 Volunteer badge, verified on Credly"
                width={150}
                height={270}
                loading="lazy"
                scrolling="no"
                className="border-0 shrink-0"
              />
              <div>
                <div className="font-serif text-xl text-ink mb-2">ISC2 Volunteer</div>
                <p className="text-ink/65 text-sm leading-relaxed mb-4">
                  Recognizes active contributions to ISC2 initiatives: advancing cybersecurity knowledge, fostering
                  collaboration, and promoting ethical digital practices.
                </p>
                <a
                  href="https://www.credly.com/badges/06ce5dec-40f7-42b6-8839-5ae0be584ed0"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-75 transition-opacity"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[0.65rem]" /> Verify on Credly
                </a>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
