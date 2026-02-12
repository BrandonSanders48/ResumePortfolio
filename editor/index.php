<?php

require_once __DIR__ . '/../config.php';
if (!defined('RESUME_EDITOR_COOKIE_SECURE')) {
  define('RESUME_EDITOR_COOKIE_SECURE', false);
}
if (!defined('RESUME_EDITOR_BYPASS_LOGIN')) {
  define('RESUME_EDITOR_BYPASS_LOGIN', false);
}
define('RESUME_EDITOR_SESSION_NAME', 'resume_editor');

function resume_editor_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(RESUME_EDITOR_SESSION_NAME);

    $params = session_get_cookie_params();
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $params['path'] ?? '/',
        'domain' => $params['domain'] ?? '',
        'secure' => RESUME_EDITOR_COOKIE_SECURE,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function resume_editor_csrf_token(): string {
    resume_editor_start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function resume_editor_verify_csrf(): void {
    resume_editor_start_session();
    $token = $_POST['csrf'] ?? '';
  if (!$token || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $token)) {
    return;
  }
}

function resume_editor_is_logged_in(): bool {
  if (RESUME_EDITOR_BYPASS_LOGIN) {
    return true;
  }
    resume_editor_start_session();
    return !empty($_SESSION['resume_editor_logged_in']);
}

function resume_editor_require_login(): void {
    if (!resume_editor_is_logged_in()) {
        header('Location: /editor/index.php?action=login');
        exit;
    }
}

function resume_editor_login(string $username, string $password): bool {
    resume_editor_start_session();

  if (!RESUME_EDITOR_USERNAME || !RESUME_EDITOR_PASSWORD_HASH) {
        return false;
    }

  if ($username !== RESUME_EDITOR_USERNAME) {
    return false;
  }

    if (!password_verify($password, RESUME_EDITOR_PASSWORD_HASH)) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['resume_editor_logged_in'] = true;
    return true;
}

function resume_editor_logout(): void {
    resume_editor_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'] ?? '/',
            $params['domain'] ?? '',
            $params['secure'] ?? false,
            $params['httponly'] ?? true
        );
    }
    session_destroy();
}

function resume_editor_is_fetch_request(): bool {
    return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'fetch';
}

function resume_editor_json(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload);
    exit;
}

function resume_editor_list_html_docs(string $dir): array {
  $docs = [];
  try {
    $it = new DirectoryIterator($dir);
    foreach ($it as $file) {
      if ($file->isDot() || !$file->isFile()) {
        continue;
      }
      $ext = strtolower((string)$file->getExtension());
      if (!in_array($ext, ['html', 'htm'], true)) {
        continue;
      }
      $filename = (string)$file->getFilename();
      if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._ -]*\.(html?|HTML?)$/', $filename)) {
        continue;
      }
      $base = preg_replace('/\.(html?|HTML?)$/', '', $filename);
      $label = trim(str_replace(['_', '-'], ' ', (string)$base));
      $docs[$filename] = [
        'filename' => $filename,
        'path' => $file->getPathname(),
        'label' => $label !== '' ? $label : $filename,
      ];
    }
  } catch (Throwable $e) {
  }

  if (!$docs) {
    $fallback = 'Resume.html';
    $docs[$fallback] = [
      'filename' => $fallback,
      'path' => rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . $fallback,
      'label' => 'Resume',
    ];
  }

  ksort($docs, SORT_NATURAL | SORT_FLAG_CASE);
  return $docs;
}

function resume_editor_pick_doc(array $docs, ?string $requested): string {
  $keys = array_keys($docs);
  if (!$keys) {
    return 'Resume.html';
  }
  $default = in_array('Resume.html', $keys, true) ? 'Resume.html' : $keys[0];
  foreach ($keys as $key) {
    if (stripos($key, 'cover') !== false) {
      $default = $key;
      break;
    }
  }
  if ($requested === null || $requested === '') {
    return $default;
  }
  return array_key_exists($requested, $docs) ? $requested : $default;
}

function resume_editor_extract_head(string $html): string {
  if (preg_match('~<head[^>]*>(.*)</head>~is', $html, $match)) {
    return trim($match[1]);
  }
  return '';
}

function resume_editor_extract_body(string $html): string {
  if (preg_match('~<body[^>]*>(.*)</body>~is', $html, $match)) {
    return trim($match[1]);
  }
  return $html;
}

function resume_editor_contact_phone(): string {
  $phone = '';
  if (defined('CONTACT_PHONE_NUMBER')) {
    $phone = (string)CONTACT_PHONE_NUMBER;
  }
  if ($phone === '') {
    $phone = (string)(getenv('CONTACT_PHONE_NUMBER') ?: '');
  }
  return trim($phone);
}

function resume_editor_contact_email(): string {
  $email = (string)(getenv('CONTACT_PUBLIC_EMAIL') ?: '');
  if ($email === '' && defined('CONTACT_MAIL_USERNAME')) {
    $email = (string)CONTACT_MAIL_USERNAME;
  }
  if ($email === '') {
    $email = (string)(getenv('CONTACT_MAIL_USERNAME') ?: '');
  }
  return trim($email);
}

function resume_editor_contact_phone_tel(string $phone): string {
  $digits = preg_replace('/\D+/', '', $phone);
  if ($digits === '') {
    return '';
  }
  if (strlen($digits) === 10) {
    return '+1' . $digits;
  }
  if (strlen($digits) === 11 && $digits[0] === '1') {
    return '+' . $digits;
  }
  return '+' . $digits;
}

function resume_editor_apply_tokens(string $html, string $jobName = '', string $companyName = ''): string {
  $phone = resume_editor_contact_phone();
  $email = resume_editor_contact_email();
  $tel = resume_editor_contact_phone_tel($phone);
  $jobName = trim($jobName) !== '' ? trim($jobName) : 'IT';
  $companyName = trim($companyName);
  $companyAt = $companyName !== '' ? ' at ' . $companyName : '';

  $replacements = [
    '{{CONTACT_PHONE_NUMBER}}' => $phone,
    '{{CONTACT_PHONE_NUMBER_TEL}}' => $tel,
    '{{CONTACT_EMAIL}}' => $email,
    '{{CONTACT_EMAIL_MAILTO}}' => $email,
    '{{TARGET_JOB_TITLE}}' => $jobName,
    '{{TARGET_COMPANY_NAME}}' => $companyName,
    '{{TARGET_COMPANY_AT}}' => $companyAt,
    '{{TARGET_HIRING_TEAM_AT}}' => $companyAt,
  ];

  return strtr($html, $replacements);
}

