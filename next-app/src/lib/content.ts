export const technicalHighlights: string[] = [
  "Successfully deployed new Layer 2 switches across multiple networking closets, optimizing performance and stability.",
  "Led a complete cabling initiative, introducing color-coded patching for improved organization and efficiency.",
  "Designed and implemented a solution to integrate a modern phone system with existing infrastructure.",
  "Identified gaps in the core network design and led the implementation of new core switches to resolve them.",
  "Established firewall protections for disaster recovery environments, addressing a previously overlooked security requirement.",
  "Advocated for the deployment of additional firewalls and redundant cores to strengthen resilience.",
  "Reconfigured legacy equipment for redundancy, maximizing use of existing resources.",
  "Resolved access point wiring and channel overlap issues to improve wireless reliability.",
  "Configured trunking and VLAN routing for access points to enhance segmentation.",
  "Identified and remediated firewall vulnerabilities, refining rulesets for efficiency.",
  "Installed new security cameras with custom-designed mounts for optimized placement.",
  "Standardized Wi-Fi SSIDs and credentials across all sites for ease of use.",
  "Implemented a secure BYOD wireless solution.",
  "Upgraded end-of-life virtual machines and addressed networking issues inherited from older setups.",
  "Deployed advanced DNS and network detection tools for stronger defense.",
  "Upgraded the ticketing system for improved security, reliability, and user experience.",
  "Streamlined VPN configuration with DDNS and simplified setup.",
  "Maintained thorough, up-to-date documentation for system operations.",
  "Replaced legacy remote devices with modern site-to-site VPN connections.",
  "Proposed and implemented solutions to resolve internet reliability issues in remote facilities.",
  "Overhauled conference room networking to increase reliability and security.",
  "Designed a dedicated VLAN for isolating compromised or internet-only devices.",
  "Ensured proactive patching and version updates across infrastructure.",
  "Developed a flexible phone VLAN solution allowing computers and phones to share wall ports securely.",
  "Expanded VLANs to accommodate network growth.",
  "Automated printer deployment using Active Directory group policies.",
  "Resolved IP conflicts and optimized address management.",
  "Recommended and executed a successful migration to a new primary ISP.",
  "Established redundant DHCP servers for improved availability.",
  "Resolved fax and VoIP issues with appliance reconfiguration.",
  "Created a vendor Wi-Fi login system with rotating credentials for security.",
  "Resolved domain-related bugs in Windows 11 deployments.",
  "Configured multicast routing with rendezvous points for efficient data delivery.",
  "Upgraded critical network links to fiber to prevent electrical interference.",
  "Assisted in implementing and configuring a modern enterprise phone system.",
  "Developed website updates that reduced operating costs.",
  "Enhanced security by hardening Active Directory authentication methods.",
  "Redesigned and streamlined the IT helpdesk system.",
  "Deployed firewall solutions with cellular backup for business continuity.",
  "Established a secure VPN infrastructure for external connectivity.",
  "Restricted excessive computer joins to the domain, tightening security controls.",
  "Developed IT security policies and procedures for ongoing governance.",
  "Resolved SIP and routing issues with carrier equipment for seamless VoIP and faxing.",
  "Implemented encryption solutions for portable storage media.",
  "Enhanced ticketing system automation to process email replies efficiently.",
  "Enabled DNS logging for network-wide monitoring.",
  "Upgraded client machines to Windows 11 with full encryption support.",
  "Added new VLANs to virtualization environments for improved segmentation.",
  "Integrated MFA solutions at network entry points and VPN gateways.",
  "Resolved legacy Active Directory misconfigurations related to account permissions.",
  "Implemented domain-wide remote assistance for administrators.",
  "Addressed deprovisioning gaps with third-party accounts.",
  "Integrated security certificates into group policies for HTTPS inspection.",
  "Established a central group policy store for consistency.",
  "Configured syslog forwarding for centralized monitoring.",
  "Transitioned ticketing system to new hosting with SSL support.",
  "Enabled user self-service portals in security platforms to reduce IT overhead.",
  "Integrated identity management platforms with single sign-on.",
  "Deployed encrypted configuration backups for critical systems.",
  "Standardized DNS naming conventions to streamline certificate deployment.",
  "Implemented UPS monitoring and alerting across primary and DR environments.",
  "Established an MDM solution for managing mobile devices using existing infrastructure.",
  "Introduced ISP redundancy with automatic failover for critical services.",
  "Developed a custom tool for Wi-Fi vendor account management with alerting and remote access features.",
  "Optimized server drive layouts for better performance.",
  "Negotiated savings on enterprise software renewals.",
  "Deployed secure and modernized sign-on solutions for cloud services.",
  "Integrated hybrid identity for seamless authentication between cloud and on-premises systems.",
  "Deployed password management solutions for local accounts.",
  "Restricted unauthorized device joins in the cloud directory.",
  "Improved synchronization tools between cloud and on-premises directories.",
  "Advocated for organization-wide MFA adoption.",
  "Modernized legacy systems by building secure web redirection portals.",
  "Optimized licensing, saving thousands annually.",
  "Upgraded virtualization and Windows Server environments.",
  "Strengthened SMB protocol security across file servers.",
  "Upgraded network adapters for higher throughput.",
  "Implemented secure digital signage on segmented networks.",
  "Enhanced email security by updating policies (SPF, DKIM, DMARC).",
  "Strengthened encryption protocols across directory controllers.",
  "Rotated sensitive account credentials to close long-standing gaps.",
  "Integrated phishing defense and user-awareness platforms.",
  "Transitioned patch management from legacy WSUS to a modern RMM solution.",
  "Automated OS deployment for new workstations.",
  "Deployed centralized MDM/RMM for monitoring and policy enforcement.",
  "Redesigned VPN solution with SSO integration.",
  "Deployed read-only domain controllers at remote sites.",
  "Adopted modern conditional access policies to enforce location-based security.",
  "Implemented advanced vulnerability scanning and remediation for domain environments.",
  "This list is not comprehensive but highlights some key achievements in IT infrastructure and security.",
];

