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
     NAVBAR (Volunteer — with back arrow)
═══════════════════════════════════════════════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-brand/[.96] backdrop-blur-xl border-b border-white/10">
  <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

    <!-- Logo + back arrow -->
    <div class="flex items-center gap-2">
      <a href="#" title="Back to portfolio" class="back-arrow mr-1"
         data-load-page="/Portfolio/index.php" data-scroll="volunteer" aria-label="Back to portfolio">
        <i class="fa-solid fa-arrow-left"></i>
      </a>
      <a href="#" data-load-page="/Portfolio/index.php" data-scroll="volunteer"
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
      <li><a href="#" data-load-page="/Projects/index.php" data-scroll="" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#volunteer" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Volunteer</a></li>
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
      <li><a href="#" data-load-page="/Projects/index.php" data-scroll="" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#volunteer" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Volunteer</a></li>
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
          Volunteer Work · (ISC)² · Center for Cyber Safety and Education
        </p>
        <div class="flex flex-wrap gap-2.5 justify-center lg:justify-start">
          <a href="#volunteer"
             class="inline-flex items-center gap-1.5 bg-mint text-brand font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-105 transition-all shadow-lg"
             aria-label="Jump to volunteer work">
            <i class="fa-solid fa-arrow-down text-xs"></i> View Volunteer Work
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
     VOLUNTEER WORK
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-white py-16 md:py-20" id="volunteer">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Volunteer Work</h2>
    <p class="text-slate-500 text-sm mb-8 -mt-2">Contributing to the cybersecurity community through education, scholarships, and workforce development.</p>
    <div class="grid md:grid-cols-2 gap-6">

      <!-- ISC2 Code Taskforce -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-brand to-brand-light p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-earth-americas"></i>
          </div>
          <div>
            <div class="font-bold text-white text-sm leading-tight">Code Taskforce Member</div>
            <div class="text-white/70 text-xs mt-0.5">(ISC)²</div>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">Mar 2026 – Present</span>
            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">Science &amp; Technology</span>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed flex-1">As a Code Taskforce Member with (ISC)², the world's leading cybersecurity professional organization, I volunteer my time and expertise toward expanding access to cybersecurity education globally. This work reflects my belief that a stronger, more diverse cybersecurity workforce benefits everyone.</p>
        </div>
      </div>

      <!-- Center for Cyber Safety Scholarship Committee -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-brand to-brand-light p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div class="font-bold text-white text-sm leading-tight">Scholarship Review Committee</div>
            <div class="text-white/70 text-xs mt-0.5">Center for Cyber Safety and Education</div>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">Mar 2026 – Present</span>
            <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">Science &amp; Technology</span>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed flex-1">Serve as a volunteer reviewer for the Center for Cyber Safety and Education's scholarship program, evaluating and ranking candidates to help identify deserving recipients. Contribute cybersecurity industry expertise to support the Center's mission of advancing education and awareness in the field.</p>
        </div>
      </div>

    </div>
  </div>
</section>
