<?php
// Global site configuration.

// Helper to read environment variables with a PHP-side default.
function bs_env(string $key, ?string $default = null): ?string {
    $value = getenv($key);
    return ($value === false || $value === '') ? $default : $value;
}

// Resume editor credentials configuration.
define('RESUME_EDITOR_USERNAME', bs_env('RESUME_EDITOR_USERNAME'));
define('RESUME_EDITOR_PASSWORD_HASH', bs_env('RESUME_EDITOR_PASSWORD_HASH'));

// Resume editor cookie security:
// If RESUME_EDITOR_COOKIE_SECURE is set in the environment, use it.
// Otherwise, default to true only when the request appears to be HTTPS
// (directly or via a reverse proxy header), and false for plain HTTP
// so local testing does not break CSRF/session.
$__bs_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
$__bs_cookie_secure_env = bs_env('RESUME_EDITOR_COOKIE_SECURE', $__bs_https ? '1' : '0');
define('RESUME_EDITOR_COOKIE_SECURE', filter_var($__bs_cookie_secure_env, FILTER_VALIDATE_BOOL));

// Contact form email credentials.
define('CONTACT_MAIL_USERNAME', bs_env('CONTACT_MAIL_USERNAME'));
define('CONTACT_MAIL_APP_PASSWORD_B64', bs_env('CONTACT_MAIL_APP_PASSWORD_B64'));


define('CONTACT_PHONE_NUMBER', bs_env('CONTACT_PHONE_NUMBER'));

// Microsoft Clarity tracking snippet used in the main layout.
// Project ID must be provided by CLARITY_PROJECT_ID; if not set,
// tracking is disabled and this becomes an empty string.
$bsClarityId = bs_env('CLARITY_PROJECT_ID');
if ($bsClarityId) {
    define('CLARITY_TRACKING_CODE', sprintf(<<<'HTML'
    <!-- Clarity tracking code for https://brandonsanders.org/ -->
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "%s");
    </script>
HTML
    , $bsClarityId));
} else {
    define('CLARITY_TRACKING_CODE', '');
}
