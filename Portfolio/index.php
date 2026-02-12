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
    <a class="navbar-brand d-flex align-items-center gap-2" href="#home" aria-label="Home">
      <img src="/files/images/myself.png" alt="BS" class="bs-avatar">
      <span class="bs-brand-text">Brandon Sanders</span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="">Highlights</a></li>
        <li class="nav-item"><a class="nav-link" href="#skills">Skills</a></li>
        <li class="nav-item"><a class="nav-link" href="#experience">Experience</a></li>
        <li class="nav-item"><a class="nav-link" href="#projects">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="#education">Education</a></li>
        <li class="nav-item"><a class="nav-link" href="#certs">Certs</a></li>
        <li class="nav-item ms-lg-2">
          <a class="btn btn-sm btn-light bs-cta" href="#contact">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Hero -->
<header id="home" class="bs-hero bs-hero--flat">
  <div class="container">
    <div id="form-alert" style="display:none; margin-top:10px;"></div>
    <div class="row align-items-center">
      <div class="col-12 col-md-4 text-center mb-4 mb-md-0">
        <img src="/files/images/Brandon_Sanders-cropped.png" alt="Brandon Sanders Portrait" class="img-fluid bs-hero-image">
      </div>
      <div class="col-12 col-md-8 mx-auto text-center text-md-start">
        <h1 class="display-5 typing" id="name">Brandon Sanders, CISSP</h1>
        <p class="lead">
          Cybersecurity & Risk Management Professional · Network Security · Cloud & Kubernetes
        </p>
        <div class="mb-3">
          <span class="chip bs-chip">Salina, KS</span>
          <span class="chip bs-chip">Open to Opportunities</span>
          <span class="chip bs-chip">(ISC)² CISSP</span>
          <span class="chip bs-chip">(ISC)² CC</span>
          <span class="chip bs-chip">CompTIA Security+</span>
        </div>
        <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          <a href="https://www.linkedin.com/in/brandonsanders48" target="_blank" rel="noopener" class="btn btn-outline-light btn-sm">
            LinkedIn
          </a>
          <a href="https://github.com/brandonsanders48" target="_blank" rel="noopener" class="btn btn-outline-light btn-sm">
            GitHub
          </a>
          <a href="https://www.credly.com/users/brandonsanders" target="_blank" rel="noopener" class="btn btn-outline-light btn-sm">
            Credly
          </a>
          <a href="#contact" class="btn btn-light btn-sm">
            Contact
          </a>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- About -->
<section class="about-section slide-up bs-section bs-section--accent" id="about">
  <div class="container">
    <h2>
      About
    </h2>
   <!-- <p>
      I am Cybersecurity focused with extensive experience in Information Technology
      with multiple
      <a href="#certs" style="color:#333">Certifications</a>.
      I am highly skilled in application administration, security and compliance,
      as well as system analysis, process building, and troubleshooting procedures.
      I evaluate existing systems and programs to identify inefficiencies and
      vulnerabilities, implementing strategic program upgrades to reinforce security
      protocol and enhance the accuracy and efficiency of operations.
    </p>
    <p>
      I’ve served in nonprofit and public sectors, leveling up infrastructure,
      tightening security baselines, and automating the boring stuff. In my lab,
      I maintain a high-availability Kubernetes cluster and constantly test tools
      so production changes are calm and predictable.
    </p> -->
    <p>I am a cybersecurity professional with a strong foundation in IT infrastructure and a growing focus on governance, risk, and compliance. With experience spanning network administration, incident response, and security hardening, I bridge the gap between technical execution and organizational security strategy. My background includes leading infrastructure projects, participating in safety and security committees, and aligning IT practices with regulatory standards such as HIPAA.<br><br>Currently, I maintain a high-availability Kubernetes lab environment to continuously evaluate tools and refine secure deployment practices. I hold multiple <a href="#certs">certifications</a>, and I am actively pursuing the CISM & others to further strengthen my expertise in security leadership, risk management, and enterprise resilience.</p>
    <br>
    <center>
      <button data-load-page="/Professional-Highlights/index.php" data-scroll=""
      class="btn btn-primary bs-primary">
        Professional Highlights
      </button>
    </center>
  </div>