function resume_editor_filename_part(string $value): string {
  $value = trim($value);
  if ($value === '') {
    return '';
  }

  $value = preg_replace('/[^A-Za-z0-9]+/', '_', $value);
  $value = trim((string)$value, '_');
  return substr($value, 0, 80);
}

$action = (string)($_GET['action'] ?? '');
$docs = resume_editor_list_html_docs(__DIR__);
$requestedDoc = (string)($_POST['doc'] ?? ($_GET['doc'] ?? ''));
$activeDoc = resume_editor_pick_doc($docs, $requestedDoc);
$activePath = $docs[$activeDoc]['path'];

if ($action === 'logout') {
    resume_editor_logout();
    header('Location: /editor/index.php?action=login');
    exit;
}

if ($action === 'save') {
    resume_editor_require_login();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo 'Method Not Allowed';
        exit;
    }

    resume_editor_verify_csrf();

    $doc = resume_editor_pick_doc($docs, (string)($_POST['doc'] ?? ''));
    $docPath = $docs[$doc]['path'];

    $content = (string)($_POST['content'] ?? '');
    if (stripos($content, '<?php') !== false) {
        if (resume_editor_is_fetch_request()) {
            resume_editor_json(['success' => false, 'message' => 'Refusing to save PHP code inside the resume HTML.'], 400);
        }
        http_response_code(400);
        echo 'Refusing to save PHP code inside the resume HTML.';
        exit;
    }

    $dir = dirname($docPath);
    $writable = (file_exists($docPath) && is_writable($docPath)) || (!file_exists($docPath) && is_writable($dir));
    if (!$writable) {
      $message = 'Save failed: file is not writable by the web server. Check permissions for ' . $docPath;
      if (resume_editor_is_fetch_request()) {
        resume_editor_json(['success' => false, 'message' => $message], 500);
      }
      http_response_code(500);
      header('Content-Type: text/plain; charset=utf-8');
      echo $message;
      exit;
    }

    $bytes = @file_put_contents($docPath, $content);
    $ok = $bytes !== false;
    $lastError = $ok ? null : (error_get_last()['message'] ?? null);

    if (resume_editor_is_fetch_request()) {
      $message = $ok ? 'Saved.' : ('Failed to write file.' . ($lastError ? (' ' . $lastError) : ''));
      resume_editor_json(['success' => $ok, 'message' => $message], $ok ? 200 : 500);
    }

    if (!$ok) {
      http_response_code(500);
      header('Content-Type: text/plain; charset=utf-8');
      echo 'Save failed: unable to write resume file.' . ($lastError ? (' ' . $lastError) : '');
      exit;
    }

    header('Location: /editor/index.php?doc=' . rawurlencode($doc));
    exit;
}

