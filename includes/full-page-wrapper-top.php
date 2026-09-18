<?php
/**
 * Full standalone page wrapper, opening half.
 *
 * The site's sub-pages (Portfolio, Projects, Volunteer, Professional-Highlights)
 * are fragments meant to be fetched by the SPA shell (root index.php) and
 * injected into #content. When one of those files is requested directly
 * (a bookmarked link, a shared URL, a search/AI crawler) rather than via the
 * shell's fetch call, it includes this file to render itself as a complete,
 * styled, crawlable page instead of returning an error.
 *
 * Callers may set $pageTitle / $pageDescription before requiring this file
 * to override the defaults.
 */

require_once __DIR__ . '/../config.php';

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Content-Security-Policy:
    default-src 'self';
    script-src 'self' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline';
    style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com;
    img-src 'self' data:;
    font-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.gstatic.com;
    frame-src https://www.google.com;
");

$pageTitle = $pageTitle ?? 'Brandon Sanders, CISSP, IT Security Leader & Manager';
$pageDescription = $pageDescription ?? 'Portfolio of Brandon Sanders, CISSP, IT Security Leader and Cybersecurity Professional with expertise in risk management, GRC, infrastructure strategy, and compliance. Targeting IT Manager and CISO roles.';
$pageCanonical = $pageCanonical ?? 'https://brandonsanders.org/';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#1f2a44">
    <meta name="description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES); ?>">
    <meta name="keywords" content="Brandon Sanders, CISSP, IT Manager, CISO, Cybersecurity Leader, Risk Management, GRC, Compliance, HIPAA, IT Security, Network Security, Cloud Security, Salina KS, Salina Kansas, Information Technology, Resume, LinkedIn">
    <meta name="author" content="Brandon Sanders">
    <meta name="robots" content="index, follow">
    <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES); ?></title>
    <link rel="canonical" href="<?php echo htmlspecialchars($pageCanonical, ENT_QUOTES); ?>">

    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES); ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo htmlspecialchars($pageCanonical, ENT_QUOTES); ?>">
    <meta property="og:image" content="https://brandonsanders.org/files/images/Brandon_Sanders.png">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($pageDescription, ENT_QUOTES); ?>">
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
    <link rel="stylesheet" href="/style.css">
    <link rel="icon" type="image/svg+xml" href="/files/images/bs-logo.svg">
    <?php if (defined('CLARITY_TRACKING_CODE')) { echo CLARITY_TRACKING_CODE; } ?>
</head>
<body class="font-sans antialiased">
    <a class="skip-link" href="#content">Skip to content</a>

    <h1 class="no-display-keywords">Brandon Sanders CISSP IT Manager Cybersecurity Leader Salina KS</h1>

    <div id="spinner" class="page-spinner" aria-hidden="true">
        <div class="loader"></div>
    </div>

    <div id="content">
