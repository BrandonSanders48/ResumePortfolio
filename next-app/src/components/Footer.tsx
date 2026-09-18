import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-white/[.08] py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
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
        <div className="text-white/60 text-xs text-right">
          Self-hosted website built by Brandon Sanders, CISSP
          <span className="mx-1.5 text-white/30">·</span>
          <a
            href="https://brandonsanders.org/editor/index.php"
            target="_blank"
            rel="noopener"
            className="hover:text-white/85 transition-colors"
          >
            Resume Editor
          </a>
        </div>
      </div>
    </footer>
  );
}
