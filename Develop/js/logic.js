// variables to reference DOM element...given <1>
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices")
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");

//global variable that will point to which question is being asked based on its index
var currentQuestionIndex = 0;
///time given 15 seconds per each question <2>
var time = questions.length  * 15;
var timerId;

///sound effects <3>
var sfxRight = new Audio("assets/sfx/correct.wav");
var sfxWrong = new Audio("assets/sfx/incorrect.wav");

//startBtn.onclick = startQuiz();
function startQuiz() {
    //HIDE START SCREEN, UNHIDE QUESTIONS, START TIMER, GET QUESTIONS<1>
    //hide start screen
    var startscreenEl = document.getElementById("start-screen");
    startscreenEl.setAttribute("class", "hide");
    
    //unhide questions element so questions come up
    questionsEl.removeAttribute("class");

    //and start timer starts timer
    //setInterval is a javascript function that takes a callback
    //first variable in interval is what you want to do in the interval
    //second variable is HOW LONG
    timerId = setInterval(clockTick, 1000);

    //SHOW starting time
    timerEl.textContent = time;

    getQuestion()
};

//HOW CLOCK FUNCTIONS
function clockTick() {
    //update time
    time--; // time = time - 1
    timerEl.textContent = time;

    //check to see if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function getQuestion() {
    //get current question object from array
    ///was set to 0 on line 10
    var currentQuestion = questions[currentQuestionIndex];

    //update title with current question
    //questions was unhidden on line 26 by removing class
    //question-title was initially hidden so now it needs to get got
    var titleEl = document.getElementById("question-title");
    titleEl.textContent = currentQuestion.title;

    //clear out any old question choices
    choicesEl.innerHTML = "";

    //loop over choices "for each choice at index i"
    currentQuestion.choices.forEach(function(choice, i) {
        //create new button for each choice
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);
//<button class = "choice" value = "Cascading Style Sheets"> </button>

        //TEXT CONTENT IS WHAT IS DISPLAYED ON SCREEN
        choiceNode.textContent = i + 1 + "." + choice;
//<button class = "choice" value = "Cascading Style Sheets">1. Cascading Style Sheets </button>


        //attack click event listener to each choice
        choiceNode.onclick = questionClick;

        //display on the page
        choicesEl.appendChild(choiceNode);
    });
}

//questionClick is the behavior that is going to happen when a particular button is pressed
function questionClick() {
    //check if user guessed wrong
    //inside of a child node it knows whivh 
    if (this.value !== questions[currentQuestionIndex].answer) {
        //penalize time
        time -= 15; // time = time -15
        //check to see if time is less than 0...if it is then equate it to 0
        if (time < 0) {
            time = 0;
        }
    
        //display new time on page
        timerEl.textContent = time;

        //play "wrong" sound effect
        sfxWrong.play();

        feedbackEl.textContent = "Wrong!";
    }
        else {
        //play "right sound effect
        sfxRight.play();

        feedbackEl.textContent = "Correct!";
    }


//taking feedbackEl and set attribute on it
    //flash right/wrong feedback on page for half a second
//feedback is styled in css
    feedbackEl.setAttribute("class", "feedback");
    setTimeout(function() {
//blinking feedback
        feedbackEl.setAttribute("class", "feedback hide");
}, 1000);

    //move to next question
    currentQuestionIndex++;

    //check if we've run out of questions
    if (currentQuestionIndex === questions.length) {
        quizEnd();
    }
        else {
            getQuestion();
        }
};

function quizEnd() {
    //stop timer
    //whenever an interval is set it needs to be cleared...just need to supply timerId
    clearInterval(timerId);

    //show end screen
    var endScreenEl = document.getElementById("end-screen");
    endScreenEl.removeAttribute("class");

    //show final score
    var finalScoreEl = document.getElementById("final-score");
    finalScoreEl.textContent = time;

    //hide questions section
    questionsEl.setAttribute("class", "hide");
};

function saveHighscore() {
    //get value of input box
    //trim removes any white space so not saving any blank/empty spaces
    var initials = initialsEl.value.trim();

    //make sure value was not empty
    // "" means a blank string
    if (initials !== "") {
        //get saved scores from local storage, or if not any, set to empty array
        //var highscores = [];
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        //format new score object for current user...going to be an array of objects... score: time, and initials
        var newScore = {
            score: time,
            initials: initials
        };

        //save to local storage
        //set item to highscores and stringify it
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        //redirect to next page
        window.location.href="highscores.html";
    }
}


function checkForEnter(event) {
    if (event.key === "Enter") {
        saveHighscore();
    }
}

submitBtn.onclick = saveHighscore;

//user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;

// ///user clicks start button to start quiz...select button then add onclick <4>
// startBtn.addEventListener("click", function(){
//     //hide start screen AND

//     var startScreenEl = document.getElementById("start-screen");
//     startScreenEl.setAttribute("class", "hide");
//     //unhide questions element so questions come up
//     questionsEl.removeAttribute("class");
//     //AND show and start timer starts timer
//     timerId = setInterval(clockTick, 1000);
//     //show starting time
//     timerEl.textContent = time;
//     getQuestion()
//         //update time
//         time--;
//         TimerEl.textContent = time;
//         //check if user ran out of time
//         if (time <= 0) {
//             quizEnd();
//         }
// })