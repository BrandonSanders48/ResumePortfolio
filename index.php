<?php
    // Global site configuration (credentials, analytics, etc.)
    require __DIR__ . '/config.php';

    // Turn off display of errors/warnings to users
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);

    // Report all errors internally (so they still appear in server logs)
    error_reporting(E_ALL);

    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block"); // legacy but still useful
    header("Content-Security-Policy:
        default-src 'self';
        script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline';
        style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com;
        img-src 'self' data:;
        font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.gstatic.com;
        frame-src https://www.google.com;
    ");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#1f2a44">
    <meta name="description" content="Portfolio of Brandon Sanders, CISSP — IT Security Leader and Cybersecurity Professional with expertise in risk management, GRC, infrastructure strategy, and compliance. Targeting IT Manager and CISO roles.">
    <meta name="keywords" content="Brandon Sanders, CISSP, IT Manager, CISO, Cybersecurity Leader, Risk Management, GRC, Compliance, HIPAA, IT Security, Network Security, Cloud Security, Salina KS, Salina Kansas, Information Technology, Resume, LinkedIn">
    <meta name="author" content="Brandon Sanders">
    <meta name="robots" content="index, follow">
    <title>Brandon Sanders, CISSP — IT Security Leader &amp; Manager</title>
    <link rel="canonical" href="https://brandonsanders.org/">

    <!-- Open Graph -->
    <meta property="og:title" content="Brandon Sanders, CISSP | IT Security Leader &amp; Manager">
    <meta property="og:description" content="IT and cybersecurity leader with a track record of securing healthcare and nonprofit organizations. Expertise in risk management, GRC, compliance, and infrastructure strategy. CISSP certified.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://brandonsanders.org">
    <meta property="og:image" content="https://brandonsanders.org/files/images/Brandon_Sanders.png">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Brandon Sanders, CISSP | IT Security Leader &amp; Manager">
    <meta name="twitter:description" content="IT and cybersecurity leader — risk management, GRC, compliance, and infrastructure strategy. CISSP certified. Targeting IT Manager and CISO roles.">
    <meta name="twitter:image" content="https://brandonsanders.org/files/images/Brandon_Sanders.png">

    <!-- Inter font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'media',
            theme: {
                extend: {
                    colors: {
                        brand: { DEFAULT: '#1f2a44', dark: '#141c2e', light: '#253b5b' },
                        mint:  { DEFAULT: '#BFF3E6', muted: '#77C4C8' },
                    },
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
                }
            }
        }
    </script>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Custom styles -->
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/png" href="files/images/myself.png">
    <?php if (defined('CLARITY_TRACKING_CODE')) { echo CLARITY_TRACKING_CODE; } ?>
