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
     NAVBAR (Professional Highlights — with back arrow)
═══════════════════════════════════════════════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-brand/[.96] backdrop-blur-xl border-b border-white/10">
  <div class="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">

    <!-- Logo + back arrow -->
    <div class="flex items-center gap-2">
      <a href="#" title="Back to portfolio" class="back-arrow mr-1"
         data-load-page="/Portfolio/index.php" data-scroll="about" aria-label="Back to portfolio">
        <i class="fa-solid fa-arrow-left"></i>
      </a>
      <a href="#" data-load-page="/Portfolio/index.php" data-scroll="about"
         class="flex items-center gap-2.5" aria-label="Back to portfolio">
        <img src="/files/images/bs-logo.svg" alt="BS" class="w-8 h-8 rounded-lg object-cover shadow-md">
        <span class="text-white font-semibold text-sm tracking-tight">Brandon Sanders</span>
      </a>
    </div>

    <!-- Desktop nav -->
    <ul class="hidden lg:flex items-center gap-1">
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="about" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">About</a></li>
      <li><a href="#highlights" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="skills" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="experience" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="projects" class="text-white/80 hover:text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-white/10 transition-all">Projects</a></li>
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
      <li><a href="#highlights" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Highlights</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="skills" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Skills</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="experience" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Experience</a></li>
      <li><a href="#" data-load-page="/Portfolio/index.php" data-scroll="projects" class="block text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">Projects</a></li>
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
  <!-- Background blobs -->
  <div class="hidden lg:block absolute top-0 left-0 w-[600px] h-[400px] rounded-full bg-mint opacity-[0.07] blur-3xl -translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>
  <div class="hidden lg:block absolute top-0 right-0 w-[500px] h-[350px] rounded-full bg-mint-muted opacity-[0.08] blur-3xl translate-x-1/4 -translate-y-1/4 pointer-events-none" aria-hidden="true"></div>

  <div class="max-w-6xl mx-auto px-4 py-12 lg:py-16 relative z-10">
    <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

      <!-- Photo -->
      <div class="shrink-0 relative">
        <!-- Glow ring -->
        <!--<div class="absolute inset-0 rounded-full bg-mint/20 blur-2xl scale-110 pointer-events-none" aria-hidden="true"></div>-->
        <img src="/files/images/Brandon_Sanders-cropped.png"
             alt="Brandon Sanders Portrait"
             class="relative w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover border-2 border-white/15 shadow-2xl">
      </div>

      <!-- Text -->
      <div class="flex-1 text-center lg:text-left">
        <h1 class="typing text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3" id="name">Brandon Sanders, CISSP</h1>
        <p class="text-base text-white/70 font-medium mb-6">
          IT Security Leader · Risk &amp; Compliance · Infrastructure Strategy · GRC
        </p>
        <div class="flex flex-wrap gap-2.5 justify-center lg:justify-start">
          <a href="#highlights"
             class="inline-flex items-center gap-1.5 bg-mint text-brand font-bold text-sm px-5 py-2.5 rounded-full hover:brightness-105 transition-all shadow-lg"
             aria-label="Jump to employer feedback">
            <i class="fa-solid fa-arrow-down text-xs"></i> Employer Feedback
          </a>
          <a href="#technical"
             class="inline-flex items-center gap-1.5 border border-white/30 text-white/90 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 transition-all"
             aria-label="Jump to technical highlights">
            Technical Highlights
          </a>
        </div>
      </div>

    </div>
  </div>
</header>

<!-- ═══════════════════════════════════════════════════
     ABOUT / CAREER ACCOMPLISHMENTS
═══════════════════════════════════════════════════ -->
<section class="about-section slide-up bg-gradient-to-b from-[#e8f8f1] to-[#f0faf6] py-16 md:py-20" id="about2">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Career Accomplishments</h2>
    <div class="max-w-3xl">
      <p class="text-slate-700 leading-relaxed">Throughout my career, I've built a strong foundation in leadership, networking, cybersecurity, and systems administration, successfully managing complex environments across Windows, Linux, macOS and Kubernetes clusters. I have implemented secure and scalable solutions that improved reliability and efficiency, including deploying containerized workloads, strengthening security policies, and streamlining IT operations. My certifications, including (ISC)² Certified Information Systems Security Professional (CISSP), (ISC)² Certified in Cybersecurity (CC) and CompTIA Security+, reflect my dedication to industry best practices and continuous learning. Beyond certifications, I take pride in delivering practical results, optimizing infrastructure, supporting end users, and contributing to resilient IT systems that meet organizational goals.</p>
    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     EMPLOYER FEEDBACK
