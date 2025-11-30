<?php
include 'db_connect.php';

$username = $_POST['username'] ?? '';
$result = $conn->query("SELECT * FROM questions");
?>

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Quiz - <?php echo htmlspecialchars($username); ?></title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light">
<div class="container mt-5">
  <h2 class="text-center mb-4">Jawab Semua Pertanyaan!</h2>
  <form action="result.php" method="POST">
    <input type="hidden" name="username" value="<?php echo htmlspecialchars($username); ?>">
    <?php
    $no = 1;
    while ($row = $result->fetch_assoc()) {
      echo "<div class='mb-4'>";
      echo "<p><strong>$no. {$row['question']}</strong></p>";
      foreach (['A', 'B', 'C', 'D'] as $opt) {
        $value = $row['option_' . strtolower($opt)];
        echo "
          <div class='form-check'>
            <input class='form-check-input' type='radio' name='answers[{$row['id']}]' value='$opt' required>
            <label class='form-check-label'>$opt. $value</label>
          </div>
        ";
      }
      echo "</div>";
      $no++;
    }
    ?>
    <button type="submit" class="btn btn-success">Kirim Jawaban</button>
  </form>
</div>
</body>
</html>
