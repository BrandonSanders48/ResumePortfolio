<?php
    // Turn off display of errors/warnings to users
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);

    // Report all errors internally (so they still appear in server logs)
    error_reporting(E_ALL);

    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block"); // legacy but still useful
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
     NAVBAR
═══════════════════════════════════════════════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-brand/[.96] backdrop-blur-xl border-b border-white/10">
  <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

    <!-- Logo -->
    <a href="#home" class="flex items-center gap-2.5" aria-label="Home">
      <img src="/files/images/myself.png" alt="BS" class="w-8 h-8 rounded-lg object-cover shadow-md">
      <span class="text-white font-semibold text-sm tracking-tight">Brandon Sanders</span>
    </a>

    <!-- Desktop nav links -->
    <ul class="hidden lg:flex items-center gap-1">
      <li><a href="#about" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">About</a></li>
      <li><a href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#skills" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#experience" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#projects" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#education" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Education</a></li>
      <li><a href="#certs" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Certs</a></li>
      <li class="ml-2">
        <a href="#contact" class="rounded-full bg-mint text-brand font-bold text-sm px-4 py-2 hover:brightness-105 transition-all shadow-md">Contact</a>
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
      <li><a href="#about" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">About</a></li>
      <li><a href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#skills" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#experience" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#projects" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Projects</a></li>
      <li><a href="#education" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Education</a></li>
      <li><a href="#certs" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Certs</a></li>
      <li class="pt-1">
        <a href="#contact" class="block rounded-full bg-mint text-brand font-bold text-sm px-4 py-2 text-center hover:brightness-105 transition-all">Contact</a>
      </li>
    </ul>
  </div>
</nav>

<!-- ═══════════════════════════════════════════════════
     HERO
═══════════════════════════════════════════════════ -->
<header id="home" class="bg-brand pt-16 overflow-hidden relative">
  <!-- Background blobs -->
  <div class="absolute top-0 left-0 w-[700px] h-[500px] rounded-full bg-mint opacity-[0.07] blur-3xl -translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>
  <div class="absolute top-0 right-0 w-[600px] h-[450px] rounded-full bg-mint-muted opacity-[0.08] blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>

  <div class="max-w-6xl mx-auto px-4 py-16 lg:py-24 relative z-10">
    <div class="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

      <!-- Text column -->
      <div class="flex-1 text-center lg:text-left order-2 lg:order-1">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 bg-white/10 border border-white/18 rounded-full px-3 py-1.5 mb-5">
          <span class="relative flex h-2.5 w-2.5 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
          </span>
          <span class="text-white/85 text-xs sm:text-sm font-semibold tracking-wide">Open to Opportunities</span>
        </div>

        <!-- Name -->
        <h1 class="typing text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4" id="name">Brandon Sanders, CISSP</h1>

        <!-- Tagline -->
        <p class="text-base lg:text-lg text-white/70 font-medium mb-6 max-w-xl mx-auto lg:mx-0">
          IT Security Leader &amp; Manager · Risk &amp; Compliance · Infrastructure Strategy · GRC
        </p>

        <!-- Chips -->
        <div class="flex flex-wrap gap-2 justify-center lg:justify-start mb-7">
          <span class="bg-white/10 border border-white/18 text-white/85 text-xs font-medium px-3 py-1.5 rounded-full">Salina, KS</span>
          <span class="bg-mint/20 border border-mint/30 text-mint/90 text-xs font-semibold px-3 py-1.5 rounded-full">IT Manager / CISO Track</span>
          <span class="bg-white/10 border border-white/18 text-white/85 text-xs font-medium px-3 py-1.5 rounded-full">(ISC)² CISSP</span>
          <span class="bg-white/10 border border-white/18 text-white/85 text-xs font-medium px-3 py-1.5 rounded-full">CompTIA Security+</span>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-wrap gap-2.5 justify-center lg:justify-start">
          <a href="https://www.linkedin.com/in/brandonsanders48" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1.5 border border-white/30 text-white/90 text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all">
            <i class="fa-brands fa-linkedin-in text-xs"></i> LinkedIn
          </a>
          <a href="https://github.com/brandonsanders48" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1.5 border border-white/30 text-white/90 text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all">
            <i class="fa-brands fa-github text-xs"></i> GitHub
          </a>
          <a href="https://www.credly.com/users/brandonsanders" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1.5 border border-white/30 text-white/90 text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all">
            <i class="fa-solid fa-award text-xs"></i> Credly
          </a>
          <a href="#contact"
             class="inline-flex items-center gap-1.5 bg-mint text-brand font-bold text-sm px-5 py-2 rounded-full hover:brightness-105 transition-all shadow-lg">
            <i class="fa-solid fa-envelope text-xs"></i> Contact
          </a>
        </div>
      </div>

      <!-- Photo column -->
      <div class="order-1 lg:order-2 shrink-0 relative">
        <!-- Glow ring -->
        <div class="absolute inset-0 rounded-full bg-mint/20 blur-2xl scale-110 pointer-events-none" aria-hidden="true"></div>
        <img src="/files/images/Brandon_Sanders-cropped.png"
             alt="Brandon Sanders Portrait"
             class="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-64 lg:h-64 rounded-full object-cover border-2 border-white/15 shadow-2xl">
      </div>

    </div>
  </div>