if ($action === 'export') {
    resume_editor_require_login();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo 'Method Not Allowed';
        exit;
    }

    resume_editor_verify_csrf();
    $doc = resume_editor_pick_doc($docs, (string)($_POST['doc'] ?? ''));
    $content = (string)($_POST['content'] ?? '');
    $exportMode = (string)($_POST['export_mode'] ?? 'current');
    $exportOther = resume_editor_pick_doc($docs, (string)($_POST['export_other'] ?? ''));
    $enablePdfAlert = !empty($_POST['export_pdf_alert']);
    $jobName = trim((string)($_POST['job_name'] ?? ($_POST['job_title'] ?? '')));
    $companyName = trim((string)($_POST['company_name'] ?? ''));

    $filenameBase = 'BrandonSanders_Resume';
    $companySuffix = resume_editor_filename_part($companyName);
    if ($companySuffix !== '') {
      $filenameBase .= '-' . $companySuffix;
    }
    $csrf = resume_editor_csrf_token();

    $pages = [];
    $selectedHtmlByDoc = [$doc => $content];
    if ($exportMode === 'both') {
      $otherDoc = $exportOther;
      if ($otherDoc === $doc) {
        foreach (array_keys($docs) as $k) {
          if ($k !== $doc) {
            $otherDoc = $k;
            break;
          }
        }
      }

      if ($otherDoc !== $doc && isset($docs[$otherDoc])) {
        $docIsCover = stripos($doc, 'cover') !== false;
        $otherIsCover = stripos($otherDoc, 'cover') !== false;
        $order = [$doc, $otherDoc];
        if (!$docIsCover && $otherIsCover) {
          $order = [$otherDoc, $doc];
        }

        foreach ($order as $docName) {
          if ($docName === $doc) {
            $html = $selectedHtmlByDoc[$doc] ?? '';
          } else {
            $path = $docs[$docName]['path'];
            $html = file_exists($path) ? (string)file_get_contents($path) : '';
          }
          $pages[] = [
            'doc' => $docName,
            'label' => $docs[$docName]['label'] ?? $docName,
            'html' => resume_editor_apply_tokens($html, $jobName, $companyName),
          ];
        }
      } else {
        $pages[] = [
          'doc' => $doc,
          'label' => $docs[$doc]['label'] ?? $doc,
          'html' => resume_editor_apply_tokens($content, $jobName, $companyName),
        ];
      }
    } else {
      $pages[] = [
        'doc' => $doc,
        'label' => $docs[$doc]['label'] ?? $doc,
        'html' => resume_editor_apply_tokens($content, $jobName, $companyName),
      ];
    }

    if (!empty($_POST['export_pdf'])) {
      $serverPort = (string)($_SERVER['SERVER_PORT'] ?? '80');
      $origin = 'http://127.0.0.1' . ($serverPort !== '80' ? (':' . $serverPort) : '');

      $headParts = [];
      $bodyParts = [];
      foreach ($pages as $page) {
        $html = (string)($page['html'] ?? '');
        $head = resume_editor_extract_head($html);
        if ($head !== '') {
          $headParts[] = $head;
        }
        $bodyParts[] = resume_editor_extract_body($html);
      }

      $combinedHtml = '<!doctype html><html><head><meta charset="utf-8">' .
        '<base href="' . htmlspecialchars($origin, ENT_QUOTES, 'UTF-8') . '/">' .
        implode("\n", $headParts) .
        '<style>@page{size:letter;margin:0} html,body{margin:0;padding:0} .pp-page{page-break-after:always;} .pp-page:last-child{page-break-after:auto;}</style>' .
        '</head><body>';

      foreach ($bodyParts as $body) {
        $combinedHtml .= '<div class="pp-page">' . $body . '</div>';
      }
      $combinedHtml .= '</body></html>';

      $tmpHtml = tempnam(sys_get_temp_dir(), 'resume_html_') . '.html';
      file_put_contents($tmpHtml, $combinedHtml);

      $exportUrl = 'file://' . $tmpHtml;
      $tmpPdf = tempnam(sys_get_temp_dir(), 'resume_pdf_') . '.pdf';
      $cmd = 'node /app-source/render-pdf.mjs ' . escapeshellarg($exportUrl) . ' ' . escapeshellarg($tmpPdf);

      $output = [];
      $exitCode = 0;
      exec($cmd . ' 2>&1', $output, $exitCode);

      if ($exitCode !== 0 || !file_exists($tmpPdf)) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo "PDF export failed (Puppeteer error).\n" . implode("\n", $output);
        @unlink($tmpHtml);
        exit;
      }

      if ($enablePdfAlert) {
        $pdfAlertMessage = '';
        $pdfAlertMessageB64 = (string)(getenv('PDF_OPEN_ALERT_MESSAGE_B64') ?: '');
        if ($pdfAlertMessageB64 !== '') {
          $decoded = base64_decode($pdfAlertMessageB64, true);
          if ($decoded !== false) {
            $pdfAlertMessage = (string)$decoded;
          }
        }
        if ($pdfAlertMessage === '') {
          $pdfAlertMessage = (string)(getenv('PDF_OPEN_ALERT_MESSAGE') ?: '');
        }

        if ($pdfAlertMessage !== '') {
          $pdfAlertMessage = str_replace(
            ["\r\n", "\r", "\\r\\n", "\\n", "\\r", "\\\\r\\\\n", "\\\\n", "\\\\r"],
            ["\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n"],
            $pdfAlertMessage
          );
          if ($jobName !== '') {
            $pdfAlertMessage = str_replace('IT', $jobName, $pdfAlertMessage);
          }
        }

        if ($pdfAlertMessage !== '') {
          $tmpPdfWithAlert = tempnam(sys_get_temp_dir(), 'resume_pdf_alert_') . '.pdf';
          $cmdAlert = 'node /app-source/pdf-add-alert.mjs '
            . escapeshellarg($tmpPdf) . ' '
            . escapeshellarg($tmpPdfWithAlert) . ' '
            . escapeshellarg($pdfAlertMessage);

          $alertOutput = [];
          $alertExitCode = 0;
          exec($cmdAlert . ' 2>&1', $alertOutput, $alertExitCode);

          if ($alertExitCode !== 0 || !file_exists($tmpPdfWithAlert)) {
            http_response_code(500);
            header('Content-Type: text/plain; charset=utf-8');
            echo "PDF export failed (alert injection error).\n" . implode("\n", $alertOutput);
            @unlink($tmpPdf);
            @unlink($tmpHtml);
            exit;
          }

          @unlink($tmpPdf);
          $tmpPdf = $tmpPdfWithAlert;
        }
      }

      header('Content-Type: application/pdf');
      header('Content-Disposition: attachment; filename="' . $filenameBase . '.pdf"');
      header('Content-Length: ' . filesize($tmpPdf));
      readfile($tmpPdf);
      @unlink($tmpPdf);
      @unlink($tmpHtml);
      exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Content-Disposition: inline; filename="' . $filenameBase . '_print.html"');

    ?>
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Resume Export</title>
      <style>
        :root {
          --re-bg: #eaf0f8;
          --re-text: rgba(15, 23, 42, 0.92);
        }
        @page { size: letter; margin: 0; }
        body {
          margin: 0;
          background:
            radial-gradient(900px 520px at 20% -10%, rgba(56, 189, 248, 0.16), transparent 55%),
            radial-gradient(800px 520px at 85% 0%, rgba(167, 139, 250, 0.14), transparent 55%),
            var(--re-bg);
          color: var(--re-text);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }
        .toolbar {
          max-width: 8.5in;
          margin: 0.75rem auto 0;
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
          align-items: center;
          justify-content: space-between;
          color: rgba(15, 23, 42, 0.90);
          background: rgba(255, 255, 255, 0.90);
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 0.9rem;
          padding: .55rem .75rem;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.10);
        }
        .toolbar button, .toolbar select {
          appearance: none;
          border: 1px solid rgba(15, 23, 42, 0.18);
          background: rgba(255, 255, 255, 0.96);
          color: rgba(15, 23, 42, 0.92);
          padding: .42rem .6rem;
          border-radius: .6rem;
        }
        .toolbar a {
          color: rgba(2, 132, 199, 0.98);
          text-decoration: none;
          display: inline-block;
          box-sizing: border-box;
          max-width: 100%;
        }

        @media (max-width: 640px) {
          .toolbar {
            max-width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .toolbar > div {
            width: 100%;
          }
          .toolbar > div:last-child {
            display: grid;
            grid-template-columns: 1fr;
            gap: .5rem;
          }
          .toolbar button,
          .toolbar a {
            width: 100%;
            text-align: center;
            display: block;
            box-sizing: border-box;
            max-width: 100%;
          }
        }
        .paperWrap {
          width: min(100%, 8.5in);
          margin: 0.65rem auto;
          overflow: hidden;
        }
        .paper {
          width: 8.5in;
          height: 11in;
          background: #fff;
          box-shadow: 0 10px 30px rgba(0,0,0,.18);
          border-radius: 0.4rem;
          overflow: hidden;
        }
        .paper iframe {
          width: 100%;
          height: 100%;
          border: 0;
          background: #fff;
        }
        @media print {
          html, body { background: #fff; color: #000; }
          .toolbar { display: none; }
          .paperWrap {
            margin: 0;
            width: 8.5in;
            transform: none !important;
            transform-origin: top left;
            break-after: page;
            page-break-after: always;
          }
          .paperWrap:last-of-type {
            break-after: auto;
            page-break-after: auto;
          }
          .paper {
            box-shadow: none;
            border-radius: 0;
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="toolbar">
        <div><strong>Ready to export:</strong> Use your browser Print → Save as PDF</div>
        <div>
          <button type="button" onclick="window.print()">Print / Save as PDF</button>
          <a href="/editor/index.php?doc=<?php echo htmlspecialchars(rawurlencode($doc), ENT_QUOTES, 'UTF-8'); ?>" style="appearance: none;border: 1px solid rgba(15, 23, 42, 0.18) !important;background: #333 !important;padding: 3px 8px;border-radius: 9px;color:#fff !important">Back to editor</a>
        </div>
      </div>

      <?php foreach ($pages as $i => $p):
        $frameId = 'docFrame' . $i;
      ?>
        <div class="paperWrap" aria-label="Export preview: <?php echo htmlspecialchars($p['label'], ENT_QUOTES, 'UTF-8'); ?>">
          <div class="paper">
            <iframe id="<?php echo htmlspecialchars($frameId, ENT_QUOTES, 'UTF-8'); ?>" title="<?php echo htmlspecialchars($p['label'], ENT_QUOTES, 'UTF-8'); ?>" sandbox="allow-same-origin"></iframe>
          </div>
        </div>
      <?php endforeach; ?>

      <script>
        const pages = <?php echo json_encode($pages, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
        pages.forEach((p, i) => {
          const frame = document.getElementById('docFrame' + i);
          if (frame) frame.srcdoc = p.html || '';
        });

        function fitExportPapers() {
          const wraps = document.querySelectorAll('.paperWrap');
          wraps.forEach((wrap) => {
            const paper = wrap.querySelector('.paper');
            if (!paper) return;

            paper.style.transform = '';
            paper.style.transformOrigin = '';
            wrap.style.height = '';

            const wrapW = wrap.clientWidth;
            const paperW = paper.offsetWidth;
            const paperH = paper.offsetHeight;
            if (!wrapW || !paperW || !paperH) return;

            if (wrapW >= paperW) {
              return;
            }

            const scale = Math.max(0.2, Math.min(1, wrapW / paperW));
            paper.style.transformOrigin = 'top left';
            paper.style.transform = `scale(${scale})`;
            wrap.style.height = (paperH * scale) + 'px';
          });
        }

        fitExportPapers();
        window.addEventListener('resize', fitExportPapers);
      </script>
    </body>
    </html>
    <?php
    exit;
}

if ($action === 'login') {
    resume_editor_start_session();
    if (resume_editor_is_logged_in()) {
        header('Location: /editor/index.php');
        exit;
    }

    $error = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        if (resume_editor_login($username, $password)) {
            header('Location: /editor/index.php');
            exit;
        }
        $error = 'Invalid username or password.';
    }

    $csrf = resume_editor_csrf_token();
    ?>
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Resume Editor Login</title>
      <link rel="stylesheet" href="/style.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      <style>
        :root {
          --re-bg: #f1f5f9;
          --re-panel: rgba(255, 255, 255, 0.92);
          --re-panel-border: rgba(15, 23, 42, 0.10);
          --re-text: rgba(15, 23, 42, 0.92);
          --re-subtle: rgba(15, 23, 42, 0.62);
          --re-input: rgba(255, 255, 255, 0.98);
          --re-input-border: rgba(15, 23, 42, 0.16);
        }
        body {
          background:
            radial-gradient(900px 520px at 20% -10%, rgba(56, 189, 248, 0.16), transparent 55%),
            radial-gradient(800px 520px at 85% 0%, rgba(167, 139, 250, 0.14), transparent 55%),
            var(--re-bg);
          color: var(--re-text);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .card.bs-panel {
          background: var(--re-panel) !important;
          color: var(--re-text);
          border: 1px solid var(--re-panel-border) !important;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
        }
        .bs-subtle { color: var(--re-subtle) !important; }
        .form-control {
          background: var(--re-input);
          border-color: var(--re-input-border);
          color: rgba(15, 23, 42, 0.92);
        }

        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear {
          display: none;
        }
        .form-control:focus { box-shadow: 0 0 0 .25rem rgba(56, 189, 248, .18); border-color: rgba(56, 189, 248, .65); }
        .form-floating > label { color: rgba(15, 23, 42, 0.55); }
      </style>
    </head>
    <body>
      <div class="container" style="max-width:560px;">
        <div class="card p-4 p-md-5 bs-card bs-panel">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="bs-icon" aria-hidden="true"><i class="fa-solid fa-lock"></i></div>
            <div>
              <h1 class="h4 mb-1">Resume Editor</h1>
              <div class="bs-subtle">Login required</div>
            </div>
          </div>

          <?php if ($error): ?>
            <div class="alert alert-danger" role="alert"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
          <?php endif; ?>

          <?php if (!RESUME_EDITOR_USERNAME || !RESUME_EDITOR_PASSWORD_HASH): ?>
            <div class="alert alert-warning" role="alert">
              Login is not configured yet. Please set the <strong>RESUME_EDITOR_USERNAME</strong> and <strong>RESUME_EDITOR_PASSWORD_HASH</strong>
              environment variables for this container.
            </div>
          <?php endif; ?>

          <form method="post" action="/editor/index.php?action=login" class="d-grid gap-3">
            <input type="hidden" name="csrf" value="<?php echo htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8'); ?>" />

            <div class="form-floating">
              <input class="form-control" id="username" name="username" placeholder="Username" autocomplete="username" required />
              <label for="username">Username</label>
            </div>

            <div class="form-floating">
              <input class="form-control" id="password" name="password" type="password" placeholder="Password" autocomplete="current-password" required />
              <label for="password">Password</label>
            </div>

            <button class="btn btn-primary bs-primary btn-lg" type="submit">Log in</button>
          </form>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/js/all.min.js" crossorigin="anonymous"></script>
      <script>
        (() => {
          const form = document.querySelector('form[action="/editor/index.php?action=login"]');
          const username = document.getElementById('username');
          const password = document.getElementById('password');

          function submitLogin() {
            if (!form) return;
            if (typeof form.requestSubmit === 'function') {
              form.requestSubmit();
            } else {
              form.submit();
            }
          }

          function onEnter(e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            submitLogin();
          }

          username?.addEventListener('keydown', onEnter);
          password?.addEventListener('keydown', onEnter);
        })();
      </script>
    </body>
    </html>
    <?php
    exit;
}

resume_editor_require_login();
$docContent = file_exists($activePath) ? (string)file_get_contents($activePath) : '';
$csrf = resume_editor_csrf_token();
?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Resume Editor</title>
  <link rel="stylesheet" href="/style.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    :root {
      --re-bg: #f1f5f9;
      --re-panel: rgba(255, 255, 255, 0.92);
      --re-panel-border: rgba(15, 23, 42, 0.10);
      --re-text: rgba(15, 23, 42, 0.92);
      --re-subtle: rgba(15, 23, 42, 0.62);
      --re-input: rgba(255, 255, 255, 0.98);
      --re-input-border: rgba(15, 23, 42, 0.16);
      --re-pane-h: calc(100svh - 240px);
    }

    body {
      background:
        radial-gradient(900px 520px at 20% -10%, rgba(56, 189, 248, 0.16), transparent 55%),
        radial-gradient(800px 520px at 85% 0%, rgba(167, 139, 250, 0.14), transparent 55%),
        var(--re-bg);
      color: var(--re-text);
    }

    .re-layout { display:grid; grid-template-columns: 1fr 1.6fr; gap: 18px; }
    .re-layout > * { min-width: 0; }
    @media (max-width: 992px) { .re-layout { grid-template-columns: 1fr; } }

    @media (min-width: 993px) {
      .re-layout {
        justify-content: center;
        grid-template-columns: minmax(0, 760px) minmax(0, 860px);
      }
    }

    @media (min-width: 993px) {
      .re-pane--export { grid-column: 1 / -1; }
    }

    .re-left { display:flex; flex-direction: column; gap: 18px; }

    .re-pane--editor,
    .re-pane--preview {
      height: var(--re-pane-h);
      display: flex;
      flex-direction: column;
      min-height: 520px;
    }

    .card.bs-panel {
      background: var(--re-panel) !important;
      color: var(--re-text);
      border: 1px solid var(--re-panel-border) !important;
      box-shadow: 0 16px 38px rgba(15, 23, 42, 0.10);
    }

    .re-editor {
      height: auto;
      min-height: 0;
      flex: 1 1 auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background: var(--re-input);
      border-color: var(--re-input-border);
      color: rgba(15, 23, 42, 0.92);
    }
    .re-editor:focus { box-shadow: 0 0 0 .25rem rgba(56, 189, 248, .18); border-color: rgba(56, 189, 248, .65); }

    .re-preview {
      height: auto;
      min-height: 0;
      flex: 1 1 auto;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid var(--re-panel-border);
      background: rgba(255, 255, 255, 0.65);
    }

    .re-pane--editor form {
      flex: 1 1 auto;
      min-height: 0;
      display: flex !important;
      flex-direction: column;
    }

    .re-pane--editor .re-actions {
      flex: 0 0 auto;
    }

    .re-preview iframe {
      width: 100%;
      height: 100%;
      border: 0;
      background: #fff;
    }

    .re-toolbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between; }
    .re-toolbar .btn { border-radius: var(--bs-border-radius); }
    .re-small { font-size: 0.92rem; color: var(--re-subtle); }

    .re-page-header {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid var(--re-panel-border);
      border-radius: 14px;
      padding: 12px 14px;
    }

    .re-doc-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .re-doc-row .form-select { flex: 1 1 auto; min-width: 220px; }
    .re-doc-row .btn { white-space: nowrap; }

    .re-pane--editor .re-actions .btn { padding: .62rem 1.05rem; font-weight: 650; letter-spacing: .2px; }

    .re-export-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    .re-export-left {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      flex: 1 1 auto;
      min-width: 260px;
    }
    .re-export-right {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: flex-end;
    }
    .re-pane--export .re-export-row .btn,
    .re-pane--export .re-export-row .form-select {
      border-radius: var(--bs-border-radius);
    }
    .re-pane--export .re-export-row .form-select-sm {
      padding-top: .25rem;
      padding-bottom: .25rem;
    }
    .re-actions .btn-primary {
      border: 0;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.98), rgba(14, 165, 233, 0.98));
      box-shadow: 0 10px 24px rgba(14, 165, 233, 0.18);
    }
    .re-actions .btn-primary:hover { filter: brightness(1.03); }
    .re-actions .btn-outline-dark { background: rgba(255, 255, 255, 0.70); }
    .re-actions .btn-outline-dark:hover { background: rgba(2, 132, 199, 0.06); }

    .btn-outline-dark {
      --bs-btn-color: rgba(15, 23, 42, 0.88);
      --bs-btn-border-color: rgba(15, 23, 42, 0.20);
      --bs-btn-hover-bg: rgba(2, 132, 199, 0.08);
      --bs-btn-hover-border-color: rgba(2, 132, 199, 0.35);
      --bs-btn-hover-color: rgba(15, 23, 42, 0.92);
    }

    h1, h2, h3, .h1, .h2, .h3, .h4, .h5 { color: rgba(15, 23, 42, 0.96); }

    .re-toolbar .form-select {
      width: auto;
      background: rgba(255, 255, 255, 0.92);
      border-color: rgba(15, 23, 42, 0.18);
      color: rgba(15, 23, 42, 0.92);
    }
    .re-toolbar .form-select:focus {
      box-shadow: 0 0 0 .25rem rgba(56, 189, 248, .18);
      border-color: rgba(56, 189, 248, .65);
    }

    @media (max-width: 768px) {
      .re-toolbar { align-items: stretch; }
      .re-toolbar-controls {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        width: 100%;
      }
      .re-toolbar-controls .btn,
      .re-toolbar-controls .form-select {
        width: 100%;
      }
      .re-toolbar-controls .btn-group {
        width: 100%;
        grid-column: 1 / -1;
      }
      .re-toolbar-controls .btn-group .btn {
        flex: 1 1 0;
      }
      .re-toolbar-controls .re-doc {
        grid-column: 1 / -1;
        flex-direction: column;
        align-items: stretch;
      }
      .re-toolbar-controls .re-doc-row {
        width: 100%;
      }
      .re-toolbar-controls .re-doc-row .form-select {
        min-width: 0;
      }
      .re-toolbar-controls .re-doc .re-small,
      .re-toolbar-controls .re-doc .re-small {
        margin-left: 2px;
      }
      #status { width: 100%; }
    }

    @media (max-width: 992px) {
      :root { --re-pane-h: calc(100svh - 290px); }

      .re-pane--editor,
      .re-pane--preview {
        min-height: 420px;
      }
      body.re-mode-editor .re-pane--preview { display: none; }
      body.re-mode-preview .re-pane--editor { display: none; }

      body.re-mode-editor .re-mobile-actions { display: none; }
      body.re-mode-preview .re-mobile-actions { display: block; }
    }

    @media (max-width: 992px) {
      .re-mobile-actions { grid-column: 1 / -1; }
      .re-mobile-actions .btn { width: 100%; }
      .re-mobile-actions .re-mobile-actions-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="container-fluid py-4" style="max-width: 1680px;">
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 re-page-header">
      <div>
        <h1 class="h3 mb-1">Resume Editor</h1>
        <div class="re-small">Live preview updates as you type.</div>
      </div>
      <div class="d-flex gap-2">
        <a class="btn btn-outline-dark" href="/" aria-label="Back to site">Back to site</a>
        <a class="btn btn-outline-danger" href="/editor/index.php?action=logout">Log out</a>
      </div>
    </div>

    <div class="re-toolbar mb-3">
      <div class="d-flex flex-wrap gap-2 align-items-center re-toolbar-controls">
        <div class="btn-group d-lg-none" role="group" aria-label="Editor or preview">
          <button type="button" class="btn btn-outline-dark" id="btnShowEditor" aria-pressed="true">Editor</button>
          <button type="button" class="btn btn-outline-dark" id="btnShowPreview" aria-pressed="false">Preview</button>
        </div>
        <div class="d-flex align-items-center gap-2 re-doc">
          <span class="re-small">Document</span>
          <div class="re-doc-row">
            <select class="form-select form-select-sm" id="docSelect">
              <?php foreach ($docs as $fn => $d): ?>
                <option value="<?php echo htmlspecialchars($fn, ENT_QUOTES, 'UTF-8'); ?>" <?php echo $fn === $activeDoc ? 'selected' : ''; ?>>
                  <?php echo htmlspecialchars($d['label'], ENT_QUOTES, 'UTF-8'); ?>
                </option>
              <?php endforeach; ?>
            </select>
            <button type="button" class="btn btn-outline-dark btn-sm" id="btnResetPreview">Reset</button>
            <button type="button" class="btn btn-outline-dark btn-sm" data-bs-toggle="modal" data-bs-target="#tailorModal">Tailor cover</button>
          </div>
        </div>

      </div>
    </div>

    <div class="re-layout">
      <div class="re-left">
        <div class="card p-3 p-md-4 bs-card bs-panel re-pane re-pane--editor">
          <h2 class="h5 mb-3">HTML</h2>
          <form method="post" action="/editor/index.php?action=save" class="d-grid gap-3" id="saveForm">
            <input type="hidden" name="csrf" value="<?php echo htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8'); ?>" />
            <input type="hidden" name="doc" id="activeDoc" value="<?php echo htmlspecialchars($activeDoc, ENT_QUOTES, 'UTF-8'); ?>" />
            <textarea class="form-control re-editor" name="content" id="content" spellcheck="false"><?php echo htmlspecialchars($docContent, ENT_QUOTES, 'UTF-8'); ?></textarea>
            <div class="d-flex flex-wrap gap-2 re-actions">
              <button type="button" class="btn btn-primary" id="btnSave">
                <i class="fa-solid fa-floppy-disk me-2" aria-hidden="true"></i>Save
              </button>
            </div>
          </form>
        </div>

       
      </div>

      <div class="card p-3 p-md-4 bs-card bs-panel re-pane re-pane--preview">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h2 class="h5 mb-0">Preview</h2>
          <div class="d-flex align-items-center gap-2">
            <div class="btn-group" role="group" aria-label="Preview zoom">
              <button type="button" class="btn btn-outline-dark btn-sm" id="btnZoomOut" aria-label="Zoom out">−</button>
              <button type="button" class="btn btn-outline-dark btn-sm" id="btnZoomIn" aria-label="Zoom in">+</button>
            </div>
            <div class="re-small" id="previewZoomLabel" aria-live="polite"></div>
            <button type="button" class="btn btn-outline-dark btn-sm" id="btnFullPreviewHeader">
              <i class="fa-solid fa-file-arrow-down me-2" aria-hidden="true"></i>Full Preview
            </button>
          </div>
        </div>
        <div class="re-small mb-2" id="status" aria-live="polite"></div>
        <div class="re-preview">
          <iframe id="preview" sandbox="allow-same-origin" title="Resume preview"></iframe>
        </div>
      </div>

       <div class="card p-3 p-md-4 bs-card bs-panel re-pane re-pane--export">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h2 class="h5 mb-0">Export</h2>
            <div class="re-small">Opens in new tab</div>
          </div>
          <form method="post" action="/editor/index.php?action=export" id="exportForm" target="_blank">
            <input type="hidden" name="csrf" value="<?php echo htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8'); ?>" />
            <input type="hidden" name="doc" value="<?php echo htmlspecialchars($activeDoc, ENT_QUOTES, 'UTF-8'); ?>" />
            <input type="hidden" name="content" id="exportContent" value="" />
            <input type="hidden" name="export_pdf" id="exportPdfFlag" value="" />
            <input type="hidden" name="job_name" id="exportJobName" value="" />
            <input type="hidden" name="company_name" id="exportCompanyName" value="" />
            <div class="re-export-row mb-2">
              <div class="re-export-left">
                <select class="form-select form-select-sm" name="export_mode" id="exportMode">
                  <option value="current" selected>This document</option>
                  <option value="both">This + another</option>
                </select>
                <select class="form-select form-select-sm" name="export_other" id="exportOther">
                  <?php foreach ($docs as $fn => $d): if ($fn === $activeDoc) continue; ?>
                    <option value="<?php echo htmlspecialchars($fn, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($d['label'], ENT_QUOTES, 'UTF-8'); ?></option>
                  <?php endforeach; ?>
                </select>
              </div>
              <div class="re-export-right re-actions">
                <button type="submit" class="btn btn-outline-dark btn-sm" name="export_pdf" value="1">
                  <i class="fa-solid fa-file-pdf me-2" aria-hidden="true"></i>Export PDF
                </button>
              </div>
            </div>
            <div class="form-check mt-2">
              <input class="form-check-input" type="checkbox" name="export_pdf_alert" id="exportPdfAlert" value="1" checked>
              <label class="form-check-label re-small" for="exportPdfAlert">
                Enable PDF app alert (when configured)
              </label>
            </div>
            <div class="re-small mt-2">If server-side PDF export isn’t configured, this will open a print-friendly page.</div>
          </form>
        </div>
    </div>
  </div>

  <div class="modal fade" id="tailorModal" tabindex="-1" aria-labelledby="tailorModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="h5 modal-title mb-0" id="tailorModalLabel">Tailor Cover Letter</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-grid gap-3">
          <div>
            <label for="tailorJobTitle" class="form-label mb-1">Job title</label>
            <input type="text" id="tailorJobTitle" class="form-control" placeholder="e.g., Senior Cybersecurity Analyst" maxlength="120" />
          </div>
          <div>
            <label for="tailorCompanyName" class="form-label mb-1">Company name</label>
            <input type="text" id="tailorCompanyName" class="form-control" placeholder="e.g., Example Health" maxlength="120" />
          </div>
          <div class="re-small">Used in cover-letter preview/export and export filename.</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-dark" id="btnClearTailor">Clear</button>
          <button type="button" class="btn btn-primary" id="btnSaveTailor">Save</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const textarea = document.getElementById('content');
    const iframe = document.getElementById('preview');
    const statusEl = document.getElementById('status');
    const exportContent = document.getElementById('exportContent');
    const exportForm = document.getElementById('exportForm');
    const exportPdfFlag = document.getElementById('exportPdfFlag');
    const exportJobName = document.getElementById('exportJobName');
    const exportCompanyName = document.getElementById('exportCompanyName');
    const docSelect = document.getElementById('docSelect');
    const exportMode = document.getElementById('exportMode');
    const exportOther = document.getElementById('exportOther');
    const saveForm = document.getElementById('saveForm');
    const btnSave = document.getElementById('btnSave');
    const btnSaveMobile = document.getElementById('btnSaveMobile');
    const btnExportMobile = document.getElementById('btnExportMobile');
    const btnExportPdfMobile = document.getElementById('btnExportPdfMobile');
    const btnFullPreviewHeader = document.getElementById('btnFullPreviewHeader');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const previewZoomLabel = document.getElementById('previewZoomLabel');
    const btnShowEditor = document.getElementById('btnShowEditor');
    const btnShowPreview = document.getElementById('btnShowPreview');
    const tailorJobTitle = document.getElementById('tailorJobTitle');
    const tailorCompanyName = document.getElementById('tailorCompanyName');
    const btnSaveTailor = document.getElementById('btnSaveTailor');
    const btnClearTailor = document.getElementById('btnClearTailor');

    const contactPhone = <?php echo json_encode(resume_editor_contact_phone(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
    const contactPhoneTel = <?php echo json_encode(resume_editor_contact_phone_tel(resume_editor_contact_phone()), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
    const contactEmail = <?php echo json_encode(resume_editor_contact_email(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;

    function getTailorValues() {
      let job = '';
      let company = '';
      try {
        job = (localStorage.getItem('reTailorJobTitle') || '').trim();
        company = (localStorage.getItem('reTailorCompanyName') || '').trim();
      } catch (e) {}
      if (!job) job = 'IT';
      return { job, company };
    }

    function applyPhoneTokens(html) {
      let out = String(html);
      if (contactPhone) {
        out = out.split('{{CONTACT_PHONE_NUMBER}}').join(contactPhone);
        out = out.split('{{CONTACT_PHONE_NUMBER_TEL}}').join(contactPhoneTel || contactPhone);
      }
      if (contactEmail) {
        out = out.split('{{CONTACT_EMAIL}}').join(contactEmail);
        out = out.split('{{CONTACT_EMAIL_MAILTO}}').join(contactEmail);
      }
      const tailor = getTailorValues();
      const companyAt = tailor.company ? (' at ' + tailor.company) : '';
      out = out.split('{{TARGET_JOB_TITLE}}').join(tailor.job);
      out = out.split('{{TARGET_COMPANY_NAME}}').join(tailor.company);
      out = out.split('{{TARGET_COMPANY_AT}}').join(companyAt);
      out = out.split('{{TARGET_HIRING_TEAM_AT}}').join(companyAt);
      return out;
    }

    function setStatus(text) {
      statusEl.textContent = text;
    }

    const PREVIEW_ZOOM_MIN = 0.25;
    const PREVIEW_ZOOM_MAX = 2.0;
    const PREVIEW_ZOOM_STEP = 0.1;

    function getPreviewZoom() {
      try {
        const raw = (localStorage.getItem('rePreviewZoom') || '').trim();
        const n = Number(raw);
        if (Number.isFinite(n) && n > 0) return Math.max(PREVIEW_ZOOM_MIN, Math.min(PREVIEW_ZOOM_MAX, n));
      } catch (e) {}
      return 0.94;
    }

    function setPreviewZoom(next) {
      const n = Math.max(PREVIEW_ZOOM_MIN, Math.min(PREVIEW_ZOOM_MAX, Number(next) || 0.94));
      try { localStorage.setItem('rePreviewZoom', String(n)); } catch (e) {}
      if (previewZoomLabel) previewZoomLabel.textContent = Math.round(n * 100) + '%';
      applyPreviewFit();
    }

    function applyPreviewFit() {
      const container = iframe?.parentElement;
      const doc = iframe?.contentDocument;
      if (!container || !doc) return;

      const isMobilePreview = window.matchMedia('(max-width: 992px)').matches;
      const userZoom = getPreviewZoom();

      const pageEl = doc.querySelector('.resume, .page') || doc.body?.firstElementChild;
      if (!pageEl) return;

      doc.documentElement.style.overflow = 'hidden';
      doc.body.style.overflow = 'hidden';
      doc.body.style.margin = '0';

      if (isMobilePreview) {
        doc.body.style.display = 'block';
        doc.body.style.justifyContent = '';
        doc.body.style.alignItems = '';
      } else {
        doc.body.style.display = 'flex';
        doc.body.style.justifyContent = 'center';
        doc.body.style.alignItems = 'flex-start';
      }

      const prevTransform = pageEl.style.transform;
      const prevOrigin = pageEl.style.transformOrigin;
      pageEl.style.transform = 'none';
      pageEl.style.transformOrigin = isMobilePreview ? 'top left' : 'top center';

      const rect = pageEl.getBoundingClientRect();
      const pageW = rect.width || pageEl.scrollWidth || 0;
      const pageH = rect.height || pageEl.scrollHeight || 0;

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!pageW || !pageH || !cw || !ch) {
        pageEl.style.transform = prevTransform;
        pageEl.style.transformOrigin = prevOrigin;
        return;
      }

      const fit = Math.min(cw / pageW, ch / pageH);
      const effective = Math.max(0.2, Math.min(PREVIEW_ZOOM_MAX, Math.min(userZoom, 10)));
      const needsScroll = effective > fit;

      doc.documentElement.style.overflow = needsScroll ? 'auto' : 'hidden';
      doc.body.style.overflow = needsScroll ? 'auto' : 'hidden';

      if (needsScroll) {
        doc.body.style.display = 'block';
        doc.body.style.justifyContent = '';
        doc.body.style.alignItems = '';
      }

      pageEl.style.transformOrigin = (isMobilePreview || needsScroll) ? 'top left' : 'top center';
      pageEl.style.transform = `scale(${effective})`;
    }

    let raf = 0;
    function updatePreview() {
      const html = textarea.value || '';
      exportContent.value = html;
      iframe.srcdoc = applyPhoneTokens(html);
      setStatus('Preview updated at ' + new Date().toLocaleTimeString());
    }

    function schedulePreviewUpdate() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updatePreview);
    }

    function syncExportFilenameMeta() {
      let job = '';
      let company = '';
      try {
        job = (localStorage.getItem('reTailorJobTitle') || '').trim();
        company = (localStorage.getItem('reTailorCompanyName') || '').trim();
      } catch (e) {}

      if (exportJobName) exportJobName.value = job;
      if (exportCompanyName) exportCompanyName.value = company;
    }

    function syncTailorInputsFromStorage() {
      let job = '';
      let company = '';
      try {
        job = (localStorage.getItem('reTailorJobTitle') || '').trim();
        company = (localStorage.getItem('reTailorCompanyName') || '').trim();
      } catch (e) {}
      if (tailorJobTitle) tailorJobTitle.value = job;
      if (tailorCompanyName) tailorCompanyName.value = company;
    }

    btnSaveTailor?.addEventListener('click', () => {
      const job = (tailorJobTitle?.value || '').trim();
      const company = (tailorCompanyName?.value || '').trim();
      try {
        localStorage.setItem('reTailorJobTitle', job);
        localStorage.setItem('reTailorCompanyName', company);
      } catch (e) {}
      syncExportFilenameMeta();
      updatePreview();
      setStatus('Tailor values saved');
      const modalEl = document.getElementById('tailorModal');
      if (modalEl && window.bootstrap && window.bootstrap.Modal) {
        const instance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        instance.hide();
      }
    });

    btnClearTailor?.addEventListener('click', () => {
      if (tailorJobTitle) tailorJobTitle.value = '';
      if (tailorCompanyName) tailorCompanyName.value = '';
      try {
        localStorage.removeItem('reTailorJobTitle');
        localStorage.removeItem('reTailorCompanyName');
      } catch (e) {}
      syncExportFilenameMeta();
      updatePreview();
      setStatus('Tailor values cleared');
    });

    updatePreview();
    syncTailorInputsFromStorage();
    syncExportFilenameMeta();
    if (previewZoomLabel) previewZoomLabel.textContent = Math.round(getPreviewZoom() * 100) + '%';

    iframe.addEventListener('load', () => {
      applyPreviewFit();
    });

    window.addEventListener('resize', () => {
      applyPreviewFit();
    });

    textarea.addEventListener('input', schedulePreviewUpdate);

    let lastValue = textarea.value;
    docSelect?.addEventListener('change', () => {
      const dirty = (textarea.value || '') !== (lastValue || '');
      if (dirty) {
        const ok = confirm('You have unsaved changes. Switch documents anyway?');
        if (!ok) {
          docSelect.value = <?php echo json_encode($activeDoc, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
          return;
        }
      }
      const next = docSelect.value;
      window.location.href = '/editor/index.php?doc=' + encodeURIComponent(next);
    });

    document.getElementById('btnResetPreview').addEventListener('click', () => {
      updatePreview();
    });

    function setMode(mode) {
      if (mode !== 'editor' && mode !== 'preview') return;
      document.body.classList.toggle('re-mode-editor', mode === 'editor');
      document.body.classList.toggle('re-mode-preview', mode === 'preview');

      if (btnShowEditor) {
        btnShowEditor.classList.toggle('active', mode === 'editor');
        btnShowEditor.setAttribute('aria-pressed', mode === 'editor' ? 'true' : 'false');
      }
      if (btnShowPreview) {
        btnShowPreview.classList.toggle('active', mode === 'preview');
        btnShowPreview.setAttribute('aria-pressed', mode === 'preview' ? 'true' : 'false');
      }

      try { localStorage.setItem('reMode', mode); } catch (e) {}
    }
    let initialMode = 'editor';
    try {
      initialMode = localStorage.getItem('reMode') || 'editor';
    } catch (e) {}
    setMode(initialMode);
    btnShowEditor?.addEventListener('click', () => setMode('editor'));
    btnShowPreview?.addEventListener('click', () => setMode('preview'));

    async function saveAjax() {
      setStatus('Saving…');
      if (btnSave) btnSave.disabled = true;
      if (btnSaveMobile) btnSaveMobile.disabled = true;
      const formData = new FormData(saveForm);
      try {
        const res = await fetch('/editor/index.php?action=save', {
          method: 'POST',
          body: formData,
          headers: { 'X-Requested-With': 'fetch' }
        });
        const data = await res.json();
        if (data && data.success) {
          setStatus('Saved');
          lastValue = textarea.value;
        } else {
          setStatus(data && data.message ? data.message : 'Save failed');
        }
      } catch (e) {
        setStatus('Save failed');
      } finally {
        if (btnSave) btnSave.disabled = false;
        if (btnSaveMobile) btnSaveMobile.disabled = false;
      }
    }

    btnSave?.addEventListener('click', saveAjax);
    btnSaveMobile?.addEventListener('click', saveAjax);
    saveForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAjax();
    });

    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const saveCombo = (isMac && e.metaKey && e.key.toLowerCase() === 's') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 's');
      if (!saveCombo) return;
      e.preventDefault();
      saveAjax();
    });

    exportForm.addEventListener('submit', () => {
      exportContent.value = textarea.value || '';
      syncExportFilenameMeta();
    });

    function submitExport(pdf) {
      if (!exportForm) return;
      if (exportPdfFlag) exportPdfFlag.value = pdf ? '1' : '';
      exportContent.value = textarea.value || '';
      syncExportFilenameMeta();
      if (typeof exportForm.requestSubmit === 'function') {
        exportForm.requestSubmit();
      } else {
        exportForm.submit();
      }
      if (exportPdfFlag) exportPdfFlag.value = '';
    }

    btnExportMobile?.addEventListener('click', () => submitExport(false));
    btnExportPdfMobile?.addEventListener('click', () => submitExport(true));
    btnFullPreviewHeader?.addEventListener('click', () => submitExport(false));

    btnZoomOut?.addEventListener('click', () => {
      setPreviewZoom(getPreviewZoom() - PREVIEW_ZOOM_STEP);
    });
    btnZoomIn?.addEventListener('click', () => {
      setPreviewZoom(getPreviewZoom() + PREVIEW_ZOOM_STEP);
    });

    function syncExportOtherAvailability() {
      const hasOther = exportOther && exportOther.options && exportOther.options.length > 0;
      if (!hasOther) {
        exportMode.value = 'current';
        if (exportMode) exportMode.setAttribute('disabled', 'disabled');
      }
      if (exportOther) {
        exportOther.style.display = exportMode.value === 'both' ? '' : 'none';
      }
    }
    exportMode?.addEventListener('change', syncExportOtherAvailability);
    syncExportOtherAvailability();
  </script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/js/all.min.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>
</html>
