const quizData = [
  {
    question: "Apa kepanjangan dari HTML?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks Text Making Language"
    ],
    answer: 0
  },
  {
    question: "CSS digunakan untuk?",
    options: [
      "Membuat database",
      "Styling halaman web",
      "Membuat server",
      "Membuat aplikasi desktop"
    ],
    answer: 1
  },
  {
    question: "JavaScript pertama kali dibuat oleh?",
    options: ["Bill Gates", "Brendan Eich", "Mark Zuckerberg", "Steve Jobs"],
    answer: 1
  },
  {
    question: "Apa fungsi dari tag <img> di HTML?",
    options: [
      "Membuat link",
      "Menampilkan gambar",
      "Membuat tabel",
      "Membuat form"
    ],
    answer: 1
  },
  {
    question: "Mana yang bukan termasuk tipe data di JavaScript?",
    options: ["String", "Boolean", "Float", "Undefined"],
    answer: 2
  },
  {
    question: "Apa kepanjangan dari JSON?",
    options: [
      "JavaScript Object Notation",
      "Java Standard Object Naming",
      "JavaScript Oriented Network",
      "Java Simple Object Notation"
    ],
    answer: 0
  },
  {
    question: "Tag HTML untuk membuat list tidak berurutan?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    answer: 1
  },
  {
    question: "Method JavaScript untuk menampilkan alert?",
    options: ["msg()", "alert()", "message()", "popup()"],
    answer: 1
  },
  {
    question: "Apa fungsi dari 'display: flex' di CSS?",
    options: [
      "Membuat animasi",
      "Membuat layout flexible",
      "Menghapus element",
      "Membuat border"
    ],
    answer: 1
  },
  {
    question: "HTTP adalah singkatan dari?",
    options: [
      "Hyper Text Transfer Protocol",
      "High Transfer Text Protocol",
      "Home Text Transfer Protocol",
      "Hyperlink Transfer Text Protocol"
    ],
    answer: 0
  }
];

let currentUser = null;
let quiz = [];
let currentQuestion = 0;
let score = 0;
let wrongAnswers = 0;
let timeLeft = 30;
let timerInterval;
let startTime;
let totalTimeTaken = 0;

// =========================================================
// 🔊 LOAD SOUND EFFECT (MP3)
// =========================================================
const correctSound = new Audio("correct.mp3");
const wrongSound = new Audio("wrong.mp3");

correctSound.preload = "auto";
wrongSound.preload = "auto";

function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playWrongSound() {
  wrongSound.currentTime = 0;
  wrongSound.play();
}

// =========================================================
// LOGIN FUNCTION
// =========================================================
function login() {
  const username = document.getElementById("usernameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();

  if (!username || !email) {
    alert("Mohon isi username dan email!");
    return;
  }

  if (!email.includes("@")) {
    alert("Format email tidak valid!");
    return;
  }

  currentUser = {
    username: username,
    email: email,
    loginTime: new Date().toISOString()
  };

  showPage("dashboardPage");
  updateDashboard();
}

function logout() {
  currentUser = null;
  document.getElementById("usernameInput").value = "";
  document.getElementById("emailInput").value = "";
  showPage("loginPage");
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");
}

// =========================================================
// UPDATE DASHBOARD
// =========================================================
function updateDashboard() {
  if (!currentUser) return;

  document.getElementById("userName").textContent = currentUser.username;
  document.getElementById("userEmail").textContent = currentUser.email;
  document.getElementById("userAvatar").textContent = currentUser.username
    .charAt(0)
    .toUpperCase();

  const allScores = JSON.parse(localStorage.getItem("quizScores") || "[]");
  const userScores = allScores.filter(
    (s) => s.username === currentUser.username
  );

  const totalQuizzes = userScores.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          userScores.reduce((sum, s) => sum + s.percentage, 0) / totalQuizzes
        )
      : 0;
  const bestScore =
    totalQuizzes > 0 ? Math.max(...userScores.map((s) => s.percentage)) : 0;

  document.getElementById("totalQuizzes").textContent = totalQuizzes;
  document.getElementById("avgScore").textContent = avgScore + "%";
  document.getElementById("bestScore").textContent = bestScore + "%";

  const leaderboard = calculateLeaderboard();
  const userRankIndex = leaderboard.findIndex(
    (p) => p.username === currentUser.username
  );
  document.getElementById("userRank").textContent =
    userRankIndex >= 0 ? "#" + (userRankIndex + 1) : "-";

  displayLeaderboard();
}

