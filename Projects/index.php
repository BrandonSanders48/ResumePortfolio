<?php
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL);

    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Content-Security-Policy: default-src 'self'; script-src 'self'");

    if (
        !isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
        $_SERVER['HTTP_X_REQUESTED_WITH'] !== 'fetch'
    ) {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
        exit;
    }
?>

<!-- ═══════════════════════════════════════════════════
     NAVBAR (Projects — with back arrow)
═══════════════════════════════════════════════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-brand/[.96] backdrop-blur-xl border-b border-white/10">
  <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

    <!-- Logo + back arrow -->
    <div class="flex items-center gap-2">
      <a href="#" title="Back to portfolio" class="back-arrow mr-1"
         data-load-page="/Portfolio/index.php" data-scroll="" aria-label="Back to portfolio">
        <i class="fa-solid fa-arrow-left"></i>
      </a>
      <a href="#" data-load-page="/Portfolio/index.php" data-scroll=""
         class="flex items-center gap-2.5" aria-label="Back to portfolio">
        <img src="/files/images/bs-logo.svg" alt="BS" class="w-8 h-8 rounded-lg object-cover shadow-md">
        <span class="text-white font-semibold text-sm tracking-tight">Brandon Sanders</span>
      </a>
    </div>

    <!-- Desktop nav -->
    <ul class="hidden lg:flex items-center gap-1">
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="about" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">About</a></li>
      <li><a href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="skills" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="experience" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#projects" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#" data-load-page="/Volunteer/index.php" data-scroll="" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Volunteer</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="education" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Education</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="certs" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Certs</a></li>
      <li class="ml-2">
        <a href="#" data-load-page="/Portfolio/index.php" data-scroll="contact"
           class="rounded-full bg-mint text-brand font-bold text-sm px-4 py-2 hover:brightness-105 transition-all shadow-md">Contact</a>
      </li>
    </ul>

    <!-- Mobile hamburger -->
    <button id="nav-toggle" class="lg:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all" aria-label="Toggle navigation">
      <i class="fa-solid fa-bars text-lg"></i>
    </button>
  </div>

  <!-- Mobile menu -->
  <div id="nav-menu" class="hidden lg:hidden bg-brand border-t border-white/10 px-4 pb-4">
    <ul class="flex flex-col gap-1 pt-3">
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="about" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">About</a></li>
      <li><a href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="skills" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="experience" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#projects" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#" data-load-page="/Volunteer/index.php" data-scroll="" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Volunteer</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="education" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Education</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="certs" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Certs</a></li>
      <li class="pt-1">
        <a href="#" data-load-page="/Portfolio/index.php" data-scroll="contact"
           class="block rounded-full bg-mint text-brand font-bold text-sm px-4 py-2 text-center hover:brightness-105 transition-all">Contact</a>
      </li>
    </ul>
  </div>
</nav>

<!-- ═══════════════════════════════════════════════════
     HERO (compact)
═══════════════════════════════════════════════════ -->
<header id="home" class="bg-brand pt-16 overflow-hidden relative">
  <div class="absolute top-0 left-0 w-[700px] h-[500px] rounded-full bg-mint opacity-[0.07] blur-3xl -translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>
  <div class="absolute top-0 right-0 w-[600px] h-[450px] rounded-full bg-mint-muted opacity-[0.08] blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>

  <div class="max-w-6xl mx-auto px-4 py-12 lg:py-16 relative z-10">
    <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

      <!-- Photo -->
      <div class="shrink-0 relative">
        <img src="/files/images/Brandon_Sanders-cropped.png"
             alt="Brandon Sanders Portrait"
             class="relative w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover border-2 border-white/15 shadow-2xl">
      </div>

      <!-- Text -->
      <div class="flex-1 text-center lg:text-left">
        <h1 class="typing text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3" id="name">Brandon Sanders, CISSP</h1>
        <p class="text-base text-white/70 font-medium mb-6">
          Featured Projects · Infrastructure · Security · Engineering
        </p>
        <div class="flex flex-wrap gap-2.5 justify-center lg:justify-start">
          <a href="#projects"
             class="inline-flex items-center gap-1.5 bg-mint text-brand font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-105 transition-all shadow-lg"
             aria-label="Jump to projects">
            <i class="fa-solid fa-arrow-down text-xs"></i> View Projects
          </a>
          <a href="#" data-load-page="/Portfolio/index.php" data-scroll=""
             class="inline-flex items-center gap-1.5 border border-white/30 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 transition-all">
            <i class="fa-solid fa-arrow-left text-xs"></i> Back to Portfolio
          </a>
        </div>
      </div>

    </div>
  </div>
