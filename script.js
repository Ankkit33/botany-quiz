const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzcsKzw1l7KY1koFxHO0vSmDdXRXmHBIGrwiTmFSH0SwecwEB2mMZvH0xmmPC17JP2G/exec";

let timeLeft = 900;
let timer;
let startTime;

function startQuiz(){

const name = document.getElementById("name").value.trim();
const roll = document.getElementById("roll").value.trim();

if(!name || !roll){
alert("Please enter Name and Roll Number");
return;
}

document.getElementById("studentForm").style.display="none";
document.getElementById("quizSection").style.display="block";

startTime = Date.now();

loadQuestions();
startTimer();
}

function startTimer(){

timer = setInterval(()=>{

timeLeft--;

let minutes = Math.floor(timeLeft/60);
let seconds = timeLeft%60;

document.getElementById("timer").innerText =
String(minutes).padStart(2,"0")+":"+
String(seconds).padStart(2,"0");

if(timeLeft<=0){
clearInterval(timer);
submitQuiz();
}

},1000);
}

function loadQuestions(){

let html="";

questions.forEach((q,index)=>{

html += `

<div class="question">

<p><b>${index+1}. ${q.question}</b></p>

${q.options.map((opt,i)=>`<label> <input type="radio"
name="q${index}"
value="${i}">
${opt} </label><br>`).join("")}

</div>
`;

});

document.getElementById("questionsContainer").innerHTML = html;
}

async function submitQuiz(){

clearInterval(timer);

let score = 0;

questions.forEach((q,index)=>{

const selected =
document.querySelector(
'input[name="q'+index+'"]:checked'
);

if(selected &&
parseInt(selected.value)===q.answer){
score++;
}

});

const total = questions.length;

const correct = score;
const wrong = total-score;

const accuracy =
((score/total)*100).toFixed(2);

const secondsTaken =
900-timeLeft;

const minutes =
Math.floor(secondsTaken/60);

const seconds =
secondsTaken%60;

const timeTaken =
minutes+"m "+seconds+"s";

document.getElementById("quizSection").innerHTML = `

<h2>Quiz Submitted</h2>

<p><b>Score:</b> ${score}/${total}</p>

<p><b>Correct:</b> ${correct}</p>

<p><b>Wrong:</b> ${wrong}</p>

<p><b>Accuracy:</b> ${accuracy}%</p>

<p><b>Time Taken:</b> ${timeTaken}</p>
`;

const payload = {
name: document.getElementById("name").value,
roll: document.getElementById("roll").value,
score: score,
total: total,
timeTaken: timeTaken
};

try{

await fetch(WEBAPP_URL,{
method:"POST",
body:JSON.stringify(payload)
});

}catch(err){

console.log(err);

}

}

async function loadLeaderboard(){

try{

const response = await fetch(WEBAPP_URL);
const data = await response.json();

let html = `

<div style="
background:white;
padding:20px;
border-radius:15px;
margin-top:20px;
">

<h2>🏆 Top 15 Rankers</h2>

<table style="
width:100%;
border-collapse:collapse;
">

<tr>
<th>Rank</th>
<th>Name</th>
<th>Score</th>
</tr>
`;

data.forEach((row,index)=>{

html += `

<tr>
<td>${index+1}</td>
<td>${row[0]}</td>
<td>${row[2]}</td>
</tr>
`;

});

html += `

</table>
</div>
`;

document.getElementById("leaderboard").innerHTML = html;

}catch(err){

console.log(err);

}

}