═══════════════════════════════════════════════════ -->
<section class="highlights-section slide-up bg-white py-16 md:py-20" id="highlights">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Employer Feedback</h2>
    <div class="grid md:grid-cols-2 gap-6">

      <!-- PDF: Service Excellence Nomination -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div class="aspect-[4/3] bs-pdf-embed">
          <iframe class="bs-doc-frame"
                  title="Service Excellence Nomination (PDF)"
                  loading="lazy"
                  src="/files/Service Excellence Nomination.pdf#view=FitH&toolbar=0&navpanes=0"
                  allowfullscreen></iframe>
          <a class="bs-pdf-overlay" href="/files/Service Excellence Nomination.pdf"
             target="_blank" rel="noopener"
             aria-label="Open Service Excellence Nomination PDF in a new tab">
            <span class="bs-pdf-overlay-inner">
              <i class="fa-solid fa-arrow-up-right-from-square mr-2" aria-hidden="true"></i>Open PDF
            </span>
          </a>
        </div>
      </div>

      <!-- PDF: Employment History Letter -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div class="aspect-[4/3] bs-pdf-embed">
          <iframe class="bs-doc-frame"
                  title="Employment History Letter - SMG Unlimited (PDF)"
                  loading="lazy"
                  src="/files/B Sanders Empl History Letter-SMG Unlimited.pdf#view=FitH&toolbar=0&navpanes=0"
                  allowfullscreen></iframe>
          <a class="bs-pdf-overlay" href="/files/B Sanders Empl History Letter-SMG Unlimited.pdf"
             target="_blank" rel="noopener"
             aria-label="Open Employment History Letter PDF in a new tab">
            <span class="bs-pdf-overlay-inner">
              <i class="fa-solid fa-arrow-up-right-from-square mr-2" aria-hidden="true"></i>Open PDF
            </span>
          </a>
        </div>
      </div>

      <!-- CEO Challenge Coin -->
      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p class="text-slate-700 text-sm leading-relaxed mb-4">In addition to Sam &amp; Cherise's recognition, I was honored to receive a challenge coin from William J. Clark (Bill), CEO of St. Francis Ministries, in recognition of my dedication, hard work, and contributions in IT. This meaningful acknowledgment reflects not only my technical expertise and problem-solving skills but also my commitment to supporting the organization and ensuring smooth, efficient operations. Receiving a challenge coin directly from the CEO was a tremendous honor and a reminder of the impact of my work.</p>
        <div class="text-center relative" style="display:inline-block; width:100%;">
          <img alt="Front &amp; Rear of Saint Francis Ministries Challenge Coin"
               src="/files/images/SFM_Challenge_Coin-Both.png"
               class="mx-auto"
               style="width:70%; height:auto;">
          <!-- This image was altered with AI to make it look better, as the photos I took would always have reflections. Actual photos are /files/images/SFM_Challenge_Coin-Front.png and /images/SFM_Challenge_Coin-Rear.png -->
          <div style="position:absolute; top:0; left:0; width:100%; height:100%;"></div>
        </div>
      </div>

      <!-- AI assessment -->
      <style>
        .ai-assessment-box .check-list li::before {
          color: #1f2a44 !important;
          background: rgba(191,243,230,0.45) !important;
          border-color: rgba(119,196,200,0.55) !important;
        }
        .ai-assessment-box .check-list li {
          border-bottom-color: rgba(119,196,200,0.25) !important;
        }
      </style>
      <div class="ai-assessment-box bg-gradient-to-br from-mint/10 to-mint-muted/5 rounded-2xl border border-mint/25 shadow-sm p-6 md:p-8">
        <div class="flex items-start gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-mint/30 flex items-center justify-center text-brand shrink-0 mt-0.5" aria-hidden="true">
            <i class="fa-solid fa-robot text-sm"></i>
          </div>
          <div>
            <div class="font-bold text-brand text-base sm:text-lg mb-1">What does AI say about me?</div>
            <div class="text-slate-500 text-xs sm:text-sm font-normal">(Generated Using the Self-Hosted Model Gemma3)</div>
          </div>
        </div>
        <ul class="check-list space-y-4" style="--check-color: #1f2a44; --check-bg: rgba(191,243,230,0.35); --check-border: rgba(119,196,200,0.5);">
          <li style="color:#1f2a44;"><strong style="color:#1f2a44;">Highly driven and curious</strong> Constantly learning beyond the job (Security+, CISSP, Kubernetes, lab work, motorcycle repairs, self-hosted AI)</li>
          <li style="color:#1f2a44;"><strong style="color:#1f2a44;">Security-minded, systems-level perspective</strong> Focuses on reliability, process, and risk rather than quick fixes. The mindset of a strong architect or future CISO</li>
          <li style="color:#1f2a44;"><strong style="color:#1f2a44;">Balances technical depth with service</strong> Values people and community in nonprofit/public sector work, committees, and infrastructure upgrades</li>
          <li style="color:#1f2a44;"><strong style="color:#1f2a44;">Already positioning as a leader</strong> Serving on committees, planning infrastructure for new facilities, and running home labs — qualities hiring managers seek</li>
        </ul>
      </div>

    </div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════
     TECHNICAL HIGHLIGHTS
