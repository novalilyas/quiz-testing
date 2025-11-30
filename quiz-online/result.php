<?php
include 'db_connect.php';

$username = $_POST['username'] ?? '';
$answers = $_POST['answers'] ?? [];

$score = 0;
$total = count($answers);

foreach ($answers as $id => $answer) {
  $query = $conn->query("SELECT correct_answer FROM questions WHERE id = $id");
  $row = $query->fetch_assoc();
  if ($row['correct_answer'] === $answer) {
    $score += 20; // 5 soal × 20 poin = 100 total
  }
}

// Simpan ke database
$stmt = $conn->prepare("INSERT INTO scores (username, score) VALUES (?, ?)");
$stmt->bind_param("si", $username, $score);
$stmt->execute();
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Hasil Quiz</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light text-center d-flex flex-column justify-content-center align-items-center vh-100">
  <div>
    <h2>Hasil Quiz</h2>
    <p>Nama: <strong><?php echo htmlspecialchars($username); ?></strong></p>
    <p>Nilai Anda: <strong><?php echo $score; ?></strong> dari 100</p>
    <a href="index.php" class="btn btn-primary mt-3">Ulangi Quiz</a>
  </div>
</body>
</html>