export type Project = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    icon: "hospital",
    title: "IT & Network Infrastructure Design, Salina Health Education Foundation",
    description:
      "Designed the complete IT and network infrastructure for a new healthcare facility, including network topology, segmentation strategy, server room layout, and security architecture, ensuring HIPAA compliance and operational resilience from day one.",
    tags: [
      "Network topology & segmentation design",
      "Server room architecture",
      "Security architecture",
      "HIPAA-compliant design",
      "Redundancy & failover planning",
      "Disaster recovery design",
    ],
  },
  {
    icon: "scale-balanced",
    title: "Risk & Compliance Program, Saint Francis Ministries",
    description:
      "Established and contributed to a risk and compliance program across a multi-database healthcare organization, achieving HIPAA alignment and SOC 2 audit readiness while serving as an elected HIPAA committee member.",
    tags: [
      "Risk assessments & mitigation",
      "HIPAA committee (elected)",
      "SOC 2 audit readiness",
      "Policy & procedure documentation",
      "CEO Challenge Coin recipient",
    ],
  },
  {
    icon: "lock",
    title: "Security Modernization, Salina Health Education Foundation",
    description:
      "Led a targeted security modernization initiative, transitioning the organization from legacy authentication to Azure SSO with MFA and enforcing HTTPS-only policies, measurably improving the security posture.",
    tags: [
      "Azure SSO & MFA enforcement",
      "HTTPS-only policy rollout",
      "Network segmentation",
      "Security baseline hardening",
      "Vulnerability remediation",
    ],
  },
  {
    icon: "network-wired",
    title: "Sophos NDR on Proxmox, Salina Health Education Foundation",
    description:
      "Deployed Sophos Network Detection & Response (NDR) on Proxmox for the organization, overcoming undocumented compatibility and configuration challenges to run a commercial enterprise security appliance on an open-source hypervisor. Documented the full solution on GitHub to help others in the community do the same.",
    tags: ["Sophos NDR", "Proxmox", "Network Detection & Response", "Virtualization", "Security Research"],
    link: { label: "View on GitHub", href: "https://github.com/BrandonSanders48/SophosNDR-Proxmox" },
  },
  {
    icon: "server",
    title: "VMware to Proxmox Migration, Salina Health Education Foundation",
    description:
      "Led an enterprise virtualization migration off VMware to Proxmox across multiple hosts and 10+ production VMs, eliminating recurring licensing costs driven by post-Broadcom acquisition price increases while planning and executing the cutover with minimal disruption to clinical and administrative systems.",
    tags: ["Proxmox", "VMware migration", "Virtualization", "Cost optimization", "Cutover planning"],
  },
  {
    icon: "building-shield",
    title: "Disaster Recovery Hot Site, Salina Health Education Foundation",
    description:
      "Designed and implemented an active hot site disaster recovery solution using Dell PowerStore Metro synchronous replication paired with a Layer 2 network bridge between sites, enabling near-instant failover with minimal data loss to protect critical healthcare systems during an outage.",
    tags: ["Dell PowerStore Metro", "Disaster recovery", "Layer 2 bridging", "Business continuity", "High availability"],
  },
];

