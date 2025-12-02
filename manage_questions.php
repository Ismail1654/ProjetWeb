<?php
require_once 'config.php';
require_once 'functions.php';
 
require_auth();
 
$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];
 
$error = '';
$success = '';
 
$quiz_id = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;
$questions = [];
$quiz = null;
 
if (!in_array($role, ['ecole', 'entreprise', 'admin'])) {
    redirect('dashboard.php');
}
 
if ($quiz_id <= 0) {
    $error = "ID de quiz invalide.";
} else {
    try {
        $pdo = connectDB();
 
        $stmt = $pdo->prepare("SELECT quiz_id, title, author_id FROM quizzes WHERE quiz_id = ?");
        $stmt->execute([$quiz_id]);
        $quiz = $stmt->fetch();
 
        if (!$quiz) {
            $error = "Quiz introuvable.";
        } elseif ($quiz['author_id'] != $user_id && $role !== 'admin') {
            $error = "Vous devez être l'auteur du quiz ou admin pour le modifier.";
        }
 
    } catch (PDOException $e) {
        $error = "Erreur DB : " . $e->getMessage();
    }
}