═══════════════════════════════════════════════════ -->
<section class="highlights-section slide-up bs-section--ink py-16 md:py-20" id="technical">
  <div class="max-w-6xl mx-auto px-4">
    <h2 class="section-heading">Technical Highlights</h2>
    <p class="text-white/65 text-sm mb-6">A quick scan of infrastructure, security, and operational wins across my roles.</p>
    <ul class="accomplishments">
      <li>Successfully deployed new Layer 2 switches across multiple networking closets, optimizing performance and stability.</li>
      <li>Led a complete cabling initiative, introducing color-coded patching for improved organization and efficiency.</li>
      <li>Designed and implemented a solution to integrate a modern phone system with existing infrastructure.</li>
      <li>Identified gaps in the core network design and led the implementation of new core switches to resolve them.</li>
      <li>Established firewall protections for disaster recovery environments, addressing a previously overlooked security requirement.</li>
      <li>Advocated for the deployment of additional firewalls and redundant cores to strengthen resilience.</li>
      <li>Reconfigured legacy equipment for redundancy, maximizing use of existing resources.</li>
      <li>Resolved access point wiring and channel overlap issues to improve wireless reliability.</li>
      <li>Configured trunking and VLAN routing for access points to enhance segmentation.</li>
      <li>Identified and remediated firewall vulnerabilities, refining rulesets for efficiency.</li>
      <li>Installed new security cameras with custom-designed mounts for optimized placement.</li>
      <li>Standardized Wi-Fi SSIDs and credentials across all sites for ease of use.</li>
      <li>Implemented a secure BYOD wireless solution.</li>
      <li>Upgraded end-of-life virtual machines and addressed networking issues inherited from older setups.</li>
      <li>Deployed advanced DNS and network detection tools for stronger defense.</li>
      <li>Upgraded the ticketing system for improved security, reliability, and user experience.</li>
      <li>Streamlined VPN configuration with DDNS and simplified setup.</li>
      <li>Maintained thorough, up-to-date documentation for system operations.</li>
      <li>Replaced legacy remote devices with modern site-to-site VPN connections.</li>
      <li>Proposed and implemented solutions to resolve internet reliability issues in remote facilities.</li>
      <li>Overhauled conference room networking to increase reliability and security.</li>
      <li>Designed a dedicated VLAN for isolating compromised or internet-only devices.</li>
      <li>Ensured proactive patching and version updates across infrastructure.</li>
      <li>Developed a flexible phone VLAN solution allowing computers and phones to share wall ports securely.</li>
      <li>Expanded VLANs to accommodate network growth.</li>
      <li>Automated printer deployment using Active Directory group policies.</li>
      <li>Resolved IP conflicts and optimized address management.</li>
      <li>Recommended and executed a successful migration to a new primary ISP.</li>
      <li>Established redundant DHCP servers for improved availability.</li>
      <li>Resolved fax and VoIP issues with appliance reconfiguration.</li>
      <li>Created a vendor Wi-Fi login system with rotating credentials for security.</li>
      <li>Resolved domain-related bugs in Windows 11 deployments.</li>
      <li>Configured multicast routing with rendezvous points for efficient data delivery.</li>
      <li>Upgraded critical network links to fiber to prevent electrical interference.</li>
      <li>Assisted in implementing and configuring a modern enterprise phone system.</li>
      <li>Developed website updates that reduced operating costs.</li>
      <li>Enhanced security by hardening Active Directory authentication methods.</li>
      <li>Redesigned and streamlined the IT helpdesk system.</li>
      <li>Deployed firewall solutions with cellular backup for business continuity.</li>
      <li>Established a secure VPN infrastructure for external connectivity.</li>
      <li>Restricted excessive computer joins to the domain, tightening security controls.</li>
      <li>Developed IT security policies and procedures for ongoing governance.</li>
      <li>Resolved SIP and routing issues with carrier equipment for seamless VoIP and faxing.</li>
      <li>Implemented encryption solutions for portable storage media.</li>
      <li>Enhanced ticketing system automation to process email replies efficiently.</li>
      <li>Enabled DNS logging for network-wide monitoring.</li>
      <li>Upgraded client machines to Windows 11 with full encryption support.</li>
      <li>Added new VLANs to virtualization environments for improved segmentation.</li>
      <li>Integrated MFA solutions at network entry points and VPN gateways.</li>
      <li>Resolved legacy Active Directory misconfigurations related to account permissions.</li>
      <li>Implemented domain-wide remote assistance for administrators.</li>
      <li>Addressed deprovisioning gaps with third-party accounts.</li>
      <li>Integrated security certificates into group policies for HTTPS inspection.</li>
      <li>Established a central group policy store for consistency.</li>
      <li>Configured syslog forwarding for centralized monitoring.</li>
      <li>Transitioned ticketing system to new hosting with SSL support.</li>
      <li>Enabled user self-service portals in security platforms to reduce IT overhead.</li>
      <li>Integrated identity management platforms with single sign-on.</li>
      <li>Deployed encrypted configuration backups for critical systems.</li>
      <li>Standardized DNS naming conventions to streamline certificate deployment.</li>
      <li>Implemented UPS monitoring and alerting across primary and DR environments.</li>
      <li>Established an MDM solution for managing mobile devices using existing infrastructure.</li>
      <li>Introduced ISP redundancy with automatic failover for critical services.</li>
      <li>Developed a custom tool for Wi-Fi vendor account management with alerting and remote access features.</li>
      <li>Optimized server drive layouts for better performance.</li>
      <li>Negotiated savings on enterprise software renewals.</li>
      <li>Deployed secure and modernized sign-on solutions for cloud services.</li>
      <li>Integrated hybrid identity for seamless authentication between cloud and on-premises systems.</li>
      <li>Deployed password management solutions for local accounts.</li>
      <li>Restricted unauthorized device joins in the cloud directory.</li>
      <li>Improved synchronization tools between cloud and on-premises directories.</li>
      <li>Advocated for organization-wide MFA adoption.</li>
      <li>Modernized legacy systems by building secure web redirection portals.</li>
      <li>Optimized licensing, saving thousands annually.</li>
      <li>Upgraded virtualization and Windows Server environments.</li>
      <li>Strengthened SMB protocol security across file servers.</li>
      <li>Upgraded network adapters for higher throughput.</li>
      <li>Implemented secure digital signage on segmented networks.</li>
      <li>Enhanced email security by updating policies (SPF, DKIM, DMARC).</li>
      <li>Strengthened encryption protocols across directory controllers.</li>
      <li>Rotated sensitive account credentials to close long-standing gaps.</li>
      <li>Integrated phishing defense and user-awareness platforms.</li>
      <li>Transitioned patch management from legacy WSUS to a modern RMM solution.</li>
      <li>Automated OS deployment for new workstations.</li>
      <li>Deployed centralized MDM/RMM for monitoring and policy enforcement.</li>
      <li>Redesigned VPN solution with SSO integration.</li>
      <li>Deployed read-only domain controllers at remote sites.</li>
      <li>Adopted modern conditional access policies to enforce location-based security.</li>
      <li>Implemented advanced vulnerability scanning and remediation for domain environments.</li>
      <li>This list is not comprehensive but highlights some key achievements in IT infrastructure and security.</li>
    </ul>
  </div>
</section>