export type VolunteerRole = {
  icon: string;
  title: string;
  org: string;
  period: string;
  category: string;
  description: string;
};

export const volunteerRoles: VolunteerRole[] = [
  {
    icon: "earth-americas",
    title: "Code Taskforce Member",
    org: "(ISC)²",
    period: "Mar 2026 – Present",
    category: "Science & Technology",
    description:
      "As a Code Taskforce Member with (ISC)², the world's leading cybersecurity professional organization, I volunteer my time and expertise toward expanding access to cybersecurity education globally. This work reflects my belief that a stronger, more diverse cybersecurity workforce benefits everyone.",
  },
  {
    icon: "graduation-cap",
    title: "Scholarship Review Committee",
    org: "Center for Cyber Safety and Education",
    period: "Mar 2026 – Present",
    category: "Science & Technology",
    description:
      "Serve as a volunteer reviewer for the Center for Cyber Safety and Education's scholarship program, evaluating and ranking candidates to help identify deserving recipients. Contribute cybersecurity industry expertise to support the Center's mission of advancing education and awareness in the field.",
  },
];

export type ExperienceItem = {
  role: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Network Administrator, Salina Health Education Foundation",
    period: "2023 – Present",
    bullets: [
      "Serve as the sole IT and security lead for a multi-site healthcare organization (4 locations, ~200 users), owning end-to-end infrastructure, operations, and the security program with full accountability for compliance, uptime, and organizational risk posture.",
      "Elected to both the Safety Committee and Security Committee, contributing to governance, risk oversight, and policy decisions at the organizational level.",
      "Led a security modernization initiative, transitioning all 4 locations to Azure SSO with MFA enforcement and HTTPS-only policies, reducing credential and access-related risk organization-wide.",
      "Designed and delivered the complete IT infrastructure for a new healthcare facility, from network topology and server room design through endpoint provisioning and disaster recovery.",
      "Designed and implemented an active hot site disaster recovery solution using Dell PowerStore Metro synchronous replication and a Layer 2 network bridge between sites, enabling near-instant failover with minimal data loss.",
      "Led a virtualization migration from VMware to Proxmox across multiple hosts and 10+ production VMs, eliminating recurring licensing costs following Broadcom's VMware price increases.",
      "Directed vendor selection and contract negotiation for network, phone, and security technology as the organization's sole decision-maker, balancing cost, compliance requirements, and long-term operational needs.",
      "Integrated and secured VoIP and telephony systems, maintaining regulatory compliance and operational continuity throughout the transition.",
      "Proactively identified and remediated vulnerabilities across the network and endpoint environment, maintaining a strong and measurable security baseline.",
    ],
  },
  {
    role: "Cybersecurity Analyst, Saint Francis Ministries",
    period: "2021 – 2022",
    bullets: [
      "Elected to the HIPAA Committee, collaborating cross-functionally to align data handling and privacy practices with regulatory requirements.",
      "Managed security across a multi-site environment, conducting risk assessments and remediating vulnerabilities to protect sensitive organizational data.",
      "Developed and enforced data protection policies for data in transit and at rest, aligned with HIPAA, SOC 2, and industry best practices.",
      "Contributed to compliance audit readiness, policy documentation, and internal security reviews.",
      "Recognized with the CEO Challenge Coin for outstanding contributions to organizational security and compliance.",
    ],
  },
  {
    role: "Network Administrator, SMG Unlimited",
    period: "2020 – 2021",
    bullets: [
      "Administered network infrastructure and provided technical support across the organization, resolving issues and maintaining operational continuity.",
      "Managed work orders, support tickets, and network problem resolution.",
      "Configured and maintained firewalls and network security appliances.",
      "Supported technology upgrade and network expansion projects.",
    ],
  },
  {
    role: "IT Intern, Blue Beacon International",
    period: "2013 – 2016",
    bullets: [
      "Provided hardware, OS, and application support across the organization.",
      "Diagnosed and resolved technical issues; managed equipment repairs and servicing.",
      "Completed additional IT projects as assigned.",
    ],
  },
];