</header>

<!-- ═══════════════════════════════════════════════════
     METRICS STRIP
═══════════════════════════════════════════════════ -->
<div class="bs-metrics-strip slide-up">
  <div class="max-w-6xl mx-auto px-4">
    <div class="bs-metrics-row">
      <div class="bs-metric">
        <span class="bs-metric-value">5+</span>
        <span class="bs-metric-label">Years IT Leadership</span>
      </div>
      <div class="bs-metric-divider"></div>
      <div class="bs-metric">
        <span class="bs-metric-value">3</span>
        <span class="bs-metric-label">Organizations Secured</span>
      </div>
      <div class="bs-metric-divider"></div>
      <div class="bs-metric">
        <span class="bs-metric-value">HIPAA</span>
        <span class="bs-metric-label">&amp; SOC 2 Compliance</span>
      </div>
      <div class="bs-metric-divider"></div>
      <div class="bs-metric">
        <span class="bs-metric-value">3</span>
        <span class="bs-metric-label">Governance Committees</span>
      </div>
      <div class="bs-metric-divider"></div>
      <div class="bs-metric">
        <span class="bs-metric-value">CISSP</span>
        <span class="bs-metric-label">Certified · CISM Pursuing</span>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     ABOUT
═══════════════════════════════════════════════════ -->
<section class="about-section slide-up bg-gradient-to-b from-[#e8f8f1] to-[#f0faf6] py-16 md:py-20" id="about">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">About</h2>
    <div class="max-w-3xl">
      <p class="text-slate-700 leading-relaxed mb-4">I'm an IT and cybersecurity leader with a track record of building secure, compliant, and resilient technology environments across healthcare and nonprofit organizations. I bridge technical depth with strategic oversight, translating organizational risk into policy, leading cross-functional security committees, and driving initiatives that align IT operations with business goals and regulatory requirements.</p>
      <p class="text-slate-700 leading-relaxed mb-4">In my current role, I serve as the IT lead for a multi-site healthcare organization, managing infrastructure strategy, security operations, and compliance programs while sitting on the Safety and Security Committees to contribute to governance at the organizational level. I have delivered full-scope IT programs from design through implementation, including new facility buildouts, security modernization initiatives, and disaster recovery planning.</p>
      <p class="text-slate-700 leading-relaxed mb-6">I hold the CISSP designation and am actively pursuing CISM to deepen my security management expertise. I am seeking IT Manager and CISO-track opportunities where I can combine technical credibility with risk leadership to protect the organization and enable the business.</p>
      <div class="text-center">
        <button data-load-page="/Professional-Highlights/index.php" data-scroll=""
                class="rounded-full bg-brand text-white font-semibold text-sm px-6 py-3 hover:brightness-110 transition-all shadow-md">
          Professional Highlights
        </button>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     CISSP BANNER