</header>

<!-- ═══════════════════════════════════════════════════
     PROJECTS
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-white py-16 md:py-20" id="projects">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Featured Projects</h2>
    <div class="grid md:grid-cols-2 gap-6">

      <!-- Project 1 -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-slate-800 to-brand p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-hospital"></i>
          </div>
          <div class="font-bold text-white text-sm leading-tight">IT &amp; Network Infrastructure Design — Salina Health Education Foundation</div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed p-4">
          Designed the complete IT and network infrastructure for a new healthcare facility, including network topology, segmentation strategy, server room layout, and security architecture, ensuring HIPAA compliance and operational resilience from day one.
        </p>
        <div class="flex flex-wrap gap-1.5 p-4 pt-0 mt-auto">
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Network topology &amp; segmentation design</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Server room architecture</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Security architecture</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">HIPAA-compliant design</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Redundancy &amp; failover planning</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Disaster recovery design</span>
        </div>
      </div>

      <!-- Project 2 -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-slate-800 to-brand p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-scale-balanced"></i>
          </div>
          <div class="font-bold text-white text-sm leading-tight">Risk &amp; Compliance Program — Saint Francis Ministries</div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed p-4">
          Established and contributed to a risk and compliance program across a multi-database healthcare organization, achieving HIPAA alignment and SOC 2 audit readiness while serving as an elected HIPAA committee member.
        </p>
        <div class="flex flex-wrap gap-1.5 p-4 pt-0 mt-auto">
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Risk assessments &amp; mitigation</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">HIPAA committee (elected)</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">SOC 2 audit readiness</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Policy &amp; procedure documentation</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">CEO Challenge Coin recipient</span>
        </div>
      </div>

      <!-- Project 3 -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-slate-800 to-brand p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-lock"></i>
          </div>
          <div class="font-bold text-white text-sm leading-tight">Security Modernization — Salina Health Education Foundation</div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed p-4">
          Led a targeted security modernization initiative, transitioning the organization from legacy authentication to Azure SSO with MFA and enforcing HTTPS-only policies, measurably improving the security posture.
        </p>
        <div class="flex flex-wrap gap-1.5 p-4 pt-0 mt-auto">
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Azure SSO &amp; MFA enforcement</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">HTTPS-only policy rollout</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Network segmentation</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Security baseline hardening</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Vulnerability remediation</span>
        </div>
      </div>

      <!-- Project 4 -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-slate-800 to-brand p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-network-wired"></i>
          </div>
          <div class="font-bold text-white text-sm leading-tight">Sophos NDR on Proxmox — Home Lab</div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed p-4">
          Deployed Sophos Network Detection &amp; Response (NDR) on Proxmox, overcoming undocumented compatibility and configuration challenges to run a commercial enterprise security appliance on an open-source hypervisor. Documented the full solution on GitHub to help others in the community do the same.
        </p>
        <div class="flex flex-wrap gap-1.5 p-4 pt-0 mt-auto">
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Sophos NDR</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Proxmox</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Network Detection &amp; Response</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Virtualization</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Home Lab</span>
          <span class="bg-teal-50 text-teal-800 border border-teal-200/70 text-xs font-medium px-2.5 py-1 rounded-full">Security Research</span>
        </div>
        <div class="px-4 pb-4 mt-auto">
          <a href="https://github.com/BrandonSanders48/SophosNDR-Proxmox" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-mint transition-colors">
            <i class="fa-brands fa-github text-sm"></i> View on GitHub
          </a>
        </div>
      </div>

    </div>
  </div>
</section>