</head>
<body class="font-sans antialiased">
    <!-- Created By Brandon Sanders (The uh, main subject of this website!) -->

    <a class="skip-link" href="#content">Skip to content</a>

    <h1 class="no-display-keywords">Brandon Sanders CISSP IT Manager Cybersecurity Leader Salina KS</h1>

    <div id="spinner" class="page-spinner" aria-hidden="true">
        <div class="loader"></div>
    </div>

    <!-- Main page loads here -->
    <div id="content"></div>

    <!-- Footer -->
    <footer class="bg-brand-dark border-t border-white/[.08] py-8">
        <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
            <!-- Logo + copyright -->
            <div class="flex items-center gap-3">
                <img src="/files/images/myself.png" alt="Brandon Sanders initials" class="w-9 h-9 rounded-lg object-cover opacity-80">
                <p class="text-white/60 text-xs">&copy; <?php echo date("Y"); ?> Brandon Sanders, CISSP</p>
            </div>
            <!-- Disclaimer -->
            <div class="text-white/60 text-xs italic text-center">
                For use by individuals in the United States only.
            </div>
            <!-- Built-by note -->
            <div class="text-white/60 text-xs text-right">
                Self-hosted website built by Brandon Sanders, CISSP
            </div>
        </div>
        <span class="no-display-keywords">Sportbike Culture, Brandon Sanders, Small Business Owner</span>
    </footer>

    <!-- Hosting modal (custom, no Bootstrap) -->
    <div id="hostingModal" role="dialog" aria-modal="true" aria-labelledby="hostingModalLabel"
         class="fixed inset-0 z-[9999] items-center justify-center px-4"
         style="display:none;">
        <!-- Backdrop -->
        <div id="modalBackdrop" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <!-- Card -->
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/50">
            <!-- Header -->
            <div class="bg-gradient-to-r from-mint/90 to-mint-muted/60 px-6 py-4 flex items-center justify-between">
                <h5 class="font-bold text-brand text-base" id="hostingModalLabel">Powered by Modern Infrastructure</h5>
                <button id="modalClose" class="text-brand/70 hover:text-brand transition-colors" aria-label="Close">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>
            <!-- Body -->
            <div class="px-6 py-5 text-slate-700 text-sm">
                <p class="mb-4">This website is built, deployed, and maintained by Brandon Sanders.</p>
                <div class="flex flex-col gap-3">
                    <div class="flex items-start gap-3">
                        <i class="fa-solid fa-cubes text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>Runs as a <strong>Kubernetes container</strong> on my home cluster for reliability and fast updates.</span>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fa-solid fa-shield-halved text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>Traffic is routed through <strong>Cloudflare</strong> for secure delivery, caching, and edge protection.</span>
                    </div>
                    <div class="flex items-start gap-3">
                        <i class="fa-brands fa-github text-brand mt-0.5 w-4 shrink-0" aria-hidden="true"></i>
                        <span>The full source is publicly available on GitHub.</span>
                    </div>
                </div>
                <div class="text-center mt-4">
                    <a href="https://github.com/brandonsanders48/ResumePortfolio" target="_blank" rel="noopener"
                       class="inline-flex items-center gap-1.5 text-brand border border-brand/25 rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-brand hover:text-white transition-all">
                        <i class="fa-brands fa-github"></i> View Project on GitHub
                    </a>
                </div>
                <img src="/files/images/cloudflare.png" alt="Kubernetes and Cloudflare" class="w-24 mx-auto mt-4 block opacity-80">
            </div>
            <!-- Footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
                <button id="modalCloseBtn"
                        class="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-5 py-2 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!-- Core scripts -->
    <script>
        function runPageScripts(scrollToId = null) {
            // Typing animation cursor removal
            const nameEl = document.getElementById('name');
            if (nameEl) {
                const typingDuration = 3000;
                setTimeout(() => {
                    nameEl.style.borderRight = 'none';
                }, typingDuration + 1000);
            }

            // Slide-up animations
            const elements = document.querySelectorAll('.slide-up');
            if (!scrollToId) {
                elements.forEach((el, index) => {
                    setTimeout(() => el.classList.add('show'), 500 + index * 300);
                });
            } else {
                elements.forEach(el => el.classList.add('show'));
            }

            // data-load-page buttons
            const buttons = document.querySelectorAll('[data-load-page]');
            buttons.forEach(btn => {
                const page     = btn.getAttribute('data-load-page');
                const targetId = btn.getAttribute('data-scroll') || null;
                btn.addEventListener('click', (e) => {
                    if (e && typeof e.preventDefault === 'function') e.preventDefault();
                    // Close mobile nav if open
                    const navMenu = document.getElementById('nav-menu');
                    if (navMenu) navMenu.classList.add('hidden');
                    loadPage(page, targetId);
                });
            });

            // Mobile nav toggle
            const navToggle = document.getElementById('nav-toggle');
            const navMenu   = document.getElementById('nav-menu');
            if (navToggle && navMenu) {
                // Remove old listener by cloning
                const newToggle = navToggle.cloneNode(true);
                navToggle.parentNode.replaceChild(newToggle, navToggle);
                newToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('hidden');
                });
            }
        }

        function loadPage(url, scrollToId = null) {
            const spinner = document.getElementById('spinner');
            if (spinner) spinner.style.display = 'flex';
            fetch(url + '?t=' + Date.now(), {
                headers: { "X-Requested-With": "fetch" }
            })
            .then(res => res.text())
            .then(html => {
                document.getElementById('content').innerHTML = html;
                runPageScripts(scrollToId);
                window.scrollTo({ top: 0, behavior: 'auto' });
                if (scrollToId) {
                    const target = document.getElementById(scrollToId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            })
            .finally(() => {
                const spinnerAfter = document.getElementById('spinner');
                if (spinnerAfter) spinnerAfter.style.display = 'none';
            })
            .catch(err => console.error('Error loading page:', err));
        }

        window.addEventListener('load', () => {
            loadPage('/Portfolio/index.php');
        });
    </script>
    <script src="extra.js" defer></script>

    <!-- The Cloudflare script will likely inject itself in this section. -->
</body>
</html>
