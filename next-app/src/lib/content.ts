/** Each highlight in two wordings; the highlights page toggles between them. */
export type TechnicalHighlight = { technical: string; plain: string };

export const technicalHighlights: TechnicalHighlight[] = [
  {
    technical: "Successfully deployed new Layer 2 switches across multiple networking closets, optimizing performance and stability.",
    plain: "Installed new network switches in several equipment rooms, making the network faster and more stable.",
  },
  {
    technical: "Led a complete cabling initiative, introducing color-coded patching for improved organization and efficiency.",
    plain: "Led a full re-cabling project with color-coded cables, making the network easier to manage and troubleshoot.",
  },
  {
    technical: "Designed and implemented a solution to integrate a modern phone system with existing infrastructure.",
    plain: "Designed a way for a new phone system to work with the organization's existing equipment.",
  },
  {
    technical: "Identified gaps in the core network design and led the implementation of new core switches to resolve them.",
    plain: "Found weak points in the network's central design and replaced the core equipment to fix them.",
  },
  {
    technical: "Established firewall protections for disaster recovery environments, addressing a previously overlooked security requirement.",
    plain: "Added firewall protection to the backup (disaster recovery) systems, which had been overlooked.",
  },
  {
    technical: "Advocated for the deployment of additional firewalls and redundant cores to strengthen resilience.",
    plain: "Made the case for extra firewalls and backup network hardware so the network stays up if something fails.",
  },
  {
    technical: "Reconfigured legacy equipment for redundancy, maximizing use of existing resources.",
    plain: "Reused older equipment as backups, getting more value out of what the organization already owned.",
  },
  {
    technical: "Resolved access point wiring and channel overlap issues to improve wireless reliability.",
    plain: "Fixed Wi-Fi wiring and interference problems so wireless works more reliably.",
  },
  {
    technical: "Configured trunking and VLAN routing for access points to enhance segmentation.",
    plain: "Set up the Wi-Fi network so different kinds of traffic stay separated for better security.",
  },
  {
    technical: "Identified and remediated firewall vulnerabilities, refining rulesets for efficiency.",
    plain: "Found and fixed security gaps in firewall settings, and cleaned up the rules.",
  },
  {
    technical: "Installed new security cameras with custom-designed mounts for optimized placement.",
    plain: "Installed new security cameras, including custom mounts for the best viewing angles.",
  },
  {
    technical: "Standardized Wi-Fi SSIDs and credentials across all sites for ease of use.",
    plain: "Made Wi-Fi names and passwords the same at every location so staff can connect easily anywhere.",
  },
  {
    technical: "Implemented a secure BYOD wireless solution.",
    plain: "Set up secure Wi-Fi for staff's personal devices.",
  },
  {
    technical: "Upgraded end-of-life virtual machines and addressed networking issues inherited from older setups.",
    plain: "Replaced outdated virtual servers and fixed network problems left over from older setups.",
  },
  {
    technical: "Deployed advanced DNS and network detection tools for stronger defense.",
    plain: "Added tools that spot suspicious network activity for stronger defense.",
  },
  {
    technical: "Upgraded the ticketing system for improved security, reliability, and user experience.",
    plain: "Upgraded the IT help desk ticketing system to be more secure, reliable, and easier to use.",
  },
  {
    technical: "Streamlined VPN configuration with DDNS and simplified setup.",
    plain: "Made remote access (VPN) simpler to set up and more dependable.",
  },
  {
    technical: "Maintained thorough, up-to-date documentation for system operations.",
    plain: "Kept clear, up-to-date documentation of how systems work and are run.",
  },
  {
    technical: "Replaced legacy remote devices with modern site-to-site VPN connections.",
    plain: "Replaced outdated remote-office equipment with modern, secure connections between sites.",
  },
  {
    technical: "Proposed and implemented solutions to resolve internet reliability issues in remote facilities.",
    plain: "Fixed unreliable internet at remote locations.",
  },
  {
    technical: "Overhauled conference room networking to increase reliability and security.",
    plain: "Rebuilt the conference room network to be more reliable and secure.",
  },
  {
    technical: "Designed a dedicated VLAN for isolating compromised or internet-only devices.",
    plain: "Created an isolated network area for infected devices, or devices that only need internet access, so they can't reach anything important.",
  },
  {
    technical: "Ensured proactive patching and version updates across infrastructure.",
    plain: "Kept systems up to date with security patches before problems arose.",
  },
  {
    technical: "Developed a flexible phone VLAN solution allowing computers and phones to share wall ports securely.",
    plain: "Let computers and desk phones safely share the same wall jacks.",
  },
  {
    technical: "Expanded VLANs to accommodate network growth.",
    plain: "Expanded the network's structure to support growth.",
  },
  {
    technical: "Automated printer deployment using Active Directory group policies.",
    plain: "Automated printer setup so staff get the right printers without IT installing them by hand.",
  },
  {
    technical: "Resolved IP conflicts and optimized address management.",
    plain: "Fixed network address conflicts and organized how devices get their addresses.",
  },
  {
    technical: "Recommended and executed a successful migration to a new primary ISP.",
    plain: "Recommended and carried out a successful switch to a new primary internet provider.",
  },
  {
    technical: "Established redundant DHCP servers for improved availability.",
    plain: "Added backup servers so devices can still connect to the network if one goes down.",
  },
  {
    technical: "Resolved fax and VoIP issues with appliance reconfiguration.",
    plain: "Fixed fax and internet-phone problems by reconfiguring the equipment.",
  },
  {
    technical: "Created a vendor Wi-Fi login system with rotating credentials for security.",
    plain: "Created a vendor Wi-Fi login system with regularly changing passwords for security.",
  },
  {
    technical: "Resolved domain-related bugs in Windows 11 deployments.",
    plain: "Fixed bugs affecting new Windows 11 computers on the company network.",
  },
  {
    technical: "Configured multicast routing with rendezvous points for efficient data delivery.",
    plain: "Configured the network to send the same data to many devices at once more efficiently.",
  },
  {
    technical: "Upgraded critical network links to fiber to prevent electrical interference.",
    plain: "Upgraded key network connections to fiber-optic cable to avoid electrical interference.",
  },
  {
    technical: "Assisted in implementing and configuring a modern enterprise phone system.",
    plain: "Helped set up and configure a modern business phone system.",
  },
  {
    technical: "Developed website updates that reduced operating costs.",
    plain: "Updated the website in ways that lowered operating costs.",
  },
  {
    technical: "Enhanced security by hardening Active Directory authentication methods.",
    plain: "Strengthened how staff sign in to company systems, making accounts harder to break into.",
  },
  {
    technical: "Redesigned and streamlined the IT helpdesk system.",
    plain: "Redesigned and simplified the IT help desk.",
  },
  {
    technical: "Deployed firewall solutions with cellular backup for business continuity.",
    plain: "Set up firewalls with a cellular backup connection so the business stays online if the main internet goes down.",
  },
  {
    technical: "Established a secure VPN infrastructure for external connectivity.",
    plain: "Built secure remote access for connecting from outside the office.",
  },
  {
    technical: "Restricted excessive computer joins to the domain, tightening security controls.",
    plain: "Limited who can add computers to the company network, tightening security.",
  },
  {
    technical: "Developed IT security policies and procedures for ongoing governance.",
    plain: "Wrote IT security policies and procedures to guide ongoing governance.",
  },
  {
    technical: "Resolved SIP and routing issues with carrier equipment for seamless VoIP and faxing.",
    plain: "Fixed issues with the phone carrier's equipment so internet phones and faxing work smoothly.",
  },
  {
    technical: "Implemented encryption solutions for portable storage media.",
    plain: "Added encryption for USB drives and other portable storage, so a lost device doesn't expose data.",
  },
  {
    technical: "Enhanced ticketing system automation to process email replies efficiently.",
    plain: "Automated the help desk so email replies are added to tickets automatically.",
  },
  {
    technical: "Enabled DNS logging for network-wide monitoring.",
    plain: "Turned on logging of website lookups so suspicious activity can be monitored across the network.",
  },
  {
    technical: "Upgraded client machines to Windows 11 with full encryption support.",
    plain: "Upgraded staff computers to Windows 11 with full drive encryption.",
  },
  {
    technical: "Added new VLANs to virtualization environments for improved segmentation.",
    plain: "Added separate network zones for virtual servers to improve security.",
  },
  {
    technical: "Integrated MFA solutions at network entry points and VPN gateways.",
    plain: "Required multi-factor authentication (a second login step) for network and remote access.",
  },
  {
    technical: "Resolved legacy Active Directory misconfigurations related to account permissions.",
    plain: "Fixed long-standing account permission problems in the company directory.",
  },
  {
    technical: "Implemented domain-wide remote assistance for administrators.",
    plain: "Set up company-wide remote support so IT can help staff without being on-site.",
  },
  {
    technical: "Addressed deprovisioning gaps with third-party accounts.",
    plain: "Closed gaps where outside vendors' accounts weren't removed when no longer needed.",
  },
  {
    technical: "Integrated security certificates into group policies for HTTPS inspection.",
    plain: "Rolled out security certificates so encrypted web traffic can be inspected for threats.",
  },
  {
    technical: "Established a central group policy store for consistency.",
    plain: "Created one central place for managing computer settings so they stay consistent.",
  },
  {
    technical: "Configured syslog forwarding for centralized monitoring.",
    plain: "Sent system logs to one central place for easier monitoring.",
  },
  {
    technical: "Transitioned ticketing system to new hosting with SSL support.",
    plain: "Moved the help desk system to new hosting with encrypted (HTTPS) connections.",
  },
  {
    technical: "Enabled user self-service portals in security platforms to reduce IT overhead.",
    plain: "Let users handle some security tasks themselves, freeing up IT time.",
  },
  {
    technical: "Integrated identity management platforms with single sign-on.",
    plain: "Connected identity systems to single sign-on, so staff log in once to reach many apps.",
  },
  {
    technical: "Deployed encrypted configuration backups for critical systems.",
    plain: "Set up encrypted backups of critical system settings.",
  },
  {
    technical: "Standardized DNS naming conventions to streamline certificate deployment.",
    plain: "Standardized system naming to make security certificates easier to manage.",
  },
  {
    technical: "Implemented UPS monitoring and alerting across primary and DR environments.",
    plain: "Set up monitoring and alerts for battery backup (UPS) units at the main and disaster recovery sites.",
  },
  {
    technical: "Established an MDM solution for managing mobile devices using existing infrastructure.",
    plain: "Set up management for company mobile devices using existing tools.",
  },
  {
    technical: "Introduced ISP redundancy with automatic failover for critical services.",
    plain: "Added a backup internet connection that takes over automatically for critical services.",
  },
  {
    technical: "Developed a custom tool for Wi-Fi vendor account management with alerting and remote access features.",
    plain: "Built a custom tool to manage vendor Wi-Fi accounts, with alerts and remote access.",
  },
  {
    technical: "Optimized server drive layouts for better performance.",
    plain: "Reorganized server storage for better performance.",
  },
  {
    technical: "Negotiated savings on enterprise software renewals.",
    plain: "Negotiated savings on business software renewals.",
  },
  {
    technical: "Deployed secure and modernized sign-on solutions for cloud services.",
    plain: "Rolled out modern, secure sign-in for cloud services.",
  },
  {
    technical: "Integrated hybrid identity for seamless authentication between cloud and on-premises systems.",
    plain: "Linked cloud and on-site accounts so staff use one login everywhere.",
  },
  {
    technical: "Deployed password management solutions for local accounts.",
    plain: "Set up secure password management for local computer accounts.",
  },
  {
    technical: "Restricted unauthorized device joins in the cloud directory.",
    plain: "Blocked unauthorized devices from joining the company's cloud directory.",
  },
  {
    technical: "Improved synchronization tools between cloud and on-premises directories.",
    plain: "Improved how accounts sync between cloud and on-site systems.",
  },
  {
    technical: "Advocated for organization-wide MFA adoption.",
    plain: "Championed multi-factor authentication for the whole organization.",
  },
  {
    technical: "Modernized legacy systems by building secure web redirection portals.",
    plain: "Made older systems easier and safer to reach through secure web portals.",
  },
  {
    technical: "Optimized licensing, saving thousands annually.",
    plain: "Optimized software licensing, saving thousands of dollars a year.",
  },
  {
    technical: "Upgraded virtualization and Windows Server environments.",
    plain: "Upgraded server and virtualization systems.",
  },
  {
    technical: "Strengthened SMB protocol security across file servers.",
    plain: "Strengthened security on shared file servers.",
  },
  {
    technical: "Upgraded network adapters for higher throughput.",
    plain: "Upgraded network cards for faster data transfer.",
  },
  {
    technical: "Implemented secure digital signage on segmented networks.",
    plain: "Set up digital signage on its own isolated network for security.",
  },
  {
    technical: "Enhanced email security by updating policies (SPF, DKIM, DMARC).",
    plain: "Improved email security settings to make spoofing and phishing harder.",
  },
  {
    technical: "Strengthened encryption protocols across directory controllers.",
    plain: "Strengthened encryption on the servers that manage logins and accounts.",
  },
  {
    technical: "Rotated sensitive account credentials to close long-standing gaps.",
    plain: "Changed passwords on sensitive accounts that hadn't been updated in a long time.",
  },
  {
    technical: "Integrated phishing defense and user-awareness platforms.",
    plain: "Added phishing protection and security awareness training for staff.",
  },
  {
    technical: "Transitioned patch management from legacy WSUS to a modern RMM solution.",
    plain: "Moved software updates from an outdated tool to a modern management platform.",
  },
  {
    technical: "Automated OS deployment for new workstations.",
    plain: "Automated setting up new computers.",
  },
  {
    technical: "Deployed centralized MDM/RMM for monitoring and policy enforcement.",
    plain: "Set up central monitoring and policy enforcement for company devices.",
  },
  {
    technical: "Redesigned VPN solution with SSO integration.",
    plain: "Redesigned remote access so staff sign in once with single sign-on.",
  },
  {
    technical: "Deployed read-only domain controllers at remote sites.",
    plain: "Set up secure, read-only login servers at remote sites.",
  },
  {
    technical: "Adopted modern conditional access policies to enforce location-based security.",
    plain: "Added sign-in rules that allow or block access based on location.",
  },
  {
    technical: "Implemented advanced vulnerability scanning and remediation for domain environments.",
    plain: "Added advanced vulnerability scanning and fixed the issues it found.",
  },
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
  /** Company logo under /files/images/logos/, shown beside the role. */
  logo?: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Network Administrator, Salina Health Education Foundation",
    logo: "/files/images/logos/salina-family-healthcare.png",
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
    logo: "/files/images/logos/saint-francis-ministries.png",
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
    logo: "/files/images/logos/smg-unlimited.png",
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
    logo: "/files/images/logos/blue-beacon.png",
    period: "2013 – 2016",
    bullets: [
      "Provided hardware, OS, and application support across the organization.",
      "Diagnosed and resolved technical issues; managed equipment repairs and servicing.",
      "Completed additional IT projects as assigned.",
    ],
  },
];

