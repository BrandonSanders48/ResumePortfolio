import Image from "next/image";
import type { ReactNode } from "react";
import HeroBackground from "@/components/HeroBackground";

export default function CompactHero({ eyebrow, title, tagline, actions }: { eyebrow: string; title: string; tagline: string; actions: ReactNode }) {
  return (
    <header className="bg-paper border-b border-line relative overflow-hidden">
      <HeroBackground />
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16 relative">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="shrink-0">
            <Image
              src="/files/images/Brandon_Sanders-cropped.png"
              alt="Brandon Sanders Portrait"
              width={192}
              height={192}
              priority
              className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border border-line shadow-sm"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="eyebrow mb-3 justify-center lg:justify-start">
              <span>{eyebrow}</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl text-ink leading-[1.1] mb-3">{title}</h1>
            <p className="text-base text-ink/55 mb-6">{tagline}</p>
            <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">{actions}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