</section>
<div class="alert alert-warning slide-up" role="alert">
  <center>
    Certified Information Systems Security Professional (CISSP), a globally respected cybersecurity credential.
  </center>
</div>

<!-- Professional Highlights Callout -->
<section class="slide-up bs-section" id="highlights-callout" aria-label="Professional highlights">
  <div class="container">
    <div class="bs-callout bs-callout--dark p-4 p-md-5">
      <div class="row g-4 align-items-center">
        <div class="col-12 col-lg-8">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-award"></i></div>
            <div>
              <div class="d-flex flex-wrap align-items-center gap-2">
                <h3 class="mb-0">Professional Highlights</h3>
              </div>
              <div class="bs-subtle">Employer feedback, impact stories, and technical wins.</div>
            </div>
          </div>
          <div class="bs-soft-divider my-3"></div>
          <div class="bs-subtle">If you only have a minute, start here, it’s the fastest way to understand the scope of my work.</div>
        </div>
        <div class="col-12 col-lg-4 text-lg-end">
          <a class="btn btn-light bs-cta bs-callout-btn" href="#" data-load-page="/Professional-Highlights/index.php" data-scroll="">
            View Highlights
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Skills -->
<section class="slide-up bs-section" id="skills">
  <div class="container">
    <h2>
      Skills
    </h2>
    <div class="row g-4 align-items-stretch">
      <div class="col-12 col-lg-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-shield-halved"></i></div>
            <div>
              <h5 class="mb-1">Core IT & Security</h5>
              <div class="bs-subtle">Operations, risk-minded hardening, and reliability</div>
            </div>
          </div>
          <ul class="bs-list mt-3">
            <li>Network Admin & Protocols (TCP/IP, DNS, DHCP, BGP)</li>
            <li>Cybersecurity, Incident Response, and Risk Management</li>
            <li>Patch Management & Endpoint Security</li>
            <li>Backup & Disaster Recovery</li>
            <li>Security Hardening & Compliance</li>
            <li>System Monitoring & Log Analysis</li>
            <li>User & Access Management</li>
            <li>Configuration & Change Management</li>
            <li>Network Segmentation & VPN/Firewall</li>
            <li>Cloud & Virtualization (Azure, M365)</li>
            <li>IT Policy & Documentation</li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-lg-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-cloud"></i></div>
            <div>
              <h5 class="mb-1">Cloud & Kubernetes</h5>
              <div class="bs-subtle">Hands-on lab experience and deployment fundamentals</div>
            </div>
          </div>
          <ul class="bs-list mt-3">
            <li>6-node Kubernetes Cluster</li>
            <li>Ingress NGINX & MetalLB</li>
            <li>Longhorn Storage & TrueNAS NFS</li>
            <li>Weave CNI & Keepalived</li>
            <li>Docker & CI/CD basics</li>
            <li>Docker Swarm & Container Orchestration</li>
            <li>Helm for Kubernetes package management</li>
            <li>Rancher for cluster management</li>
            <li>Prometheus & Grafana for monitoring</li>
            <li>Ansible for automation & configuration management</li>
            <li>Git & GitHub/GitLab for version control</li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-lg-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-screwdriver-wrench"></i></div>
            <div>
              <h5 class="mb-1">Tools & Platforms</h5>
              <div class="bs-subtle">Practical admin tooling across infra and apps</div>
            </div>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li><strong>Networking & Security:</strong> pfSense, Fortinet, Sophos, Cisco</li>
            <li><strong>Microsoft Platforms:</strong> M365, Exchange, Entra ID, WSUS, MDT, Intune</li>
            <li><strong>Virtualization & Backup:</strong> Proxmox, VMware, Veeam</li>
            <li><strong>Databases:</strong> Microsoft SQL, MySQL</li>
            <li><strong>Web & Development:</strong> PHP, HTML, CSS, JavaScript, VB.NET</li>
            <li><strong>Scripting & Automation:</strong> VBScript, PowerShell, Bash</li>
            <li><strong>Monitoring & Logging:</strong> SIEM (Elastic, Graylog)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Experience -->
