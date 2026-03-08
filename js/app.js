const API_ALL = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const API_SINGLE = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";
const API_SEARCH = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";


let allIssues = [];


// LOGIN  function to check the dashboard access
function login(){

const user = document.getElementById("username").value;
const pass = document.getElementById("password").value;

if(user === "admin" && pass === "admin123"){
window.location.href = "dashboard.html";
}
else{
alert("Invalid Credentials");
}

}
