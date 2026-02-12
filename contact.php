<?php 
    // Load shared configuration (includes contact form credentials)
    require __DIR__ . '/config.php';

    // Turn off display of errors/warnings to users
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    
    // Report all errors internally (so they still appear in server logs)
    error_reporting(E_ALL);
    
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block"); // legacy but still useful
    header("Content-Security-Policy: default-src 'self'; script-src 'self'");
    header('Content-Type: application/json; charset=utf-8');
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
        exit;
    }
    
    // Include PHPMailer classes
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    
    require __DIR__ . '/files/PHPMailer/src/Exception.php';
    require __DIR__ . '/files/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/files/PHPMailer/src/SMTP.php';
    
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        // Sanitize inputs
        $name    = strip_tags(trim($_POST['bs_name'] ?? ''));
        $email   = filter_var(trim($_POST['bs_email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $message = strip_tags(trim($_POST['bs_message'] ?? ''));
        $company = strip_tags(trim($_POST['bs_company'] ?? ''));
        $captcha = strtolower(trim($_POST['captcha'] ?? ''));
    
        // Validate fields
        if ($name === '' || $email === '' || $message === '' || $company === '' || $captcha === '') {
            echo json_encode(["success" => false, "message" => "Please fill out all fields."]);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["success" => false, "message" => "Please enter a valid email address."]);
            exit;
        }
        if ($captcha !== 'bs') {
            echo json_encode(["success" => false, "message" => "Captcha failed. Please enter the correct initials."]);
            exit;
        }
        if (strlen($message) > 500) {
           echo json_encode(["success" => false, "message" => "Message is too long. Maximum is 500 characters."]);
           exit; 
        }
    
        $mail = new PHPMailer(true);
    
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = CONTACT_MAIL_USERNAME;
            $mail->Password   = base64_decode(CONTACT_MAIL_APP_PASSWORD_B64); // Gmail App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;
    
            // Recipients
            $fromAddress = defined('CONTACT_MAIL_USERNAME') ? (string)CONTACT_MAIL_USERNAME : '';
            if ($fromAddress === '' || !filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
                throw new Exception('Invalid CONTACT_MAIL_USERNAME configuration.');
            }

            $mail->setFrom($fromAddress, 'brandonsanders.org contact form');
            $mail->addAddress(CONTACT_MAIL_USERNAME);
            $mail->addReplyTo($email, $name);
    
            // Content
            $mail->isHTML(false);
            $mail->Subject = "BrandonSanders.org form submission from $name";
            $mail->Body    = "Name: $name\nEmail: $email\nCompany: $company\nMessage:\n$message\n";
    
            $mail->send();
            echo json_encode(["success" => true, "message" => "Thank you! Your message has been sent."]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "Oops! Something went wrong. Please try again later."]);
        }
    }
?>