<section class="slide-up bs-section" id="experience">
  <div class="container">
    <h2>
      Experience
    </h2>
    <div class="bs-timeline">
      <article class="bs-timeline-item">
        <div class="card p-4 bs-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">Network Administrator — Salina Family Healthcare Center</h5>
            <span class="bs-badge">2023 – Present</span>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li>Spearheaded IT infrastructure optimization initiatives, including secure network switch deployments and architecture improvements.</li>
            <li>Seamlessly integrated and secured new VoIP and telephony systems, ensuring operational continuity and data protection.</li>
            <li>Designed and implemented robust disaster recovery, backup and business continuity solutions, reducing risk and improving system resiliency.</li>
            <li>Negotiated cost-effective technology solutions while maintaining compliance and security standards.</li>
            <li>Proactively identified and resolved system vulnerabilities, from Windows 11 issues to network routing discrepancies.</li>
            <li>Facilitated secure transitions to modern protocols and authentication frameworks, including HTTPS enforcement and Azure Single Sign-On, enhancing organizational security posture.</li>
            <li>Designed IT infrastructure for a new healthcare facility, enabling secure operations and future growth</li>
            <li>Elected Member - Safety Committee; Security Committee</li>
          </ul>
        </div>
      </article>

      <article class="bs-timeline-item">
        <div class="card p-4 bs-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">Systems Administrator — Salina Public Library</h5>
            <span class="bs-badge">2022 – 2023</span>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li>Maintained servers, storage, and client fleet; modernized workflows.</li>
            <li>Upgraded Wi-Fi coverage and security policies.</li>
          </ul>
        </div>
      </article>

      <article class="bs-timeline-item">
        <div class="card p-4 bs-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">Cybersecurity Analyst — Saint Francis Ministries</h5>
            <span class="bs-badge">2021 – 2022</span>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li>Ensured the integrity and security of data on host computers</li>
            <li>Maintained security across multiple databases</li>
            <li>Protected data during transfer in line with business needs</li>
            <li>Upheld industry best practices for privacy, security, and regulatory compliance</li>
            <li>Elected Member - HIPPA committee</li>
          </ul>
        </div>
      </article>

      <article class="bs-timeline-item">
        <div class="card p-4 bs-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">Network Administrator — SMG Unlimited</h5>
            <span class="bs-badge">2019 – 2021</span>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li>Provided technical support to users</li>
            <li>Responded to work orders and support tickets</li>
            <li>Analyzed and resolved reported network problems</li>
            <li>Assisted with configuring firewalls</li>
            <li>Supported network technology upgrades and expansion projects</li>
          </ul>
        </div>
      </article>

      <article class="bs-timeline-item">
        <div class="card p-4 bs-card">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <h5 class="mb-0">IT Intern — Blue Beacon International</h5>
            <span class="bs-badge">2013 – 2016</span>
          </div>
          <ul class="bs-list bs-list--compact mt-3">
            <li>Diagnosed problems and helped develop solutions</li>
            <li>Supported PC hardware components, desktop operating systems, and application software</li>
            <li>Handled equipment repairs and arranged servicing</li>
            <li>Completed additional assigned duties and projects</li>
          </ul>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- Projects -->