═══════════════════════════════════════════════════ -->
<div class="cissp-banner slide-up" role="status" aria-label="Security certifications and career focus">
  <div class="cissp-items">
    <span class="cissp-item">CISSP Certified</span>
    <span class="cissp-separator" aria-hidden="true">·</span>
    <span class="cissp-item">Pursuing CISM</span>
    <span class="cissp-separator" aria-hidden="true">·</span>
    <span class="cissp-item">Targeting IT Manager &amp; CISO Roles</span>
    <span class="cissp-separator" aria-hidden="true">·</span>
    <span class="cissp-item">Available for Leadership Opportunities</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════
     PROFESSIONAL HIGHLIGHTS CALLOUT
═══════════════════════════════════════════════════ -->
<section class="slide-up py-12 md:py-16 bg-white" id="highlights-callout" aria-label="Professional highlights">
  <div class="max-w-6xl mx-auto px-4">
    <div class="bg-[#0c1323] rounded-2xl border border-white/10 p-6 md:p-8">
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">

        <!-- Left -->
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-mint shrink-0" aria-hidden="true">
              <i class="fa-solid fa-award text-lg"></i>
            </div>
            <div>
              <h3 class="text-white font-bold text-lg leading-tight">Professional Highlights</h3>
            </div>
          </div>
          <div class="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-3"></div>
          <p class="text-white/65 text-sm leading-relaxed">Employer feedback, impact stories, and technical wins. If you only have a minute, start here, it's the fastest way to understand the scope of my work.</p>
        </div>

        <!-- Right -->
        <div class="shrink-0">
          <a href="#" data-load-page="/Professional-Highlights/index.php" data-scroll=""
             class="inline-block rounded-full bg-mint text-brand font-bold text-sm px-6 py-3 hover:brightness-105 transition-all shadow-lg">
            View Highlights
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     SKILLS
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-white py-16 md:py-20" id="skills">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Skills</h2>
    <div class="grid md:grid-cols-3 gap-6">

      <!-- Leadership & Governance -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
        <div class="bg-gradient-to-br from-mint to-mint-muted p-4 flex items-center gap-3 min-h-[88px]">
          <div class="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-brand text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-users-gear"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Leadership &amp; Governance</div>
            <div class="text-brand/65 text-xs">Strategy, risk oversight, and organizational alignment</div>
          </div>
        </div>
        <div class="p-5 flex-1">
          <ul class="check-list">
            <li>IT Strategy &amp; Program Management</li>
            <li>Risk Management &amp; Governance (GRC)</li>
            <li>HIPAA, SOC 2, NIST Framework Alignment</li>
            <li>Security Policy &amp; Procedure Development</li>
            <li>Vendor Management &amp; Contract Negotiation</li>
            <li>Stakeholder Communication &amp; Executive Reporting</li>
            <li>Safety &amp; Security Committee Leadership</li>
            <li>Technology Procurement &amp; Budget Planning</li>
            <li>Audit Readiness &amp; Regulatory Compliance</li>
            <li>Cross-Functional Collaboration</li>
            <li>IT Governance &amp; Change Management</li>
          </ul>
        </div>
      </div>

      <!-- Security & Risk Operations -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
        <div class="bg-gradient-to-br from-mint to-mint-muted p-4 flex items-center gap-3 min-h-[88px]">
          <div class="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-brand text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Security &amp; Risk Operations</div>
            <div class="text-brand/65 text-xs">CISSP-aligned security program management</div>
          </div>
        </div>
        <div class="p-5 flex-1">
          <ul class="check-list">
            <li>Cybersecurity Program Management</li>
            <li>Incident Response &amp; Forensics</li>
            <li>Vulnerability Assessment &amp; Remediation</li>
            <li>Network Security Architecture</li>
            <li>Identity &amp; Access Management (IAM / SSO / MFA)</li>
            <li>Security Hardening &amp; Patch Management</li>
            <li>SIEM &amp; Log Analysis (Elastic, Graylog)</li>
            <li>Disaster Recovery &amp; Business Continuity</li>
            <li>Cloud Security (Azure, M365, Entra ID)</li>
            <li>Endpoint Security &amp; MDM (Intune)</li>
            <li>Data Classification &amp; Protection</li>
          </ul>
        </div>
      </div>

      <!-- Technical Infrastructure -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
        <div class="bg-gradient-to-br from-mint to-mint-muted p-4 flex items-center gap-3 min-h-[88px]">
          <div class="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-brand text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-server"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Technical Infrastructure</div>
            <div class="text-brand/65 text-xs">Hands-on expertise across network, cloud, and systems</div>
          </div>
        </div>
        <div class="p-5 flex-1">
          <ul class="check-list">
            <li><strong>Network &amp; Security:</strong> pfSense, Fortinet, Sophos, Cisco, VLANs, BGP</li>
            <li><strong>Microsoft Ecosystem:</strong> M365, Exchange, Entra ID, WSUS, Intune, MDT</li>
            <li><strong>Virtualization &amp; Backup:</strong> Proxmox, VMware, Veeam, TrueNAS</li>
            <li><strong>Cloud &amp; Containers:</strong> Azure, Kubernetes (6-node HA), Docker, Ansible</li>
            <li><strong>Monitoring:</strong> Prometheus, Grafana, Elastic SIEM, Graylog</li>
            <li><strong>Scripting &amp; Automation:</strong> PowerShell, Bash, Git</li>
            <li><strong>Databases:</strong> Microsoft SQL, MySQL</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     EXPERIENCE
