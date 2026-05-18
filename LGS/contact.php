<?php
// Prevent PHP warnings/errors from printing and breaking the JSON response
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $parentName  = $_POST['parent_name'] ?? '';
    $studentName = $_POST['student_name'] ?? '';
    $email       = $_POST['email'] ?? '';
    $phone       = $_POST['phone'] ?? '';
    $dob         = $_POST['dob'] ?? 'Not Provided';
    $grade       = $_POST['grade'] ?? 'Not Selected';
    $message     = $_POST['message'] ?? '';

    // Email settings
    $to = "leagueglobalschool@gmail.com";
    $subject = "New Admission Inquiry / Contact from Website";
    
    // Construct the email body
    $body = "Parent Name: $parentName\n";
    $body .= "Student Name: $studentName\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Date of Birth: $dob\n";
    $body .= "Grade: $grade\n\n";
    $body .= "Message:\n$message\n";

    $headers = "From: no-reply@leagueglobalschool@gmail.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    // If testing locally, simulate success because mail() fails on Windows without an SMTP server
    $serverName = $_SERVER['SERVER_NAME'] ?? '';
    $isLocalhost = in_array($serverName, ['localhost', '127.0.0.1', '::1']) || strpos($serverName, '192.168.') === 0;
    
    if ($isLocalhost) {
        echo json_encode(["success" => true, "note" => "Simulated on localhost"]);
    } else {
        // Send the email and return a JSON response for the AJAX script on a live server
        if (mail($to, $subject, $body, $headers)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false]);
        }
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid Request"]);
}
?>