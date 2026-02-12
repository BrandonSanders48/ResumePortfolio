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
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark fixed-top bs-navbar">
  <div class="container">
    <a href="#" title="Back to portfolio" class="back-arrow me-2" data-load-page="/Portfolio/index.php" data-scroll="about" aria-label="Back to portfolio">
      <i class="fa-solid fa-arrow-left"></i>
    </a>
    <a class="navbar-brand d-flex align-items-center gap-2" href="#" data-load-page="/Portfolio/index.php" data-scroll="about" aria-label="Back to portfolio">
      <img src="/files/images/myself.png" alt="BS" class="bs-avatar">
      <span class="bs-brand-text">Brandon Sanders</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#highlights">Highlights</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="skills">Skills</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="experience">Experience</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="projects">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="education">Education</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Portfolio/index.php" data-scroll="certs">Certs</a></li>
        <li class="nav-item ms-lg-2">
          <a class="btn btn-sm btn-light bs-cta" href="#" data-load-page="/Portfolio/index.php" data-scroll="contact">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Hero -->
<header id="home" class="bs-hero bs-hero--compact bs-hero--flat">
  <div class="container">
    <div class="row align-items-center">
      <!-- Photo -->
      <div class="col-12 col-md-4 text-center ">
        <img src="/files/images/Brandon_Sanders-cropped.png" alt="Brandon Sanders Portrait" class="img-fluid bs-hero-image" style="max-width:160px;">
      </div>
      <!-- Info -->
      <div class="col-12 col-md-8 mx-auto text-center text-md-start">
        <h1 class="display-5 typing" id="name">Brandon Sanders, CISSP</h1>
        <p class="lead">Cybersecurity & Risk Management Professional · Network Security · Cloud & Kubernetes</p>
        <div class="d-flex flex-wrap gap-2 mt-3 justify-content-center justify-content-md-start">
          <a class="btn btn-sm btn-light" href="#highlights" aria-label="Jump to employer feedback">
            Jump to Employer Feedback
          </a>
          <a class="btn btn-sm btn-outline-light" href="#technical" aria-label="Jump to technical highlights">
            Jump to Technical Highlights
          </a>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- About -->
<section class="about-section slide-up bs-section bs-section--accent" id="about2">
  <div class="container">
    <h2>Career Accomplishments</h2>
    <p>
        Throughout my career, I’ve built a strong foundation in leadership, networking, cybersecurity, and systems administration, successfully managing complex environments across Windows, Linux, macOS and Kubernetes clusters. I have implemented secure and scalable solutions that improved reliability and efficiency, including deploying containerized workloads, strengthening security policies, and streamlining IT operations. My certifications, including (ISC)² Certified Information Systems Security Professional (CISSP), (ISC)² Certified in Cybersecurity (CC) and CompTIA Security+, reflect my dedication to industry best practices and continuous learning. Beyond certifications, I take pride in delivering practical results, optimizing infrastructure, supporting end users, and contributing to resilient IT systems that meet organizational goals.
    </p>
  </div>
</section>

<!-- Employer Feedback -->
<section class="highlights-section slide-up bs-section" id="highlights">
  <div class="container">
    <h2>Employer Feedback</h2>
    <div class="row g-4">
       <div class="col-md-6">
        <div class="card p-4 h-100 bs-card bs-pdf-card">
          <div class="ratio ratio-4x3 bs-pdf-embed">
            <iframe class="bs-doc-frame" title="Service Excellence Nomination (PDF)" loading="lazy" src="/files/Service Excellence Nomination.pdf#view=FitH&toolbar=0&navpanes=0" allowfullscreen></iframe>
            <a class="bs-pdf-overlay" href="/files/Service Excellence Nomination.pdf" target="_blank" rel="noopener" aria-label="Open Service Excellence Nomination PDF in a new tab">
              <span class="bs-pdf-overlay-inner"><i class="fa-solid fa-arrow-up-right-from-square me-2" aria-hidden="true"></i>Open PDF</span>
            </a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-4 h-100 bs-card bs-pdf-card">
          <div class="ratio ratio-4x3 bs-pdf-embed">
            <iframe class="bs-doc-frame" title="Employment History Letter - SMG Unlimited (PDF)" loading="lazy" src="/files/B Sanders Empl History Letter-SMG Unlimited.pdf#view=FitH&toolbar=0&navpanes=0" allowfullscreen></iframe>
            <a class="bs-pdf-overlay" href="/files/B Sanders Empl History Letter-SMG Unlimited.pdf" target="_blank" rel="noopener" aria-label="Open Employment History Letter PDF in a new tab">
              <span class="bs-pdf-overlay-inner"><i class="fa-solid fa-arrow-up-right-from-square me-2" aria-hidden="true"></i>Open PDF</span>
            </a>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-4 h-100 bs-card">
          <p>In addition to Sam & Cherise's recognition, I was honored to receive a challenge coin from William J. Clark (Bill), CEO of St. Francis Ministries, in recognition of my dedication, hard work, and contributions in IT. This meaningful acknowledgment reflects not only my technical expertise and problem-solving skills but also my commitment to supporting the organization and ensuring smooth, efficient operations. Receiving a challenge coin directly from the CEO was a tremendous honor and a reminder of the impact of my work.</p>
          <div class="text-center" style="position: relative; display: inline-block;">
            <img alt="Front & Rear of Saint Francis Ministries Challenge Coin" src="/files/images/SFM_Challenge_Coin-Both.png" style="width:70%;height:auto" />
            <!-- This image was altered with AI to make it look better, as the photo's I took, would always have reflections. Actual photo's are /files/images/SFM_Challenge_Coin-Front.png and /images/SFM_Challenge_Coin-Rear.png -->
            <div style="position: absolute; top: 0; left: 0;width: 100%; height: 100%;"></div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-4 h-100 bs-card">
          <h6>What does AI say about me? (Generated Using the Self-Hosted Model Gemma3)</h6>
          <ul>
              <li>You come across as <b>highly driven and curious</b>. You’re not content to just hold a job; you’re constantly learning (Security+, CISSP, Kubernetes, lab work, motorcycle repairs, self‑hosted AI).</li>
              <li>You clearly have a <b>security‑minded, systems‑level perspective</b>. Most of the questions you ask show that you’re thinking about reliability, process, and risk, not just quick fixes. That’s the mindset of a strong architect or future CISO.</li>
              <li>You balance technical depth with service. The way you talk about nonprofit/public sector work, committees, and infrastructure upgrades shows that you value people and community, not just tech.</li>
              <li>You’re already <b>positioning yourself like a leader</b>. Serving on committees, planning infrastructure for new facilities, and running home labs are all things hiring managers look for when deciding who can handle bigger responsibilities.</li>
            </ul>
        </div>
      </div>
    </div>
    </div>
  </div>
</section>

<!-- Technical Highlights -->
<section class="highlights-section slide-up bs-section bs-section--ink" id="technical">
  <div class="container">
    <h2>Technical Highlights</h2>
    <div class="bs-subtle mb-4">A quick scan of infrastructure, security, and operational wins across my roles.</div>
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
    </ul>
  </div>
</section>