═══════════════════════════════════════════════════ -->
<style>
  /* Each item is a flex row: [dot+line col] [card] */
  #experience .experience-list {
    display: flex;
    flex-direction: column;
  }

  #experience .experience-item {
    display: flex;
    gap: 1.25rem;
  }

  /* Left column: dot on top, line stretches down to fill */
  #experience .timeline-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 1rem;
  }

  #experience .tl-dot {
    width: 0.875rem;
    height: 0.875rem;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #6ee7b7;
    flex-shrink: 0;
    margin-top: 1.15rem;
    box-sizing: border-box;
  }

  #experience .tl-line {
    width: 2px;
    background: #bbf7d0;
    flex: 1;
    margin-top: 4px;
  }

  /* No line after the last item */
  #experience .experience-item:last-child .tl-line {
    display: none;
  }

  /* Card fills remaining width; bottom padding creates spacing between cards */
  #experience .tl-card {
    flex: 1;
    padding-bottom: 1.5rem;
  }

  #experience .experience-item:last-child .tl-card {
    padding-bottom: 0;
  }
</style>

<section class="slide-up bg-slate-50 py-16 md:py-20" id="experience">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Experience</h2>
    <div class="experience-timeline">
      <div class="experience-list">

      <!-- Current role -->
      <article class="experience-item">
        <div class="timeline-col">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 class="font-bold text-brand text-[0.95rem]">Network Administrator — Salina Family Healthcare Center</h3>
              <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">2023 – Present</span>
            </div>
            <ul class="check-list">
              <li>Own end-to-end IT operations and security program for a multi-site healthcare organization, ensuring compliance, uptime, and alignment with organizational risk posture.</li>
              <li>Elected to both the Safety Committee and Security Committee, contributing to governance, risk oversight, and policy decisions at the organizational level.</li>
              <li>Led a security modernization initiative, transitioning to Azure SSO with MFA enforcement and HTTPS-only policies, measurably reducing credential and access-related risk.</li>
              <li>Designed and delivered the complete IT infrastructure for a new healthcare facility, from network topology and server room design through endpoint provisioning and disaster recovery.</li>
              <li>Developed and implemented disaster recovery and business continuity plans, improving organizational resilience and reducing recovery time objectives.</li>
              <li>Negotiated vendor contracts and managed technology procurement, balancing cost, compliance requirements, and long-term operational needs.</li>
              <li>Integrated and secured VoIP and telephony systems, maintaining regulatory compliance and operational continuity throughout the transition.</li>
              <li>Proactively identified and remediated vulnerabilities across the network and endpoint environment, maintaining a strong and measurable security baseline.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="experience-item">
        <div class="timeline-col">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 class="font-bold text-brand text-[0.95rem]">Systems Administrator — Salina Public Library</h3>
              <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">2022 – 2023</span>
            </div>
            <ul class="check-list">
              <li>Managed IT systems, servers, storage, and client fleet for a public institution, ensuring reliable service delivery across all departments.</li>
              <li>Upgraded and modernized infrastructure, improving coverage, performance, and enforcing updated security policies.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="experience-item">
        <div class="timeline-col">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 class="font-bold text-brand text-[0.95rem]">Cybersecurity Analyst — Saint Francis Ministries</h3>
              <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">2021 – 2022</span>
            </div>
            <ul class="check-list">
              <li>Elected to the HIPAA Committee, collaborating cross-functionally to align data handling and privacy practices with regulatory requirements.</li>
              <li>Managed security across a multi-site environment, conducting risk assessments and remediating vulnerabilities to protect sensitive organizational data.</li>
              <li>Developed and enforced data protection policies for data in transit and at rest, aligned with HIPAA, SOC 2, and industry best practices.</li>
              <li>Contributed to compliance audit readiness, policy documentation, and internal security reviews.</li>
              <li>Recognized with the CEO Challenge Coin for outstanding contributions to organizational security and compliance.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="experience-item">
        <div class="timeline-col">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 class="font-bold text-brand text-[0.95rem]">Network Administrator — SMG Unlimited</h3>
              <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">2020 – 2021</span>
            </div>
            <ul class="check-list">
              <li>Administered network infrastructure and provided technical support across the organization, resolving issues and maintaining operational continuity.</li>
              <li>Managed work orders, support tickets, and network problem resolution.</li>
              <li>Configured and maintained firewalls and network security appliances.</li>
              <li>Supported technology upgrade and network expansion projects.</li>
            </ul>
          </div>
        </div>
      </article>

      <article class="experience-item">
        <div class="timeline-col">
          <div class="tl-dot"></div>
          <div class="tl-line"></div>
        </div>
        <div class="tl-card">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 class="font-bold text-brand text-[0.95rem]">IT Intern — Blue Beacon International</h3>
              <span class="px-2.5 py-1 rounded-full bg-mint/15 border border-mint/30 text-brand text-xs font-semibold">2013 – 2016</span>
            </div>
            <ul class="check-list">
              <li>Provided hardware, OS, and application support across the organization.</li>
              <li>Diagnosed and resolved technical issues; managed equipment repairs and servicing.</li>
              <li>Completed additional IT projects as assigned.</li>
            </ul>
          </div>
        </div>
      </article>

    </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     PROJECTS
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-white py-16 md:py-20" id="projects">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Featured Projects</h2>
    <div class="grid md:grid-cols-3 gap-6">

      <!-- Project 1 -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <div class="bg-gradient-to-br from-slate-800 to-brand p-4 flex items-center gap-3 rounded-t-2xl">
          <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-mint text-lg shrink-0" aria-hidden="true">
            <i class="fa-solid fa-hospital"></i>
          </div>
          <div class="font-bold text-white text-sm leading-tight">IT &amp; Network Infrastructure Design — Salina Family Healthcare Center</div>
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
          <div class="font-bold text-white text-sm leading-tight">Security Modernization — Salina Family Healthcare Center</div>
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

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     EDUCATION
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-[#f0faf6] py-16 md:py-20" id="education">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Education</h2>
    <div class="grid md:grid-cols-2 gap-6">

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center text-brand shrink-0" aria-hidden="true">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Salina Central High School</div>
            <div class="text-slate-500 text-xs">High School Diploma · 2014</div>
          </div>
        </div>
        <p class="text-slate-600 text-sm leading-relaxed">My formal education is a high school diploma. My cybersecurity and IT expertise has been built through hands-on professional experience, certifications, continuous self-study, and lab work (including a high-availability Kubernetes environment).</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div class="font-bold text-brand text-[0.95rem] mb-3">Professional Development</div>
        <div class="flex flex-wrap gap-2">
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-3 py-1.5 rounded-full">IT Leadership</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-3 py-1.5 rounded-full">Cybersecurity</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-3 py-1.5 rounded-full">GRC &amp; Risk</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-3 py-1.5 rounded-full">Systems &amp; Network Engineering</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-3 py-1.5 rounded-full">Cloud &amp; Kubernetes</span>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     CERTIFICATIONS
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-white py-16 md:py-20" id="certs">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Certifications</h2>
    <div class="grid md:grid-cols-3 gap-6 mb-6">

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-2">
          <div class="font-bold text-brand text-lg">CISSP</div>
          <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">(ISC)²</span>
        </div>
        <div class="text-slate-500 text-sm mb-4">Certified Information Systems Security Professional</div>
        <div class="flex flex-wrap gap-1.5">
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Risk</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Security Strategy</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Architecture</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-2">
          <div class="font-bold text-brand text-lg">CC</div>
          <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">(ISC)²</span>
        </div>
        <div class="text-slate-500 text-sm mb-4">Certified in Cybersecurity</div>
        <div class="flex flex-wrap gap-1.5">
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Foundations</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Security Controls</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Best Practices</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-2">
          <div class="font-bold text-brand text-lg">Security+</div>
          <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">CompTIA</span>
        </div>
        <div class="text-slate-500 text-sm mb-4">Baseline cybersecurity knowledge and operations</div>
        <div class="flex flex-wrap gap-1.5">
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Ops</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Defense</span>
          <span class="bg-mint/15 border border-mint/30 text-brand text-xs font-medium px-2.5 py-1 rounded-full">Incidents</span>
        </div>
      </div>

    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-slate-500 text-sm">More certifications and verifications on Credly.</p>
      <a href="https://www.credly.com/users/brandonsanders" target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 border border-slate-300 text-slate-700 text-sm font-semibold px-5 py-2 rounded-full hover:bg-slate-50 transition-all">
        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
        View on Credly
      </a>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     CONTACT
═══════════════════════════════════════════════════ -->
<section class="slide-up bg-[#f0faf6] py-16 md:py-20" id="contact">
  <div class="max-w-6xl mx-auto px-4">

    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="section-heading">Contact</h2>
        <p class="text-slate-600 text-sm">Send a message and I'll get back to you. I'm happy to provide my resume upon request.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <span class="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">Leadership &amp; management inquiries welcome</span>
        <span class="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">Based in Salina, KS · Remote-friendly</span>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">

      <!-- Contact form -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center text-brand shrink-0" aria-hidden="true">
            <i class="fa-solid fa-paper-plane"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Send a message</div>
            <div class="text-slate-500 text-xs">Short and simple is perfect.</div>
          </div>
        </div>

        <form method="post" id="contactForm" class="flex flex-col gap-4">
          <div id="form-alert" style="display:none;"></div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="bs_name" class="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input type="text" id="bs_name" name="bs_name" class="form-input" placeholder="Your name" autocomplete="name" required>
            </div>
            <div>
              <label for="bs_email" class="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" id="bs_email" name="bs_email" class="form-input" placeholder="your@email.com" autocomplete="email" required>
            </div>
          </div>
          <div>
            <label for="bs_company" class="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
            <input type="text" id="bs_company" name="bs_company" class="form-input" placeholder="Organization" autocomplete="organization" required>
          </div>
          <div>
            <label for="bs_message" class="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
            <textarea id="bs_message" name="bs_message" maxlength="500" class="form-input" placeholder="Your message…" required></textarea>
          </div>

          <div class="bs-captcha">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-lg bg-mint/20 flex items-center justify-center text-brand shrink-0" aria-hidden="true">
                <i class="fa-solid fa-shield text-sm"></i>
              </div>
              <div>
                <div class="text-sm font-semibold text-slate-700">Anti-spam check</div>
                <div class="text-xs text-slate-500">What are my initials?</div>
              </div>
            </div>
            <input type="text" class="form-input" id="captcha" name="captcha" placeholder="Initials" autocomplete="off" required>
          </div>

          <button type="submit"
                  class="w-full rounded-full bg-brand text-white py-3 font-semibold text-sm hover:brightness-105 transition-all shadow-md">
            Send Message
          </button>
        </form>
      </div>

      <!-- Location -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center text-brand shrink-0" aria-hidden="true">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-[0.95rem]">Location</div>
            <div class="text-slate-500 text-xs">Salina, KS</div>
          </div>
        </div>
        <div class="aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bs-map-frame flex-1">
          <iframe title="Map of Salina, KS"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.548548582053!2d-97.6092919846236!3d38.840104979583026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87a61fd5f457e5b1%3A0x35a6b9f7ab5b1b2b!2sSalina%2C%20KS%2067451!5e0!3m2!1sen!2sus!4v1695156000000!5m2!1sen!2sus"
                  loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        </div>
        <p class="text-slate-500 text-sm mt-4">Open to IT Manager, CISO, and senior cybersecurity leadership opportunities. Remote-friendly.</p>
      </div>

    </div>
  </div>
</section>
