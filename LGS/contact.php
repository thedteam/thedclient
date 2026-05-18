<?php
error_reporting(0);
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $parentName  = $_POST['parent_name'] ?? '';
    $studentName = $_POST['student_name'] ?? '';
    $email       = $_POST['email'] ?? '';
    $phone       = $_POST['phone'] ?? '';
    $dob         = $_POST['dob'] ?? 'Not Provided';
    $grade       = $_POST['grade'] ?? 'Not Selected';
    $message     = $_POST['message'] ?? '';

    $to = "leagueglobalschool@gmail.com";
    $subject = "New Admission Inquiry / Contact from Website";
    
    $body = "Parent Name: $parentName\n";
    $body .= "Student Name: $studentName\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n";
    $body .= "Date of Birth: $dob\n";
    $body .= "Grade: $grade\n\n";
    $body .= "Message:\n$message\n";

    // Drop custom "From" header and -f flag so the server uses its own default trusted address
    $headers = "Reply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid Request"]);
}
?>