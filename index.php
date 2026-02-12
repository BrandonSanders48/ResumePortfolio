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
        script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; 
        style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; 
        img-src 'self' data:; 
        font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
    ");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#253B5B">
    <meta name="description" content="Portfolio of Brandon Sanders — Network Administrator, Cybersecurity Professional, and Kubernetes Enthusiast. View skills, certifications, and projects.">
    <meta name="keywords" content="Brandon Sanders, Cybersecurity, Network Administrator, Kubernetes, Cloud, Security+, (ISC)² CC, CISSP, IT Portfolio, Systems Administrator, Salina KS, Salina Kansas, Information Technology, Sportbike Culture, Resume, LinkedIn, Facebook, G.O.A.T">
    <meta name="author" content="Brandon Sanders">
    <meta name="robots" content="index, follow">
    <title>Brandon Sanders, CISSP - Portfolio</title>
    <link rel="canonical" href="https://brandonsanders.org/">
    
    <!-- Open Graph (for LinkedIn/Facebook) -->
    <meta property="og:title" content="Brandon Sanders | Cybersecurity & Information Technology Portfolio">
    <meta property="og:description" content="Explore the IT skills, certifications, and projects of Brandon Sanders, a Network Administrator and Cybersecurity Enthusiast.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://brandonsanders.org">
    <meta property="og:image" content="https://brandonsanders.org/files/images/Brandon_Sanders.png">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Brandon Sanders | Cybersecurity & Information Technology Portfolio">
    <meta name="twitter:description" content="Portfolio of Brandon Sanders — Cybersecurity Professional & Kubernetes Enthusiast.">
    <meta name="twitter:image" content="https://brandonsanders.org/files/images/Brandon_Sanders.png">
    
    <link rel="stylesheet" href="style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" type="image/png" href="files/images/myself.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <?php if (defined('CLARITY_TRACKING_CODE')) { echo CLARITY_TRACKING_CODE; } ?>
</head>
<body>
    <!-- Created By Brandon Sanders (The uh, main subject of this website!) -->

    <a class="skip-link" href="#content">Skip to content</a>
    
    <h1 class="no-display-keywords"></h1>
    
    <div id="spinner" class="page-spinner" style="display:none;" aria-hidden="true">
        <div class="loader"></div>
    </div>

    <!-- Main page will load here -->
    <div id="content"></div>

    <!-- Footer -->
    <footer style="padding: 15px;">
        <div class="footer-container">
            <div class="footer-left">
                <img src="../files/images/myself.png" alt="My Initials (BS)" style="width:60px; height:auto; margin-right:10px; border-radius:5px;">
                <p style="margin:0;">© <?php echo date("Y"); ?> Brandon Sanders, CISSP</p>
            </div>
            <div class="footer-middle">
                <p style="margin:0; font-size:0.9em;">
                    <i>For use by individuals in the United States only.</i>
                </p>
            </div>
            <div class="footer-right">
                <p style="margin:0; font-size:0.85em;">
                    This is a self-hosted website created by Brandon Sanders, CISSP
                </p>
            </div>
        </div>
        <span class="no-display-keywords">Sportbike Culture, Brandon Sanders, Small Business Owner</span>
    </footer>

    <!-- Modal (opens once every 6 hours) -->
    <div class="modal fade" id="hostingModal" tabindex="-1" aria-labelledby="hostingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-white" style="background:#CDEDDA;">
                    <h5 class="modal-title" id="hostingModalLabel" style="color:#253B5B">Powered by Modern Infrastructure</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" style="color:#253B5B" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <p>This website is hosted on <strong>my Kubernetes cluster at home</strong> for high availability and scalability.</p>
                    <p>All traffic is securely proxied through <strong>Cloudflare</strong> to ensure fast, reliable, and protected access.</p>
                    <img src="/files/images/cloudflare.png" alt="Kubernetes & Cloudflare" class="img-fluid mt-3" style="max-width:100px;">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripting -->
    <script>
        // Extension for page loading
        function runPageScripts(scrollToId = null) {
            const nameEl = document.getElementById('name');
            if (nameEl) {
                const typingDuration = 3000;
                setTimeout(() => {
                    nameEl.style.borderRight = 'none'; // remove cursor
                }, typingDuration + 1000); 
            }
            const elements = document.querySelectorAll('.slide-up');
            if (!scrollToId) {
                // Slide-up animation normally
                elements.forEach((el, index) => {
                setTimeout(() => el.classList.add('show'), 500 + index * 300);
                });
            } else {
                // Scroll target provided: show immediately without animation
                elements.forEach(el => el.classList.add('show'));
            }
            const buttons = document.querySelectorAll('[data-load-page]');
            buttons.forEach(btn => {
                const page = btn.getAttribute('data-load-page');
                const targetId = btn.getAttribute('data-scroll') || null;
                btn.addEventListener('click', (e) => {
                    if (e && typeof e.preventDefault === 'function') e.preventDefault();
                    loadPage(page, targetId);
                });
            });
        }
        
        // Load pages dynamically
        function loadPage(url, scrollToId = null) {
            const spinner = document.getElementById('spinner');
            if (spinner) spinner.style.display = 'block';
            fetch(url, {
                headers: {
                    "X-Requested-With": "fetch" // custom header
                }
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
    
        // Load main page by default
        window.addEventListener('load', () => {
            loadPage('/Portfolio/index.php');
        });
    </script>
    <script src="extra.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- The Cloudflare script will likely inject itself in this section. Unfortunately, it probably won’t preserve my indentation style. -->
</body>
</html>