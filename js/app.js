const API_ALL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const API_SINGLE = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const API_SEARCH = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";


let allIssues = [];


// LOGIN  function to check the dashboard access..........
function login(){

const user = document.getElementById("username").value;
const pass = document.getElementById("password").value;

if(user === "admin" && pass === "admin123"){
window.location.href = "./dashboard.html";
}
else{
alert("Invalid Credentials");
}

}




// LOAD ALL ISSUES ..............
async function loadIssues(){

showLoader(true);

try{

const res = await fetch(API_ALL);
const data = await res.json();

allIssues = data.data;

displayIssues(allIssues);

}
catch(err){
console.log(err);
}

showLoader(false);

}






// DISPLAY ISSUES
function displayIssues(issues){

const container = document.getElementById("issues-container");

container.innerHTML = "";

document.getElementById("issueCount").innerText =
issues.length + " Issues";

issues.forEach(issue => {

const card = document.createElement("div");

card.className = `issue-card ${issue.status}`;

let priorityClass = "";

if(issue.priority.toLowerCase() === "high"){
priorityClass = "priority-high";
}
else if(issue.priority.toLowerCase() === "medium"){
priorityClass = "priority-medium";
}
else{
priorityClass = "priority-low";
}

card.innerHTML = `

<div class="card-top">

<img class="status-icon" src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png'}">

<span class="priority ${priorityClass}">
${issue.priority}
</span>

</div>

<h3 class="issue-title">
${issue.title}
</h3>

<p class="issue-desc">
${issue.description}
</p>

<div class="labels">
${getLabelBadges(issue.labels)}
</div>

<div class="card-divider"></div>


<div class="meta">

<span>#${issue.id} by ${issue.author}</span>

</div>

<div class="meta">
${new Date(issue.createdAt).toLocaleDateString()}
</div>

`;

card.onclick = () => openModal(issue.id);

container.appendChild(card);

});

}



// FILTER ISSUES
function filterIssues(type,btn){

document.querySelectorAll(".tab").forEach(tab=>{
tab.classList.remove("active");
});

btn.classList.add("active");

/* loader show */
showLoader(true);

setTimeout(()=>{

if(type === "all"){
displayIssues(allIssues);
}
else{

const filtered = allIssues.filter(issue => issue.status === type);

displayIssues(filtered);

}

/* loader hide */
showLoader(false);

},600);

}
function getLabelBadges(labels){

if(!labels) return "";

let badges = "";

labels.forEach(label => {

label = label.toLowerCase();

if(label.includes("bug")){
badges += `<span class="badge bug">🐞 BUG</span>`;
}

else if(label.includes("help")){
badges += `<span class="badge help">⚠ HELP WANTED</span>`;
}

else if(label.includes("enhancement")){
badges += `<span class="badge enhancement">✨ ENHANCEMENT</span>`;
}

else if(label.includes("good first issue")){
badges += `<span class="badge enhancement">🌱 GOOD FIRST ISSUE</span>`;
}

else if(
label.includes("docs") ||
label.includes("doc") ||
label.includes("documentation")
){
badges += `<span class="badge help">📄 DOCUMENTS</span>`;
}

});

return badges;

}


// Modals features 
async function openModal(id){

const modal = document.getElementById("issueModal");
modal.style.display = "block";

showLoader(true);

try{

const res = await fetch(API_SINGLE + id);
const data = await res.json();
const issue = data.data;

document.getElementById("modalTitle").innerText = issue.title;
const statusElement = document.getElementById("modalStatus");

if(issue.status === "open"){
statusElement.innerText = "Opened";
statusElement.className = "status-open";
}else{
statusElement.innerText = "Closed";
statusElement.className = "status-closed";
}

document.getElementById("modalAuthor").innerText =
"Opened by " + issue.author;

document.getElementById("modalDate").innerText =
"• " + new Date(issue.createdAt).toLocaleDateString();

document.getElementById("modalDescription").innerText =
issue.description;

document.getElementById("modalAssignee").innerText =
issue.author;

let priorityClass = "";

if(issue.priority.toLowerCase() === "high"){
priorityClass = "priority priority-high";
}
else if(issue.priority.toLowerCase() === "medium"){
priorityClass = "priority priority-medium";
}
else{
priorityClass = "priority priority-low";
}

document.getElementById("modalPriority").innerHTML =
`<span class="${priorityClass}">${issue.priority}</span>`;

document.getElementById("modalLabels").innerHTML =
getLabelBadges(issue.labels);

}
catch(err){
console.log(err);
}

showLoader(false);

}



// CLOSE MODAL
function closeModal(){
document.getElementById("issueModal").style.display = "none";
}



// SEARCH issues
async function searchIssue(){

const text = document.getElementById("searchInput").value.trim();

if(!text){
displayIssues(allIssues);
return;
}

showLoader(true);

try{

const res = await fetch(API_SEARCH + text);
const data = await res.json();

displayIssues(data.data);

}
catch(err){
console.log(err);
}

showLoader(false);

}



// LOADER
function showLoader(state){

const loader = document.getElementById("loader");

if(state){
loader.style.display = "block";
}else{
loader.style.display = "none";
}

}



// AUTO LOAD
if(window.location.pathname.includes("dashboard.html")){
loadIssues();
}
