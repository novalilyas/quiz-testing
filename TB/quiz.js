// script.js FULL SMOOTH EFFECT VERSION

// DOM READY
window.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.getElementById("loginPage");
  const registerPage = document.getElementById("registerPage");
  const startPage = document.getElementById("startPage");
  const quizBox = document.getElementById("quizBox");
  const leaderboardPage = document.getElementById("leaderboardPage");

  const loginUser = document.getElementById("loginUser");
  const loginPass = document.getElementById("loginPass");
  const regUser = document.getElementById("regUser");
  const regPass = document.getElementById("regPass");

  const goReg = document.getElementById("goReg");
  const goLogin = document.getElementById("goLogin");
  const loginBtn = document.getElementById("loginBtn");
  const regBtn = document.getElementById("regBtn");
  const startBtn = document.getElementById("startBtn");

  // AUDIO ENGINE
  let audioCtx = null;
  function getCtx() {
    return (
      audioCtx ||
      (audioCtx = new (window.AudioContext || window.webkitAudioContext)())
    );
  }
  function tone(freq, dur = 120, type = "sine") {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.3;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + dur / 1000);
    } catch (e) {}
  }
  const SFX = {
    loginOK: () => {
      tone(600, 120);
      setTimeout(() => tone(850, 150), 120);
    },
    loginFail: () => tone(200, 150, "sawtooth"),
    regOK: () => tone(750, 120, "triangle"),
    correct: () => tone(900, 120, "sine"),
    wrong: () => tone(180, 120, "sawtooth")
  };

  // SUPER SMOOTH PAGE EFFECT
  async function swapPage(hideEl, showEl) {
    if (!hideEl || !showEl) return;

    await hideEl.animate(
      [
        { opacity: 1, transform: "scale(1) translateY(0px)" },
        { opacity: 0, transform: "scale(0.9) translateY(-20px)" }
      ],
      {
        duration: 250,
        easing: "ease"
      }
    ).finished;

    hideEl.style.display = "none";
    showEl.style.display = "block";

    await showEl.animate(
      [
        { opacity: 0, transform: "scale(0.9) translateY(20px)" },
        { opacity: 1, transform: "scale(1) translateY(0px)" }
      ],
      {
        duration: 300,
        easing: "ease"
      }
    ).finished;
  }

  // NAVIGATION
  goReg.onclick = () => swapPage(loginPage, registerPage);
  goLogin.onclick = () => swapPage(registerPage, loginPage);

  regBtn.onclick = () => {
    const u = regUser.value.trim();
    const p = regPass.value.trim();
    if (!u || !p) return SFX.loginFail();

    localStorage.setItem(
      "quizUser",
      JSON.stringify({ username: u, password: p })
    );
    SFX.regOK();
    swapPage(registerPage, loginPage);
  };

  loginBtn.onclick = () => {
    const user = JSON.parse(localStorage.getItem("quizUser"));
    if (!user) return SFX.loginFail();

    if (
      loginUser.value === user.username &&
      loginPass.value === user.password
    ) {
      SFX.loginOK();
      localStorage.setItem("loggedInUser", user.username);
      swapPage(loginPage, startPage);
    } else {
      SFX.loginFail();
    }
  };

  // QUIZ DATA (short example)
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
      options: ["Database", "Styling Web", "Server", "Aplikasi Desktop"],
      answer: 1
    },
    {
      question: "JavaScript pertama kali dibuat oleh?",
      options: ["Bill Gates", "Brendan Eich", "Mark Zuckerberg", "Steve Jobs"],
      answer: 1
    }
  ];

  let quiz = [],
    currentQ = 0,
    score = 0;

  function startQuiz() {
    quiz = quizData;
    currentQ = 0;
    score = 0;
    swapPage(startPage, quizBox);
    loadQuestion();
  }
  startBtn.onclick = startQuiz;

  function loadQuestion() {
    const q = quiz[currentQ];
    if (!q) return finishQuiz();

    document.getElementById("question").textContent = q.question;
    const optBox = document.getElementById("options");
    optBox.innerHTML = "";

    q.options.forEach((opt, i) => {
      const div = document.createElement("div");
      div.className = "option";
      div.textContent = opt;
      div.onclick = () => selectAnswer(i);
      optBox.appendChild(div);
    });

    document.getElementById("nextBtn").style.display = "none";
  }

  function selectAnswer(i) {
    const correct = quiz[currentQ].answer;
    const opts = document.querySelectorAll(".option");

    opts.forEach((o, idx) => {
      o.classList.add("disabled");
      if (idx === correct) o.classList.add("correct");
      if (idx === i && i !== correct) o.classList.add("wrong");
    });

    if (i === correct) SFX.correct();
    else SFX.wrong();

    document.getElementById("nextBtn").style.display = "block";
  }

  document.getElementById("nextBtn").onclick = () => {
    currentQ++;
    loadQuestion();
  };

  function finishQuiz() {
    swapPage(quizBox, leaderboardPage);
  }

  // INITIAL PAGE
  if (!localStorage.getItem("loggedInUser")) {
    loginPage.style.display = "block";
  } else {
    startPage.style.display = "block";
  }
});