/** `aspect` (width / height) sizes wordmark-only logos, which have no square icon, so they stay legible. */
export type Vendor = { name: string; logo: string; aspect?: number };
export type VendorGroup = { title: string; vendors: Vendor[] };

const v = (name: string, file: string, aspect?: number): Vendor => ({ name, logo: `/files/images/vendors/${file}`, ...(aspect && { aspect }) });

/**
 * Platforms shown in the homepage "Platforms I've deployed & managed" strip.
 * Logos are self-hosted: Simple Icons (CC0) SVGs recolored to each brand's
 * hex where available, otherwise the vendor's own site icon or Wikimedia
 * Commons SVG.
 */
export const vendorGroups: VendorGroup[] = [
  {
    title: "Network & Security",
    vendors: [
      v("Cisco", "cisco.svg", 1.83),
      v("Meraki", "meraki.png"),
      v("Aruba", "aruba.svg", 1.97),
      v("UniFi", "unifi.svg"),
      v("Fortinet", "fortinet.svg", 1.38),
      v("SonicWall", "sonicwall.png"),
      v("Sophos", "sophos.png"),
      v("Barracuda", "barracuda.svg", 3.75),
      v("pfSense", "pfsense.svg"),
      v("Pepwave", "pepwave.png"),
      v("Cloudflare", "cloudflare.svg", 2.11),
      v("Microsoft Defender", "defender.svg"),
      v("Tenable / Nessus", "tenable.png"),
      v("Okta", "okta.svg"),
      v("Duo", "duo.png"),
      v("Proofpoint", "proofpoint.png"),
      v("Mimecast", "mimecast.png"),
      v("Trustifi", "trustifi.png"),
      v("KnowBe4", "knowbe4.png"),
      v("Bitwarden", "bitwarden.svg"),
      v("Tailscale", "tailscale.svg"),
      v("OpenVPN", "openvpn.svg"),
      v("WireGuard", "wireguard.svg"),
    ],
  },
  {
    title: "Cloud, SaaS & Communications",
    vendors: [
      v("Microsoft 365", "microsoft.svg"),
      v("Azure", "azure.svg"),
      v("AWS", "aws.svg", 1.63),
      v("Google Cloud", "googlecloud.svg", 1.23),
      v("RapidScale", "rapidscale.png"),
      v("Wasabi", "wasabi.svg"),
      v("Slack", "slack.svg"),
      v("Zoom", "zoom.svg", 3.9),
      v("Twilio", "twilio.svg", 3.06),
      v("Zoho", "zoho.svg", 2.24),
      v("Zapier", "zapier.png"),
      v("BambooHR", "bamboohr.png"),
      v("GoTo", "goto.png"),
      v("Yealink", "yealink.png", 4.74),
    ],
  },
  {
    title: "Hardware, Virtualization & Backup",
    vendors: [
      v("Dell", "dell.svg"),
      v("HP", "hp.svg"),
      v("Lenovo", "lenovo.svg", 2.78),
      v("Intel", "intel.svg", 2.44),
      v("AMD", "amd.svg", 3.75),
      v("NVIDIA", "nvidia.svg", 1.48),
      v("Synology", "synology.svg", 3.49),
      v("TrueNAS", "truenas.svg", 1.25),
      v("Proxmox", "proxmox.svg"),
      v("VMware", "vmware.svg", 5.26),
      v("Citrix", "citrix.svg"),
      v("Veeam", "veeam.svg", 4.76),
      v("Acronis", "acronis.png"),
      v("Datto", "datto.svg", 2.83),
    ],
  },
  {
    title: "IT Operations & Remote Management",
    vendors: [
      v("NinjaOne", "ninjaone.png"),
      v("ConnectWise", "connectwise.png"),
      v("Kaseya", "kaseya.png"),
      v("ManageEngine", "manageengine.png"),
      v("SolarWinds", "solarwinds.png"),
      v("PRTG", "prtg.png"),
      v("Jamf", "jamf.png"),
      v("PagerDuty", "pagerduty.svg"),
      v("TeamViewer", "teamviewer.svg"),
      v("Devolutions", "devolutions.png"),
      v("Chocolatey", "chocolatey.svg"),
    ],
  },
  {
    title: "Platforms & Monitoring",
    vendors: [
      v("Kubernetes", "kubernetes.svg"),
      v("Calico", "calico.png"),
      v("Docker", "docker.svg", 1.37),
      v("Ansible", "ansible.svg"),
      v("Linux", "linux.svg"),
      v("Ubuntu", "ubuntu.svg"),
      v("Rocky Linux", "rockylinux.svg"),
      v("Apple", "apple.svg"),
      v("ChromeOS", "chromeos.svg"),
      v("GitHub", "github.svg"),
      v("Prometheus", "prometheus.svg"),
      v("Grafana", "grafana.svg"),
      v("Elastic", "elastic.svg"),
      v("Graylog", "graylog.svg"),
      v("MySQL", "mysql.svg", 1.45),
      v("Ollama", "ollama.svg"),
    ],
  },
  {
    title: "Physical Security, AV & Print",
    vendors: [
      v("Axis", "axis.svg", 2.61),
      v("Hikvision", "hikvision.svg", 6.25),
      v("HID Global", "hid.svg", 2.4),
      v("Honeywell Access Control", "honeywell.png"),
      v("Salto", "salto.png"),
      v("BrightSign", "brightsign.png"),
      v("Yodeck", "yodeck.png"),
      v("Atlona", "atlona.png"),
      v("Canon", "canon.svg", 4.17),
      v("Xerox", "xerox.png"),
      v("Konica Minolta", "konicaminolta.png"),
    ],
  },
  {
    title: "Carriers & Procurement",
    vendors: [
      v("AT&T", "att.svg"),
      v("Verizon", "verizon.svg"),
      v("Cox / Spectrum", "cox-spectrum.png"),
      v("Nex-Tech", "nextech.png"),
      v("CDW", "cdw.png"),
      v("Insight", "insight.png"),
      v("TechSoup", "techsoup.svg", 4.48),
    ],
  },
];