<section class="slide-up bs-section" id="projects">
  <div class="container">
    <h2>
      Featured Projects
    </h2>
    <div class="row g-4">
      <div class="col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel bs-project-card">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-cubes"></i></div>
            <h5 class="mb-0">Home Kubernetes Platform</h5>
          </div>
          <p class="bs-subtle">
            6-node HA home Kubernetes cluster with enterprise-grade storage, networking, and deployments.
          </p>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <span class="bs-pill bs-pill--tag">Keepalived for HA control plane</span>
            <span class="bs-pill bs-pill--tag">MetalLB for load balancing</span>
            <span class="bs-pill bs-pill--tag">Longhorn for distributed storage</span>
            <span class="bs-pill bs-pill--tag">Ingress NGINX with TLS certificates</span>
            <span class="bs-pill bs-pill--tag">GitOps-style automated deployments</span>
            <span class="bs-pill bs-pill--tag">Cluster monitoring with Prometheus & Grafana</span>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel bs-project-card">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-scale-balanced"></i></div>
            <h5 class="mb-0">Risk & Compliance Management - Saint Francis Ministries</h5>
          </div>
          <p class="bs-subtle">
            Developing risk assessments, risk strategies, and ensuring compliance across the organization.
          </p>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <span class="bs-pill bs-pill--tag">Risk assessments & mitigation strategies</span>
            <span class="bs-pill bs-pill--tag">HIPAA committee participation</span>
            <span class="bs-pill bs-pill--tag">SOC 2 readiness & audits</span>
            <span class="bs-pill bs-pill--tag">Internal & external compliance audits</span>
            <span class="bs-pill bs-pill--tag">Policy & procedure documentation</span>
          </div>
        </div>
      </div>
      <div class="col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel bs-project-card">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-network-wired"></i></div>
            <h5 class="mb-0">IT Infrastructure Design - Salina Family Healthcare Center</h5>
          </div>
          <p class="bs-subtle">
            Planning, designing, and implementing IT infrastructure for the new healthcare facility.
          </p>
          <div class="d-flex flex-wrap gap-2 mt-2">
            <span class="bs-pill bs-pill--tag">Network topology & cabling</span>
            <span class="bs-pill bs-pill--tag">Secure Wi-Fi deployment</span>
            <span class="bs-pill bs-pill--tag">Server room setup & redundancy</span>
            <span class="bs-pill bs-pill--tag">Endpoint & workstation provisioning</span>
            <span class="bs-pill bs-pill--tag">Backup & disaster recovery planning</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Education -->
<section class="slide-up bs-section" id="education">
  <div class="container">
    <h2>
      Education
    </h2>
    <div class="row g-4 align-items-stretch">
      <div class="col-12 col-lg-7 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center gap-3 mb-2">
            <div class="bs-icon" aria-hidden="true">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h5 class="mb-1">Salina Central High School</h5>
              <div class="bs-subtle">High School Diploma · 2014</div>
            </div>
          </div>
          <div class="bs-subtle">
            My formal education is a high school diploma. My cybersecurity and IT expertise has been built through hands-on professional experience, certifications, continuous self-study, and lab work (including a high-availability Kubernetes environment).
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-5 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="mb-0">Professional Development</h5>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span class="bs-pill">IT Leadership</span>
            <span class="bs-pill">Cybersecurity</span>
            <span class="bs-pill">GRC & Risk</span>
            <span class="bs-pill">Systems & Network Engineering</span>
            <span class="bs-pill">Cloud & Kubernetes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Certifications -->
<section class="slide-up bs-section" id="certs">
  <div class="container">
    <h2>
      Certifications
    </h2>
    <div class="row g-4 align-items-stretch">
      <div class="col-12 col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center justify-content-between">
            <h5 class="mb-0">CISSP</h5>
            <span class="bs-badge">(ISC)²</span>
          </div>
          <div class="bs-subtle mt-2">Certified Information Systems Security Professional</div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <span class="bs-pill">Risk</span>
            <span class="bs-pill">Security Strategy</span>
            <span class="bs-pill">Architecture</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center justify-content-between">
            <h5 class="mb-0">CC</h5>
            <span class="bs-badge">(ISC)²</span>
          </div>
          <div class="bs-subtle mt-2">Certified in Cybersecurity</div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <span class="bs-pill">Foundations</span>
            <span class="bs-pill">Security Controls</span>
            <span class="bs-pill">Best Practices</span>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 d-flex">
        <div class="card p-4 flex-fill bs-card bs-panel">
          <div class="d-flex align-items-center justify-content-between">
            <h5 class="mb-0">Security+</h5>
            <span class="bs-badge">CompTIA</span>
          </div>
          <div class="bs-subtle mt-2">Baseline cybersecurity knowledge and operations</div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <span class="bs-pill">Ops</span>
            <span class="bs-pill">Defense</span>
            <span class="bs-pill">Incidents</span>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4">
      <div class="bs-subtle">More certifications and verifications on Credly.</div>
      <a href="https://www.credly.com/users/brandonsanders" class="btn btn-outline-dark bs-credly" target="_blank" rel="noopener">
        <i class="fa-solid fa-arrow-up-right-from-square me-2"></i>
        View on Credly
      </a>
    </div>
  </div>
