<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}



function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function is_admin() {
    return is_logged_in() && ($_SESSION['role'] ?? '') === 'admin';
}

function redirect($location) {
    header("Location: $location");
    exit();
}




function require_auth() {
    if (!is_logged_in()) {
        redirect('login.php');
    }
}
function require_admin() {
    if (!is_admin()) {
        redirect('dashboard.php');
    }
}

function generate_captcha() {
    $num1 = rand(1, 9);
    $num2 = rand(1, 9);
    $_SESSION['captcha_result'] = $num1 + $num2;
    return "$num1 + $num2";
}
function verify_captcha($user_answer) {
    if (isset($_SESSION['captcha_result']) && (int)$user_answer === $_SESSION['captcha_result']) {
        unset($_SESSION['captcha_result']);
        return true;
    }
    return false;
}
