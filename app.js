const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

const questionSection = document.querySelector("#questions-container");
const choiceOne = document.querySelector(".choice-one");
const choiceTwo = document.querySelector(".choice-two");
const choiceThree = document.querySelector(".choice-three");
const choiceFour = document.querySelector(".choice-four");
const question = document.querySelector("#question");
const start = document.querySelector("#start");
const mainSection = document.querySelector("#main-section");
const done = document.querySelector("#done");
const response = document.querySelector("#response");
const finalScore = document.querySelector("#score");
const timeId = document.querySelector("#timeLeft");
const submitButton = document.querySelector("#submit");
const highScores = document.querySelector("#highscores-section");
const back = document.querySelector("#back");
let highScoresList = document.querySelector("#scores-list");
const clearButton = document.querySelector("#clear");
let quizStarted = false;
let currentQuestion = 0;
let score = 0;
let timeLeft = 50;
let timer;

const items = JSON.parse(localStorage.getItem("items")) || [];

function startQuiz() {
  quizStarted = true;
  mainSection.style.display = "none";
  questionSection.style.display = "block";
  createQuestion();

  // Start the countdown timer
  timer = setInterval(() => {
    timeLeft--;
    timeId.innerHTML = `Time Left: ${timeLeft}s`;
    if (timeLeft === 0 || timeLeft < 0 || currentQuestion > 4) {
      clearInterval(timer);
      endQuiz();
      timeId.innerHTML = "Time Left: 0s";
      finalScore.innerHTML = score;
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 50;
  timeId.innerHTML = `Time Left: ${timeLeft}s`;
}

function createQuestion() {
  if (currentQuestion < questions.length) {
    question.innerHTML = questions[currentQuestion].questionText;
    choiceOne.innerHTML = questions[currentQuestion].options[0];
    choiceTwo.innerHTML = questions[currentQuestion].options[1];
    choiceThree.innerHTML = questions[currentQuestion].options[2];
    choiceFour.innerHTML = questions[currentQuestion].options[3];
  }
}

function checkAnswer(e) {
  if (quizStarted) {
    if (e.target.innerHTML === questions[currentQuestion].answer) {
      score++;
      response.innerHTML = "Correct!";
    } else {
      response.innerHTML = "Incorrect!";
      timeLeft -= 10;
      score--;
    }
    currentQuestion++;
    createQuestion();
  }

  if (currentQuestion > 4) {
    endQuiz();
    finalScore.innerHTML = score;
    quizStarted = false;
  }
}

function endQuiz() {
  quizStarted = false;
  questionSection.style.display = "none";
  done.style.display = "block";
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  resetTimer();
  response.innerHTML = "";
}

start.addEventListener("click", () => {
  if (!quizStarted) {
    resetQuiz();
    startQuiz();
  }
});

choiceOne.addEventListener("click", checkAnswer);
choiceTwo.addEventListener("click", checkAnswer);
choiceThree.addEventListener("click", checkAnswer);
choiceFour.addEventListener("click", checkAnswer);

back.addEventListener("click", () => {
  highScores.style.display = "none";
  mainSection.style.display = "block";
});

submitButton.addEventListener("click", () => {
  // Get the input value
  let text = document.querySelector("#input").value;

  const item = {
    input: text,
    score: score,
  };

  items.push(item);
  populateList(items, highScoresList);
  localStorage.setItem("items", JSON.stringify(items));
  document.querySelector("#input").value = "";
  done.style.display = "none";
  highScores.style.display = "block";
});

function populateList(plates = [], platesList) {
  // Sort the plates array by score in descending order
  plates.sort((a, b) => b.score - a.score);

  platesList.innerHTML = plates
    .map((plate, i) => {
      return `
        <li>${plate.input} score is ${plate.score}</li>
        `;
    })
    .join("");
}

populateList(items, highScoresList);

// Add event listener to clear button
clearButton.addEventListener("click", () => {
  // Clear the items array
  items.length = 0;
  // Update the UI with empty list
  populateList(items, highScoresList);
  // Clear local storage
  localStorage.removeItem("items");
});