// =========================================================
// LEADERBOARD
// =========================================================
function calculateLeaderboard() {
  const allScores = JSON.parse(localStorage.getItem("quizScores") || "[]");
  const players = {};

  allScores.forEach((score) => {
    if (!players[score.username]) {
      players[score.username] = {
        username: score.username,
        totalQuizzes: 0,
        totalScore: 0,
        bestScore: 0,
        totalTime: 0
      };
    }

    players[score.username].totalQuizzes++;
    players[score.username].totalScore += score.percentage;
    players[score.username].bestScore = Math.max(
      players[score.username].bestScore,
      score.percentage
    );
    players[score.username].totalTime += score.time;
  });

  return Object.values(players).sort((a, b) => b.bestScore - a.bestScore);
}

function displayLeaderboard() {
  const leaderboard = calculateLeaderboard();
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";

  leaderboard.forEach((player, index) => {
    const rankClass =
      index === 0
        ? "rank-1"
        : index === 1
        ? "rank-2"
        : index === 2
        ? "rank-3"
        : "rank-other";

    const item = `
        <div class="leaderboard-item">
            <div class="rank-badge ${rankClass}">${index + 1}</div>
            <div class="player-info">
                <div class="player-name">${player.username}</div>
                <div class="player-stats">
                    ${player.totalQuizzes}x main • Best: ${player.bestScore}%
                </div>
            </div>
            <div class="player-score">${player.bestScore}%</div>
        </div>
      `;
    list.innerHTML += item;
  });
}

// =========================================================
// QUIZ
// =========================================================
function startQuiz() {
  quiz = quizData;
  currentQuestion = 0;
  score = 0;
  wrongAnswers = 0;
  totalTimeTaken = 0;

  showPage("quizPage");
  loadQuestion();
}

function loadQuestion() {
  const q = quiz[currentQuestion];

  document.getElementById("question").textContent = q.question;
  document.getElementById("currentQ").textContent = currentQuestion + 1;
  document.getElementById("totalQ").textContent = quiz.length;

  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => selectOption(i);
    optionsBox.appendChild(div);
  });

  startTimer();
  updateProgress();
}

function startTimer() {
  timeLeft = 30;
  document.getElementById("timeLeft").textContent = timeLeft;
  document.getElementById("timer").classList.remove("warning");

  clearInterval(timerInterval);
  startTime = Date.now();

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timeLeft").textContent = timeLeft;

    if (timeLeft <= 10) {
      document.getElementById("timer").classList.add("warning");
    }

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      wrongAnswers++;
      nextQuestion();
    }
  }, 1000);
}

// =========================================================
// 🔊 SELECT OPTION (ADA EFEK SUARA)
// =========================================================
function selectOption(i) {
  clearInterval(timerInterval);

  const options = document.querySelectorAll(".option");
  const correct = quiz[currentQuestion].answer;

  options.forEach((opt) => opt.classList.add("disabled"));

  if (i === correct) {
    playCorrectSound(); // 🔊 SUARA BENAR
    options[i].classList.add("correct");
    score++;
  } else {
    playWrongSound(); // 🔊 SUARA SALAH
    options[i].classList.add("wrong");
    options[correct].classList.add("correct");
    wrongAnswers++;
  }

  document.getElementById("nextBtn").style.display = "block";

  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  totalTimeTaken += timeSpent;
}

function nextQuestion() {
  document.getElementById("nextBtn").style.display = "none";

  currentQuestion++;
  if (currentQuestion >= quiz.length) {
    finishQuiz();
  } else {
    loadQuestion();
  }
}

function finishQuiz() {
  showPage("resultsPage");

  const percentage = Math.round((score / quiz.length) * 100);

  document.getElementById("finalScore").textContent = percentage + "%";
  document.getElementById("correctAnswers").textContent = score;
  document.getElementById("wrongAnswers").textContent = wrongAnswers;
  document.getElementById("totalTime").textContent = totalTimeTaken + "s";

  document.getElementById("scoreMessage").textContent =
    percentage >= 80
      ? "🔥 Luar Biasa!"
      : percentage >= 60
      ? "Bagus!"
      : "Tetap Semangat!";

  const allScores = JSON.parse(localStorage.getItem("quizScores") || "[]");

  allScores.push({
    username: currentUser.username,
    percentage: percentage,
    time: totalTimeTaken
  });

  localStorage.setItem("quizScores", JSON.stringify(allScores));
  updateDashboard();
}

function updateProgress() {
  const fill = document.getElementById("progressBar");
  const percent = (currentQuestion / quiz.length) * 100;
  fill.style.width = percent + "%";
}

function backToDashboard() {
  showPage("dashboardPage");
  updateDashboard();
}
