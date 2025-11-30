<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quiz Online</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body class="bg-light d-flex align-items-center justify-content-center vh-100">
  <div class="text-center">
    <h1 class="mb-4">🎯 Quiz Online</h1>
    <form action="quiz.php" method="POST">
      <input type="text" name="username" class="form-control mb-3" placeholder="Masukkan nama Anda" required>
      <button class="btn btn-primary btn-lg" type="submit">Mulai Quiz</button>
    </form>
  </div>
</body>
</html>