</section>

<!-- Contact -->
<section class="slide-up bs-section bs-section--accent" id="contact">
  <div class="container">
    <div class="row g-4 align-items-end mb-4">
      <div class="col-12 col-lg-7">
        <h2>Contact</h2>
        <div class="bs-subtle">Send a message and I’ll get back to you. I’m happy to provide my resume upon request.</div>
      </div>
      <div class="col-12 col-lg-5">
        <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
          <span class="bs-pill">Professional inquiries welcome</span>
          <span class="bs-pill">Based in Salina, KS</span>
        </div>
      </div>
    </div>

    <div class="row g-4 align-items-stretch">
      <!-- Message form -->
      <div class="col-12 col-lg-6 d-flex">
        <div class="card p-4 p-md-5 flex-fill bs-card bs-panel bs-contact-card">
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-paper-plane"></i></div>
            <div>
              <h5 class="mb-0">Send a message</h5>
              <div class="bs-subtle">Short and simple is perfect.</div>
            </div>
          </div>

          <form method="post" id="contactForm" class="d-flex flex-column gap-3" style="flex-grow:1;">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="form-floating">
                  <input type="text" id="bs_name" name="bs_name" class="form-control" placeholder="Name" autocomplete="name" required>
                  <label for="bs_name">Name</label>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-floating">
                  <input type="email" id="bs_email" name="bs_email" class="form-control" placeholder="Email" autocomplete="email" required>
                  <label for="bs_email">Email</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <input type="text" id="bs_company" name="bs_company" class="form-control" placeholder="Company" autocomplete="organization" required>
                  <label for="bs_company">Company</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-floating">
                  <textarea class="form-control" id="bs_message" maxlength="500" name="bs_message" rows="5" placeholder="Message" style="height: 150px" required></textarea>
                  <label for="bs_message">Message</label>
                </div>
              </div>
            </div>

            <div class="bs-captcha">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-shield"></i></div>
                <div>
                  <div class="fw-semibold">Anti-spam check</div>
                  <div class="bs-subtle">What are my initials?</div>
                </div>
              </div>
              <div class="form-floating">
                <input type="text" class="form-control" id="captcha" name="captcha" placeholder="Initials" autocomplete="off" required>
                <label for="captcha">Initials</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg bs-primary w-100 bs-submit">
              Send
            </button>
          </form>
        </div>
      </div>

      <!-- Location -->
      <div class="col-12 col-lg-6 d-flex">
        <div class="card p-4 p-md-5 flex-fill bs-card bs-panel bs-contact-card">
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-location-dot"></i></div>
            <div>
              <h5 class="mb-0">Location</h5>
              <div class="bs-subtle">Salina, KS</div>
            </div>
          </div>
          <div class="bs-map-frame ratio ratio-4x3">
            <iframe title="Map of Salina, KS" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.548548582053!2d-97.6092919846236!3d38.840104979583026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87a61fd5f457e5b1%3A0x35a6b9f7ab5b1b2b!2sSalina%2C%20KS%2067451!5e0!3m2!1sen!2sus!4v1695156000000!5m2!1sen!2sus" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
          </div>
          <div class="bs-subtle mt-3">Open to opportunities in leadership, cybersecurity, risk, and infrastructure.</div>
        </div>
      </div>
    </div>
  </div>
</section>