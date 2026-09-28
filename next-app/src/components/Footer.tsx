import Image from "next/image";
import ResetAccessButton from "@/components/ResetAccessButton";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/[.08] py-10 md:py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:flex-wrap items-center md:justify-between gap-5 md:gap-4 text-center">
        <div className="flex items-center gap-3">
          <Image
            src="/files/images/bs-logo.svg"
            alt="Brandon Sanders initials"
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg object-cover opacity-80"
          />
          <p className="text-white/60 text-xs">&copy; {new Date().getFullYear()} Brandon Sanders, CISSP</p>
        </div>
        <div className="text-white/60 text-xs italic text-center">For use by individuals in the United States only.</div>
        <div className="text-white/60 text-xs md:text-right leading-relaxed">
          Self-hosted website built by Brandon Sanders, CISSP
          {/* Links drop to their own line on mobile instead of crowding the credit text. */}
          <span className="hidden md:inline mx-1.5 text-white/30">·</span>
          <span className="block md:inline mt-3 md:mt-0">
            <a href="/editor" className="hover:text-white/85 transition-colors">
              Resume Editor
            </a>
            <ResetAccessButton />
          </span>
        </div>
      </div>
      {/* Covers the vendor logos on the homepage (and any brand named elsewhere). */}
      <p className="max-w-6xl mx-auto px-4 mt-6 pt-5 border-t border-white/[.06] text-white/55 text-[0.7rem] leading-relaxed text-center">
        All product names, logos, and brands are property of their respective owners and are used for identification purposes only. Their
        use does not imply endorsement.
      </p>
    </footer>
  );
}
